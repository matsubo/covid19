# Dead Code Analysis Report

Generated: 2026-04-11
Tools: knip 6.3.1, depcheck 1.4.7, ts-prune 0.10.3

## Summary

| Category | Count | Action |
|----------|-------|--------|
| Unused files | 16 | DELETE |
| Unused dependencies | 4 | REMOVE |
| Unused exports | 4 | REMOVE |
| Unused types | 2 | REMOVE |
| False positives (deps) | 7 | KEEP |

## Unused Files (SAFE - DELETE)

All 16 files are leftover template components not imported by any active page:

| File | Reason |
|------|--------|
| src/components/bases/divider.astro | Only used by unused card components |
| src/components/bases/navbar-item.astro | Not imported anywhere |
| src/components/bases/script.astro | Only used by unused share.astro |
| src/components/bases/share-item.astro | Only used by unused share.astro |
| src/components/cards/authorCard.astro | Original template component, replaced |
| src/components/cards/mainHeadline.astro | Original template component, replaced |
| src/components/cards/newsCard.astro | Original template component, replaced |
| src/components/cards/subHeadlineCard.astro | Original template component, replaced |
| src/components/cards/wideCard.astro | Original template component, replaced |
| src/components/covid19/PrefectureSection.astro | Not imported anywhere |
| src/components/elements/menu-dropdown.astro | Not imported anywhere |
| src/components/elements/share.astro | Not imported anywhere |
| src/components/shared/Carousel.astro | Not imported anywhere |
| src/components/shared/view-list-header.astro | Only used by unused list.astro |
| src/layouts/list.astro | Not imported by any page |
| src/lib/utils/letter.ts | Not imported anywhere |

## Unused Dependencies (SAFE - REMOVE)

| Package | Reason |
|---------|--------|
| @astrojs/rss | No rss.xml page exists |
| @philnash/astro-pagination | Not imported in any file |
| astro-pagefind | Not used as integration (pagefind CLI is separate) |
| @pagefind/default-ui | Not imported (search uses pagefind API directly) |

## False Positives (KEEP)

| Package | Reason to keep |
|---------|----------------|
| @astrojs/check | Used by `astro check` CLI in pre-commit hook |
| @iconify-json/mdi | Used implicitly by astro-icon integration |
| @fontsource-variable/source-serif-4 | CSS import in head.astro |
| @fontsource/source-sans-pro | CSS import in head.astro |
| tailwindcss | Used via @tailwindcss/vite plugin |
| typescript | Used by TypeScript compilation |
| pagefind | Used by build:search script CLI |

## Unused Exports (SAFE - REMOVE)

| Export | File | Notes |
|--------|------|-------|
| prefectureItemSchema | src/lib/schema/index.ts:13 | Used internally by prefectureSchema, export unnecessary |
| getDateDistance | src/lib/utils/date.ts:8 | Only consumers are unused card components |
| PREFECTURE_MAP | src/lib/utils/prefecture.ts:5 | Used internally only, no external consumers |
| REGION_MAP | src/lib/utils/prefecture.ts:14 | Used internally only, no external consumers |

## Unused Types (SAFE - REMOVE)

| Type | File | Notes |
|------|------|-------|
| Icon | src/lib/types/index.ts:3 | Not referenced anywhere |
| Entry | src/lib/types/index.ts:38 | Not referenced anywhere |
