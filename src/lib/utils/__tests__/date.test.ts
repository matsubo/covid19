import { describe, expect, it } from "vitest";
import { formatDate, normalizeDate } from "../date";

describe("normalizeDate", () => {
  it("returns ISO string when given a Date object", () => {
    const date = new Date("2023-01-15T00:00:00.000Z");
    expect(normalizeDate(date)).toBe("2023-01-15T00:00:00.000Z");
  });

  it("returns the string as-is when given a string", () => {
    const dateStr = "2023-01-15T00:00:00.000Z";
    expect(normalizeDate(dateStr)).toBe(dateStr);
  });
});

describe("formatDate", () => {
  it("formats date in long format by default", () => {
    const result = formatDate("2024-01-15T10:30:00.000Z");
    expect(result).toContain("2024");
    expect(result).toContain("January");
  });

  it("formats date in short format", () => {
    const result = formatDate("2024-01-15T10:30:00.000Z", "short");
    expect(result).toContain("January");
    expect(result).toContain("2024");
  });

  it("accepts Date objects", () => {
    const date = new Date("2024-06-01T00:00:00.000Z");
    const result = formatDate(date);
    expect(result).toContain("2024");
  });

  it("throws on invalid date string", () => {
    expect(() => formatDate("not-a-date")).toThrow(
      "Invalid date value provided.",
    );
  });
});
