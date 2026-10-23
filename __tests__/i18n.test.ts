import { describe, expect, it } from "vitest";
import {
  LOCALES,
  messages,
  rawgTerm,
  rawgTermsFr,
  t,
} from "@/lib/i18n";

describe("i18n messages", () => {
  it("supports exactly en and fr locales", () => {
    expect(LOCALES).toEqual(["en", "fr"]);
    expect(Object.keys(messages).sort()).toEqual(["en", "fr"]);
  });

  it("fr has every key from en", () => {
    const enKeys = Object.keys(messages.en);
    for (const key of enKeys) {
      expect(messages.fr).toHaveProperty(key);
    }
    expect(Object.keys(messages.fr)).toHaveLength(enKeys.length);
  });

  it("has no empty values in either dictionary", () => {
    for (const locale of LOCALES) {
      for (const [key, value] of Object.entries(messages[locale])) {
        expect(value, `${locale}.${key} is empty`).not.toBe("");
      }
    }
  });

  it("translates a known key in each locale", () => {
    expect(t("en", "nav.browse")).toBe("Browse");
    expect(t("fr", "nav.browse")).toBe("Explorer");
  });

  it("interpolates variables", () => {
    expect(t("en", "pagination.page", { page: 3 })).toBe("Page 3");
    expect(t("fr", "pagination.page", { page: 7 })).toBe("Page 7");
    expect(t("en", "browse.emptySearch", { query: "portal" })).toBe(
      'No games found for "portal".'
    );
  });
});

describe("rawgTerm", () => {
  it("translates known RAWG genre names to French", () => {
    expect(rawgTerm("fr", "Indie")).toBe("Indé");
    expect(rawgTerm("fr", "RPG")).toBe("JDR");
    expect(rawgTerm("fr", "Racing")).toBe("Course");
  });

  it("falls back to the original name when unknown", () => {
    expect(rawgTerm("fr", "Unknown Genre")).toBe("Unknown Genre");
  });

  it("returns the original name for English", () => {
    expect(rawgTerm("en", "Indie")).toBe("Indie");
  });

  it("covers every genre option used by the filter bar", () => {
    const filterGenres = [
      "Action",
      "Indie",
      "Adventure",
      "RPG",
      "Strategy",
      "Shooter",
      "Casual",
      "Simulation",
      "Puzzle",
      "Arcade",
      "Racing",
      "Sports",
    ];
    for (const name of filterGenres) {
      expect(rawgTermsFr[name], `missing FR term for ${name}`).toBeDefined();
    }
  });
});
