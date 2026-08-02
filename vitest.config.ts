import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["src/**/*.{test,spec}.{ts,tsx,js}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "e2e/**",
      "**/.{git,cache}/**",
    ],
  },
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
      "astro:content": resolve(
        import.meta.dirname,
        "src/__mocks__/astro-content.ts",
      ),
    },
  },
});
