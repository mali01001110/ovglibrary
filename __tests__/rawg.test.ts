import { describe, expect, it } from "vitest";
import {
  parseRawgQuery,
  sanitizePageUrl,
  sanitizeListResponse,
} from "@/lib/rawg";

describe("parseRawgQuery", () => {
  it("returns an empty query for empty params", () => {
    expect(parseRawgQuery(new URLSearchParams())).toEqual({});
  });

  it("parses and trims search, capped at 100 chars", () => {
    const long = "a".repeat(200);
    const query = parseRawgQuery(
      new URLSearchParams({ search: `  ${long}  ` })
    );
    expect(query.search).toBe("a".repeat(100));
  });

  it("ignores blank search", () => {
    expect(parseRawgQuery(new URLSearchParams({ search: "   " }))).toEqual({});
  });

  it("clamps page to 1..500", () => {
    expect(parseRawgQuery(new URLSearchParams({ page: "0" })).page).toBe("1");
    expect(parseRawgQuery(new URLSearchParams({ page: "9999" })).page).toBe("500");
    expect(parseRawgQuery(new URLSearchParams({ page: "42" })).page).toBe("42");
  });

  it("rejects non-numeric page", () => {
    expect(parseRawgQuery(new URLSearchParams({ page: "abc" }))).toEqual({});
  });

  it("clamps page_size to 1..40", () => {
    expect(parseRawgQuery(new URLSearchParams({ page_size: "0" })).page_size).toBe("1");
    expect(parseRawgQuery(new URLSearchParams({ page_size: "100" })).page_size).toBe("40");
    expect(parseRawgQuery(new URLSearchParams({ page_size: "20" })).page_size).toBe("20");
  });

  it("accepts only whitelisted ordering values", () => {
    const ok = parseRawgQuery(new URLSearchParams({ ordering: "-rating" }));
    expect(ok.ordering).toBe("-rating");
    const bad = parseRawgQuery(new URLSearchParams({ ordering: "INJECT' OR 1=1" }));
    expect(bad.ordering).toBeUndefined();
  });

  it("filters platforms to whitelisted ids only", () => {
    const query = parseRawgQuery(new URLSearchParams({ platforms: "4,99999,18" }));
    expect(query.platforms).toBe("4,18");
  });

  it("drops platforms entirely if none are valid", () => {
    const query = parseRawgQuery(new URLSearchParams({ platforms: "999,888" }));
    expect(query.platforms).toBeUndefined();
  });

  it("filters genres to whitelisted ids only", () => {
    const query = parseRawgQuery(new URLSearchParams({ genres: "4,123456,51" }));
    expect(query.genres).toBe("4,51");
  });

  it("accepts only whitelisted metacritic thresholds", () => {
    expect(parseRawgQuery(new URLSearchParams({ metacritic: "90" })).metacritic).toBe("90");
    expect(parseRawgQuery(new URLSearchParams({ metacritic: "13" })).metacritic).toBeUndefined();
  });

  it("accepts only whitelisted dates", () => {
    expect(
      parseRawgQuery(new URLSearchParams({ dates: "2025-01-01,2025-12-31" })).dates
    ).toBe("2025-01-01,2025-12-31");
    expect(parseRawgQuery(new URLSearchParams({ dates: "2020,2021" })).dates).toBeUndefined();
  });
});

describe("sanitizePageUrl", () => {
  it("returns null for null input", () => {
    expect(sanitizePageUrl(null)).toBeNull();
  });

  it("returns null for malformed URLs", () => {
    expect(sanitizePageUrl("not a url")).toBeNull();
  });

  it("strips the API key from the URL", () => {
    const url =
      "https://api.rawg.io/api/games?key=SECRETKEY&page=2&page_size=20";
    const result = sanitizePageUrl(url);
    expect(result).not.toContain("SECRETKEY");
    expect(result).not.toContain("key=");
  });

  it("strips page_size but keeps other query params", () => {
    const url =
      "https://api.rawg.io/api/games?key=SECRETKEY&page=2&page_size=20&ordering=-rating";
    const result = sanitizePageUrl(url);
    expect(result).toContain("page=2");
    expect(result).toContain("ordering=-rating");
    expect(result).not.toContain("page_size");
    expect(result).not.toContain("key");
  });

  it("produces relative paths", () => {
    const url = "https://api.rawg.io/api/games?key=SECRETKEY&page=3";
    const result = sanitizePageUrl(url);
    expect(result?.startsWith("/api/games")).toBe(true);
  });
});

describe("sanitizeListResponse", () => {
  it("sanitizes next and previous URLs while preserving the rest", () => {
    const data = {
      count: 100,
      next: "https://api.rawg.io/api/games?key=SECRETKEY&page=2",
      previous: null,
      results: [],
    };
    const result = sanitizeListResponse(data);
    expect(result.next).not.toContain("SECRETKEY");
    expect(result.next).toContain("page=2");
    expect(result.previous).toBeNull();
    expect(result.count).toBe(100);
    expect(result.results).toEqual([]);
  });
});
