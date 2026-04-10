import type { APIRoute } from "astro";
import { SITE } from "@/lib/config";
import { covid19Handler } from "@/lib/handlers/covid19";

export const GET: APIRoute = async () => {
  const baseUrl = SITE.url || "https://covid19.example.com";

  // 統計情報を取得
  const statistics = await covid19Handler.statistics();
  const allArticles = await covid19Handler.allArticles();

  // XMLを生成
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- ホームページ -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Historyページ -->
  <url>
    <loc>${baseUrl}/history</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- アーカイブページ（一覧ページ - priority低め） -->
  <url>
    <loc>${baseUrl}/archives/1</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <!-- 都道府県ページ（一覧ページ - priority低め） -->
  ${statistics.prefectureCount
    .map(
      (pref) => `  <url>
    <loc>${baseUrl}/prefecture/${pref.prefecture}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`,
    )
    .join("\n")}
  
  <!-- 記事ページ（個別記事 - priority高め） -->
  ${allArticles
    .map((article) => {
      const date = new Date(article.data.publishedTime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const slug = article.id.split("/").pop();
      const url = `${baseUrl}/${year}/${month}/${day}/${slug}/`;

      return `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date(article.data.publishedTime).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`;
    })
    .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
