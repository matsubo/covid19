import type { Link } from "../types";

export const SITE = {
  title: "新型コロナウイルス新規陽性者数の遷移グラフ",
  description: "各都道府県が提供しているオープンデータをグラフ化",
  author: "matsubo",
  url: "https://covid19.teraren.com",
  github: "https://github.com/matsubo/covid19",
  locale: "ja-JP",
  dir: "ltr",
  charset: "UTF-8",
  basePath: "/",
  postsPerPage: 20,
};

// 都道府県ナビゲーションリンク
export const NAVIGATION_LINKS: Link[] = [
  {
    href: "/prefecture/tokyo",
    text: "東京都",
  },
  {
    href: "/prefecture/kanagawa",
    text: "神奈川県",
  },
  {
    href: "/prefecture/osaka",
    text: "大阪府",
  },
  {
    href: "/prefecture/hokkaido",
    text: "北海道",
  },
  {
    href: "/prefecture/fukuoka",
    text: "福岡県",
  },
  {
    href: "/archives/1",
    text: "すべての記事",
  },
];

export const OTHER_LINKS: Link[] = [
  {
    href: "/history",
    text: "サイトの歩み",
  },
  {
    href: "https://github.com/matsubo/covid19-daily-tweet",
    text: "ソースコード",
  },
];

export const SOCIAL_LINKS: Link[] = [
  {
    href: "https://github.com/matsubo/covid19",
    text: "GitHub",
    icon: "github",
  },
  {
    href: "https://twitter.com/matsubo",
    text: "Twitter",
    icon: "newTwitter",
  },
];
