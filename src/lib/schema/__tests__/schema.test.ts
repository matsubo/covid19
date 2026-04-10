import { describe, expect, it } from "vitest";
import { covid19Schema, prefectureSchema, viewSchema } from "../index";

describe("covid19Schema", () => {
  const validArticle = {
    title: "東京都の新規陽性者数",
    description: "東京都の新型コロナウイルス新規陽性者数の推移",
    publishedTime: "2022-09-26T00:00:00.000Z",
    prefecture: "tokyo",
    coverImage: "/images/2022/09/gruff20220926-1-r4c6mc.png",
  };

  it("accepts valid article data", () => {
    const result = covid19Schema.safeParse(validArticle);
    expect(result.success).toBe(true);
  });

  it("accepts Date objects for publishedTime", () => {
    const result = covid19Schema.safeParse({
      ...validArticle,
      publishedTime: new Date("2022-09-26"),
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    const { title, ...noTitle } = validArticle;
    const result = covid19Schema.safeParse(noTitle);
    expect(result.success).toBe(false);
  });

  it("rejects missing description", () => {
    const { description, ...noDesc } = validArticle;
    const result = covid19Schema.safeParse(noDesc);
    expect(result.success).toBe(false);
  });

  it("rejects invalid publishedTime string", () => {
    const result = covid19Schema.safeParse({
      ...validArticle,
      publishedTime: "not-a-date",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing prefecture", () => {
    const { prefecture, ...noPref } = validArticle;
    const result = covid19Schema.safeParse(noPref);
    expect(result.success).toBe(false);
  });

  it("rejects non-string values", () => {
    const result = covid19Schema.safeParse({
      ...validArticle,
      title: 123,
    });
    expect(result.success).toBe(false);
  });
});

describe("prefectureSchema", () => {
  const validPrefecture = {
    title: "東京都",
    slug: "tokyo",
    region: "関東",
  };

  it("accepts valid prefecture array", () => {
    const result = prefectureSchema.safeParse([validPrefecture]);
    expect(result.success).toBe(true);
  });

  it("accepts prefecture with optional count", () => {
    const result = prefectureSchema.safeParse([
      { ...validPrefecture, count: 42 },
    ]);
    expect(result.success).toBe(true);
  });

  it("accepts valid slug formats", () => {
    const slugs = ["tokyo", "kochi", "north-kanto", "area-1"];
    for (const slug of slugs) {
      const result = prefectureSchema.safeParse([{ ...validPrefecture, slug }]);
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid slug formats", () => {
    const invalidSlugs = ["Tokyo", "TOKYO", "tokyo_area", "tokyo area", "東京"];
    for (const slug of invalidSlugs) {
      const result = prefectureSchema.safeParse([{ ...validPrefecture, slug }]);
      expect(result.success).toBe(false);
    }
  });

  it("rejects empty slug", () => {
    const result = prefectureSchema.safeParse([
      { ...validPrefecture, slug: "" },
    ]);
    expect(result.success).toBe(false);
  });

  it("accepts empty array", () => {
    const result = prefectureSchema.safeParse([]);
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = prefectureSchema.safeParse([{ title: "東京都" }]);
    expect(result.success).toBe(false);
  });
});

describe("viewSchema", () => {
  it("accepts valid view data", () => {
    const result = viewSchema.safeParse({
      title: "記事一覧",
      description: "すべての記事",
      blocks: [],
    });
    expect(result.success).toBe(true);
  });

  it("accepts blocks with any content", () => {
    const result = viewSchema.safeParse({
      title: "テスト",
      description: "テスト",
      blocks: [{ type: "text", content: "hello" }, 42, "string"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    const result = viewSchema.safeParse({
      description: "テスト",
      blocks: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing blocks", () => {
    const result = viewSchema.safeParse({
      title: "テスト",
      description: "テスト",
    });
    expect(result.success).toBe(false);
  });
});
