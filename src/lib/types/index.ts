export type Link = {
  href: string;
  text: string;
  icon?: string;
  target?: "_blank" | "_self";
};

type Author = {
  name: string;
  link: string;
};

export type Meta = {
  title: string;
  metaTitle: string;
  description: string;
  type: "article" | "website";
  ogImage: string;
  ogImageAlt: string;
};

export type ArticleMeta = Meta & {
  publishedTime: string;
  lastModified?: string;
  authors: Author[];
};
