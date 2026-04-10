import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "astro:content": resolve(__dirname, "src/__mocks__/astro-content.ts"),
    },
  },
});
