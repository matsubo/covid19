import { type CollectionEntry, getCollection } from "astro:content";

export type Covid19Entry = CollectionEntry<"covid19">;

// すべてのCOVID-19記事を取得（公開日順にソート）
let covid19CollectionCache: Covid19Entry[] | null = null;

async function getCovid19Collection(): Promise<Covid19Entry[]> {
  if (!covid19CollectionCache) {
    const collection = await getCollection("covid19");
    // 公開日の新しい順にソート
    covid19CollectionCache = collection.sort((a, b) => {
      const dateA = new Date(a.data.publishedTime);
      const dateB = new Date(b.data.publishedTime);
      return dateB.getTime() - dateA.getTime();
    });
  }
  return covid19CollectionCache;
}

export const covid19Handler = {
  /**
   * すべての記事を取得
   */
  allArticles: async (): Promise<Covid19Entry[]> => {
    return getCovid19Collection();
  },

  /**
   * 都道府県別に記事を取得
   */
  articlesByPrefecture: async (prefecture: string): Promise<Covid19Entry[]> => {
    const allArticles = await getCovid19Collection();
    return allArticles.filter(
      (article) => article.data.prefecture === prefecture,
    );
  },

  /**
   * 年月別に記事を取得
   */
  articlesByYearMonth: async (
    year: string,
    month: string,
  ): Promise<Covid19Entry[]> => {
    const allArticles = await getCovid19Collection();
    return allArticles.filter((article) => {
      const date = new Date(article.data.publishedTime);
      const articleYear = date.getFullYear().toString();
      const articleMonth = String(date.getMonth() + 1).padStart(2, "0");
      return articleYear === year && articleMonth === month;
    });
  },

  /**
   * 年別に記事を取得
   */
  articlesByYear: async (year: string): Promise<Covid19Entry[]> => {
    const allArticles = await getCovid19Collection();
    return allArticles.filter((article) => {
      const date = new Date(article.data.publishedTime);
      const articleYear = date.getFullYear().toString();
      return articleYear === year;
    });
  },

  /**
   * IDから記事を取得
   */
  articleById: async (id: string): Promise<Covid19Entry | undefined> => {
    const allArticles = await getCovid19Collection();
    return allArticles.find((article) => article.id === id);
  },

  /**
   * 最新N件の記事を取得
   */
  latestArticles: async (limit: number = 10): Promise<Covid19Entry[]> => {
    const allArticles = await getCovid19Collection();
    return allArticles.slice(0, limit);
  },

  /**
   * 都道府県別の最新記事を取得
   */
  latestByPrefecture: async (
    prefecture: string,
    limit: number = 5,
  ): Promise<Covid19Entry[]> => {
    const articles = await covid19Handler.articlesByPrefecture(prefecture);
    return articles.slice(0, limit);
  },

  /**
   * 統計情報を取得
   */
  statistics: async () => {
    const allArticles = await getCovid19Collection();
    const prefectures = new Map<string, number>();

    for (const article of allArticles) {
      const count = prefectures.get(article.data.prefecture) || 0;
      prefectures.set(article.data.prefecture, count + 1);
    }

    return {
      totalArticles: allArticles.length,
      prefectureCount: Array.from(prefectures.entries())
        .map(([prefecture, count]) => ({
          prefecture,
          count,
        }))
        .sort((a, b) => b.count - a.count),
    };
  },

  /**
   * 同じ都道府県の前後の記事を取得
   */
  adjacentArticles: async (
    currentArticle: Covid19Entry,
  ): Promise<{
    prev: Covid19Entry | null;
    next: Covid19Entry | null;
  }> => {
    const prefecture = currentArticle.data.prefecture;

    // 同じ都道府県の記事を取得して日付順（古い順）にソート
    const prefectureArticles =
      await covid19Handler.articlesByPrefecture(prefecture);
    const sortedArticles = prefectureArticles.sort((a, b) => {
      const dateA = new Date(a.data.publishedTime);
      const dateB = new Date(b.data.publishedTime);
      return dateA.getTime() - dateB.getTime();
    });

    // 現在の記事のインデックスを見つける
    const currentIndex = sortedArticles.findIndex(
      (article) => article.id === currentArticle.id,
    );

    if (currentIndex === -1) {
      return { prev: null, next: null };
    }

    return {
      prev: currentIndex > 0 ? sortedArticles[currentIndex - 1] : null,
      next:
        currentIndex < sortedArticles.length - 1
          ? sortedArticles[currentIndex + 1]
          : null,
    };
  },
};
