// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { modifiedTime, readingTime } from "./src/lib/utils/remarks.mjs";
import { SITE } from "./src/lib/config";
import { loadEnv } from "vite";
import pagefind from "astro-pagefind";

const integrations = [mdx(), sitemap(), pagefind()];

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  base: SITE.basePath,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  markdown: {
    remarkPlugins: [readingTime, modifiedTime],
  },
  image: {
    responsiveStyles: true,
    breakpoints: [640, 1024],
  },
  integrations: [mdx(), sitemap(), pagefind()],
  vite: {
    plugins: [tailwindcss()],
  },
});
