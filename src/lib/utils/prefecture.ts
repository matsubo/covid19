// 都道府県データをJSONファイルから読み込み
import prefecturesData from "@/content/prefectures.json";

// 型定義
interface PrefectureData {
  slug: string;
  title: string;
  region: string;
  count?: number;
}

// 都道府県マッピング（英語スラッグ → 日本語名）を生成
export const PREFECTURE_MAP: Record<string, string> = prefecturesData.reduce(
  (map, pref) => {
    map[pref.slug] = pref.title;
    return map;
  },
  {} as Record<string, string>
);

// 都道府県の地方区分マッピングを生成
export const REGION_MAP: Record<string, string> = prefecturesData.reduce(
  (map, pref) => {
    map[pref.slug] = pref.region;
    return map;
  },
  {} as Record<string, string>
);

/**
 * 都道府県スラッグから日本語名を取得
 */
export function getPrefectureName(slug: string): string {
  return PREFECTURE_MAP[slug] || slug;
}

/**
 * 都道府県スラッグから地方名を取得
 */
export function getRegionName(slug: string): string {
  return REGION_MAP[slug] || "不明";
}

/**
 * すべての都道府県を取得（スラッグと日本語名のペア）
 */
export function getAllPrefectures(): Array<{
  slug: string;
  name: string;
  region: string;
}> {
  return prefecturesData
    .map((pref) => ({
      slug: pref.slug,
      name: pref.title,
      region: pref.region,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "ja"));
}

/**
 * 地方別に都道府県をグループ化
 */
export function getPrefecturesByRegion(): Record<
  string,
  Array<{ slug: string; name: string }>
> {
  const prefectures = getAllPrefectures();
  const grouped: Record<string, Array<{ slug: string; name: string }>> = {};

  for (const pref of prefectures) {
    if (!grouped[pref.region]) {
      grouped[pref.region] = [];
    }
    grouped[pref.region].push({ slug: pref.slug, name: pref.name });
  }

  return grouped;
}

/**
 * 都道府県スラッグが有効かチェック
 */
export function isValidPrefecture(slug: string): boolean {
  return slug in PREFECTURE_MAP;
}
