import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import { SITE } from "./src/lib/config";
import { modifiedTime, readingTime } from "./src/lib/utils/remarks.mjs";

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
  integrations: [mdx(), sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
