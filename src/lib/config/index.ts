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
    href: "/prefecture/aomori",
    text: "青森県",
  },
  {
    href: "/prefecture/ehime",
    text: "愛媛県",
  },
  {
    href: "/prefecture/fukui",
    text: "福井県",
  },
  {
    href: "/prefecture/fukuoka",
    text: "福岡県",
  },
  {
    href: "/prefecture/gifu",
    text: "岐阜県",
  },
  {
    href: "/prefecture/gunma",
    text: "群馬県",
  },
  {
    href: "/prefecture/hokkaido",
    text: "北海道",
  },
  {
    href: "/prefecture/ishikawa",
    text: "石川県",
  },
  {
    href: "/prefecture/kanagawa",
    text: "神奈川県",
  },
  {
    href: "/prefecture/kouchi",
    text: "高知県",
  },
  {
    href: "/prefecture/kumamoto",
    text: "熊本県",
  },
  {
    href: "/prefecture/mie",
    text: "三重県",
  },
  {
    href: "/prefecture/nagano",
    text: "長野県",
  },
  {
    href: "/prefecture/okayama",
    text: "岡山県",
  },
  {
    href: "/prefecture/saitama",
    text: "埼玉県",
  },
  {
    href: "/prefecture/tokyo",
    text: "東京都",
  },
  {
    href: "/prefecture/toyama",
    text: "富山県",
  },
  {
    href: "/prefecture/yamagata",
    text: "山形県",
  },
  {
    href: "/prefecture/yamaguchi",
    text: "山口県",
  },
];

export const OTHER_LINKS: Link[] = [
  {
    href: "/history",
    text: "サイトの歩み",
  },
  {
    href: "https://github.com/matsubo/covid19-daily-tweet",
    text: "連携プログラムソースコード",
  },
  {
    href: "https://github.com/matsubo/covid19-twitter-icon",
    text: "アイコン生成ソースコード",
  },
];

export const SOCIAL_LINKS: Link[] = [
  {
    href: "https://github.com/matsubo/covid19",
    text: "GitHub",
    icon: "github",
  },
  {
    href: "https://x.com/matsubo",
    text: "Twitter",
    icon: "newTwitter",
  },
];
