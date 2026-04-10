import { z } from "astro:content";

// COVID-19記事のスキーマ
export const covid19Schema = z.object({
  title: z.string(),
  description: z.string(),
  publishedTime: z.string().datetime().or(z.date()),
  prefecture: z.string(), // 都道府県スラッグ (tokyo, kanagawa, etc.)
  coverImage: z.string(), // 画像パス (/images/YYYY/MM/filename.png)
});

// 都道府県カテゴリのスキーマ（個別アイテム）
const prefectureItemSchema = z.object({
  title: z.string(), // 日本語名 (東京都, 神奈川県, etc.)
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "The string must be a slug (only lowercase letters, numbers, and hyphens).",
    ),
  region: z.string(), // 地方名（関東、東北など）
  count: z.number().optional(), // 記事数（統計用）
});

// 都道府県コレクション全体のスキーマ（配列）
export const prefectureSchema = z.array(prefectureItemSchema);

export const viewSchema = z.object({
  title: z.string(),
  description: z.string(),
  blocks: z.array(z.any()),
});
