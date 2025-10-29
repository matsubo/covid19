import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import {
  covid19Schema,
  prefectureSchema,
  viewSchema,
} from "@/lib/schema";

// COVID-19記事コレクション
const covid19Collection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/covid19" }),
  schema: covid19Schema,
});

// 都道府県カテゴリコレクション
const prefectureCollection = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/prefectures" }),
  schema: prefectureSchema,
});

// ビュー（ページメタデータ）コレクション
const viewCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/views" }),
  schema: viewSchema,
});

export const collections = {
  covid19: covid19Collection,
  prefectures: prefectureCollection,
  views: viewCollection,
};
