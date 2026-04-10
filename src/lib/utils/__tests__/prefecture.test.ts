import { describe, expect, it } from "vitest";
import {
  getAllPrefectures,
  getPrefectureName,
  getPrefecturesByRegion,
  getRegionName,
  isValidPrefecture,
} from "../prefecture";

describe("getPrefectureName", () => {
  it("returns Japanese name for a valid slug", () => {
    expect(getPrefectureName("tokyo")).toBe("東京都");
  });

  it("returns the slug itself for an unknown slug", () => {
    expect(getPrefectureName("unknown")).toBe("unknown");
  });
});

describe("getRegionName", () => {
  it("returns region name for a valid slug", () => {
    const region = getRegionName("tokyo");
    expect(region).toBeTruthy();
    expect(region).not.toBe("不明");
  });

  it("returns '不明' for an unknown slug", () => {
    expect(getRegionName("unknown")).toBe("不明");
  });
});

describe("getAllPrefectures", () => {
  it("returns an array of prefectures", () => {
    const prefectures = getAllPrefectures();
    expect(prefectures.length).toBeGreaterThan(0);
  });

  it("each prefecture has slug, name, and region", () => {
    const prefectures = getAllPrefectures();
    for (const pref of prefectures) {
      expect(pref).toHaveProperty("slug");
      expect(pref).toHaveProperty("name");
      expect(pref).toHaveProperty("region");
    }
  });

  it("is sorted by Japanese name", () => {
    const prefectures = getAllPrefectures();
    const names = prefectures.map((p) => p.name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b, "ja"));
    expect(names).toEqual(sorted);
  });
});

describe("getPrefecturesByRegion", () => {
  it("returns an object with region keys", () => {
    const grouped = getPrefecturesByRegion();
    expect(Object.keys(grouped).length).toBeGreaterThan(0);
  });

  it("each region contains prefectures with slug and name", () => {
    const grouped = getPrefecturesByRegion();
    for (const prefectures of Object.values(grouped)) {
      expect(prefectures.length).toBeGreaterThan(0);
      for (const pref of prefectures) {
        expect(pref).toHaveProperty("slug");
        expect(pref).toHaveProperty("name");
      }
    }
  });
});

describe("isValidPrefecture", () => {
  it("returns true for a valid slug", () => {
    expect(isValidPrefecture("tokyo")).toBe(true);
    expect(isValidPrefecture("hokkaido")).toBe(true);
  });

  it("returns false for an invalid slug", () => {
    expect(isValidPrefecture("invalid")).toBe(false);
    expect(isValidPrefecture("")).toBe(false);
  });
});
