import { describe, expect, it } from "vitest";
import { scoreLabel } from "@/components/metacritic-badge";

describe("scoreLabel", () => {
  it("returns empty string for missing score", () => {
    expect(scoreLabel()).toBe("");
    expect(scoreLabel(null)).toBe("");
    expect(scoreLabel(0)).toBe("");
  });

  it("labels 90+ as Universal Acclaim", () => {
    expect(scoreLabel(90)).toBe("Universal Acclaim");
    expect(scoreLabel(96)).toBe("Universal Acclaim");
  });

  it("labels 75-89 as Generally Favorable", () => {
    expect(scoreLabel(75)).toBe("Generally Favorable");
    expect(scoreLabel(80)).toBe("Generally Favorable");
    expect(scoreLabel(89)).toBe("Generally Favorable");
  });

  it("labels 60-74 as Mixed or Average", () => {
    expect(scoreLabel(60)).toBe("Mixed or Average");
    expect(scoreLabel(70)).toBe("Mixed or Average");
  });

  it("labels below 60 as Generally Unfavorable", () => {
    expect(scoreLabel(59)).toBe("Generally Unfavorable");
    expect(scoreLabel(40)).toBe("Generally Unfavorable");
  });
});
