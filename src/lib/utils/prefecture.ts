// 都道府県マッピング（英語スラッグ → 日本語名）
export const PREFECTURE_MAP: Record<string, string> = {
  tokyo: '東京都',
  kanagawa: '神奈川県',
  osaka: '大阪府',
  hokkaido: '北海道',
  aomori: '青森県',
  fukui: '福井県',
  ishikawa: '石川県',
  toyama: '富山県',
  gifu: '岐阜県',
  mie: '三重県',
  saitama: '埼玉県',
  gunma: '群馬県',
  nagano: '長野県',
  yamagata: '山形県',
  yamaguchi: '山口県',
  okayama: '岡山県',
  kochi: '高知県',
  kouchi: '高知県',  // Alternative spelling
  ehime: '愛媛県',
  kumamoto: '熊本県',
  fukuoka: '福岡県',
};

// 都道府県の地方区分
export const REGION_MAP: Record<string, string> = {
  tokyo: '関東',
  kanagawa: '関東',
  saitama: '関東',
  gunma: '関東',
  osaka: '近畿',
  hokkaido: '北海道',
  aomori: '東北',
  yamagata: '東北',
  fukui: '北陸',
  ishikawa: '北陸',
  toyama: '北陸',
  gifu: '中部',
  mie: '中部',
  nagano: '中部',
  yamaguchi: '中国',
  okayama: '中国',
  kochi: '四国',
  kouchi: '四国',
  ehime: '四国',
  kumamoto: '九州',
  fukuoka: '九州',
};

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
  return REGION_MAP[slug] || '不明';
}

/**
 * すべての都道府県を取得（スラッグと日本語名のペア）
 */
export function getAllPrefectures(): Array<{ slug: string; name: string; region: string }> {
  // kouchi は kochi と同じなので除外
  const uniqueSlugs = Object.keys(PREFECTURE_MAP).filter(slug => slug !== 'kouchi');

  return uniqueSlugs.map(slug => ({
    slug,
    name: PREFECTURE_MAP[slug],
    region: REGION_MAP[slug] || '不明',
  })).sort((a, b) => a.name.localeCompare(b.name, 'ja'));
}

/**
 * 地方別に都道府県をグループ化
 */
export function getPrefecturesByRegion(): Record<string, Array<{ slug: string; name: string }>> {
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
