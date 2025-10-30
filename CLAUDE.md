# Astro News - Article Management System

This document explains how articles are managed in the Astro News repository.

## Table of Contents

- [Content Structure](#content-structure)
- [Content Layer Configuration](#content-layer-configuration)
- [Article Schema](#article-schema)
- [Querying Articles](#querying-articles)
- [Categories System](#categories-system)
- [Special Features](#special-features)
- [Configuration](#configuration)

---

## Content Structure

### Directory Layout

```
src/content/
├── articles/                    # Article content files
│   ├── article-slug/
│   │   └── index.mdx           # Article content in MDX format
│   └── ...
├── authors/                     # Author profiles
│   ├── author-slug/
│   │   └── index.mdx           # Author bio with YAML frontmatter
│   └── ...
├── categories/                  # Category taxonomy
│   ├── category-slug/
│   │   └── index.json          # JSON category definitions
│   └── ...
└── views/                       # Page metadata blocks
    ├── articles.json
    └── categories.json
```

### Asset Storage

```
src/assets/
├── images/
│   ├── articles/[slug]/cover.avif
│   └── authors/[name]/avatar.jpg
└── svgs/                        # Icon SVG components
```

---

## Content Layer Configuration

**File:** `src/content.config.ts`

The content layer uses Astro's glob loaders to manage four collections:

```typescript
import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { articleSchema, authorSchema, categorySchema, viewSchema } from "@/lib/schema";

const articleCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/articles" }),
  schema: ({ image }) => articleSchema(image),
});

const authorCollection = defineCollection({
  loader: glob({ pattern: "**/index.mdx", base: "./src/content/authors" }),
  schema: ({ image }) => authorSchema(image),
});

const categoryCollection = defineCollection({
  loader: glob({ pattern: "**/index.json", base: "./src/content/categories" }),
  schema: categorySchema,
});

const viewCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/views" }),
  schema: viewSchema,
});

export const collections = {
  articles: articleCollection,
  views: viewCollection,
  categories: categoryCollection,
  authors: authorCollection,
};
```

### Collection Types

- **Articles**: MDX format with Zod schema validation and image optimization
- **Authors**: MDX format with profile information and social links
- **Categories**: JSON format with slug validation
- **Views**: Metadata for list/archive pages

---

## Article Schema

**File:** `src/lib/schema/index.ts`

### Article Schema Definition

```typescript
import { reference, z } from "astro:content";

export const articleSchema = (image: ImageFunction) =>
  z.object({
    isDraft: z.boolean().default(false),
    isMainHeadline: z.boolean().default(false),
    isSubHeadline: z.boolean().default(false),
    cover: image(),
    covert_alt: z.string().optional(),
    title: z.string().max(60, "Too long, max 60 characters"),
    description: z.string().max(160, "Too long, max 160 characters"),
    category: reference("categories"),
    authors: z.array(reference("authors")).min(1),
    publishedTime: z.string().datetime().or(z.date()),
  });
```

### Example Article Frontmatter

```yaml
---
isDraft: false
isMainHeadline: false
isSubHeadline: true
description: Learn practical strategies to manage your time and increase productivity.
title: Mastering Time Management
cover: '@assets/images/articles/mastering-time-management/cover.avif'
category: productivity
publishedTime: 2024-11-16T00:00:00.000Z
authors:
  - liam-leonard
---

Article content goes here in MDX format...
```

### Author Schema

```typescript
export const authorSchema = (Image: ImageFunction) =>
  z.object({
    name: z.string(),
    job: z.string(),
    avatar: Image(),
    bio: z.string(),
    social: z.array(
      z.object({
        name: z.string(),
        url: z.string(),
        icon: z.string(),
      })
    ),
  });
```

### Category Schema

```typescript
export const categorySchema = z.object({
  title: z.string(),
  path: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "The string must be a slug"),
});
```

---

## Querying Articles

**File:** `src/lib/handlers/articles.ts`

### Article Handler Functions

```typescript
import { getCollection } from "astro:content";

// Get all published articles (not drafts, not future-dated)
const articlesCollection = (
  await getCollection("articles", ({ data }) => {
    return data.isDraft !== true && new Date(data.publishedTime) < new Date();
  })
).sort((a, b) =>
  new Date(b.data.publishedTime)
    .toISOString()
    .localeCompare(new Date(a.data.publishedTime).toISOString())
);

export const articlesHandler = {
  // Get all articles
  allArticles: () => articlesCollection,

  // Get main headline article
  mainHeadline: () => {
    const article = articlesCollection.filter(
      (article) => article.data.isMainHeadline === true
    )[0];
    if (!article)
      throw new Error("Please ensure there is at least one main headline.");
    return article;
  },

  // Get sub headline articles (max 4)
  subHeadlines: () => {
    const mainHeadline = articlesHandler.mainHeadline();
    const subHeadlines = articlesCollection
      .filter(
        (article) =>
          article.data.isSubHeadline === true &&
          mainHeadline.id !== article.id
      )
      .slice(0, 4);

    if (subHeadlines.length === 0)
      throw new Error("Please ensure there is at least one sub headline.");
    return subHeadlines;
  },
};
```

### Article Detail Page

**File:** `src/pages/articles/[id].astro`

```astro
---
import { render } from "astro:content";
import { articlesHandler } from "@/lib/handlers/articles";

export const getStaticPaths = async () => {
  const articles = articlesHandler.allArticles();
  return articles.map((article) => ({
    params: { id: article.id },
    props: { article },
  }));
};

const { article } = Astro.props;
const { Content, remarkPluginFrontmatter } = await render(article);
---

<BaseLayout entry={article}>
  <ArticleHeader
    article={article}
    readingTime={remarkPluginFrontmatter.minutesRead}
  />
  <ContentLayout>
    <Content />
  </ContentLayout>
</BaseLayout>
```

### Article List with Pagination

**File:** `src/pages/articles/[page].astro`

```astro
---
import type { GetStaticPaths } from "astro";
import { SITE } from "@/lib/config";
import { articlesHandler } from "@/lib/handlers/articles";

export const getStaticPaths = (async ({ paginate }) => {
  const articles = articlesHandler.allArticles();
  return paginate(articles, { pageSize: SITE.postsPerPage });
}) satisfies GetStaticPaths;

const { page } = Astro.props;
const articles = page.data;
---

<!-- Render articles and pagination component -->
```

---

## Categories System

### Available Categories

The repository includes 7 predefined categories:

- **technology** - Technology news and trends
- **programming** - Programming tutorials and guides
- **lifestyle** - Lifestyle articles
- **productivity** - Productivity tips and strategies
- **health** - Health and wellness
- **finance** - Finance and money management
- **wellness** - Wellness and self-care

### Category Structure

Each category is defined in a JSON file:

**File:** `src/content/categories/technology/index.json`

```json
{
  "title": "Technology",
  "path": "technology"
}
```

### Category Handler

**File:** `src/lib/handlers/categories.ts`

```typescript
import { getCollection } from "astro:content";
import { articlesHandler } from "./articles";

const categoriesCollection = await getCollection('categories');

export const categoriesHandler = {
  // Get all categories sorted alphabetically
  allCategories: () => categoriesCollection.sort((a, b) =>
    a.data.title.localeCompare(b.data.title)
  ),

  // Get single category by ID
  oneCategory: (categoryId: string) => {
    const category = categoriesCollection.find((category) => category.id === categoryId);
    if (!category) {
      throw new Error(`Category with id ${categoryId} not found`);
    }
    return category;
  },

  // Get categories with article counts and latest articles
  allCategoriesWithLatestArticles: () => {
    return categoriesCollection.map((category) => {
      const articles = articlesHandler.allArticles()
        .filter((article) => article.data.category.id === category.id);
      return {
        ...category,
        data: {
          ...category.data,
          count: articles.length,
          latestArticles: articles.slice(0, 3)
        }
      }
    })
  }
}
```

### Category Pages with Pagination

**File:** `src/pages/categories/[category]/[page].astro`

Category pages automatically generate paginated lists of articles filtered by category.

---

## Special Features

### 1. Reading Time Calculation

**File:** `src/lib/utils/remarks.mjs`

Automatically calculates reading time for each article:

```javascript
import getReadingTime from "reading-time";
import { toString as ConvertToString } from "mdast-util-to-string";

export function readingTime() {
  return (tree, { data }) => {
    const textOnPage = ConvertToString(tree);
    const readingTime = getReadingTime(textOnPage, { wordsPerMinute: 180 });
    data.astro.frontmatter.minutesRead = readingTime.text;
  };
}
```

- **Speed**: 180 words per minute (configurable)
- **Usage**: Automatically injected via remark plugin
- **Access**: `remarkPluginFrontmatter.minutesRead` during render

### 2. Last Modified Time Tracking

**File:** `src/lib/utils/remarks.mjs`

Tracks the last modification time using Git or filesystem:

```javascript
export function modifiedTime() {
  return (_, file) => {
    const filepath = file.history[0];
    let lastModified;

    // Try git log first
    if (isGitAvailable() && isGitRepo()) {
      try {
        const gitResult = execSync(
          `git log -1 --pretty="format:%cI" "${filepath}"`
        ).toString().trim();
        if (gitResult) {
          lastModified = gitResult;
        }
      } catch {
        // Fallback if not tracked
      }
    }

    // Fallback to filesystem mtime
    if (!lastModified) {
      const stats = statSync(filepath);
      lastModified = stats.mtime.toISOString();
    }

    file.data.astro.frontmatter.lastModified = lastModified;
  };
}
```

- **Primary source**: Git commit history
- **Fallback**: Filesystem modification time
- **Benefit**: Accurate change tracking for SEO

### 3. Date Formatting

**File:** `src/lib/utils/date.ts`

```typescript
import { formatDistanceToNow, parseISO, format } from "date-fns";

const FORMAT_LONG = "EEEE, MMMM d, yyyy h:mm a zz";
const FORMAT_SHORT = "MMMM dd, yyyy zz";

export const getDateDistance = (date: string) =>
  formatDistanceToNow(parseISO(date), { addSuffix: true });

export const formatDate = (
  date: string | Date,
  formatType: "long" | "short" = "long"
) => {
  // Formats date with caching for performance
};
```

**Examples**:
- **Relative**: "2 days ago", "3 hours ago"
- **Long**: "Monday, January 15, 2024 3:30 PM EST"
- **Short**: "January 15, 2024 EST"

### 4. Smart Pagination

**File:** `src/components/shared/pagination.astro`

Features:
- Configurable items per page (default: 4)
- Maximum 4 visible page buttons
- First/last page navigation
- Responsive design (hides text on mobile)
- Previous/next navigation

### 5. SEO Metadata Generation

**File:** `src/lib/utils/getMeta.ts`

Generates comprehensive metadata for articles:

```typescript
export const getMeta = async (
  collection: GetMetaCollection,
  category?: string
): Promise<Meta | ArticleMeta> => {
  if (collection.collection === "articles") {
    const { remarkPluginFrontmatter } = await render(collection);
    const authors = authorsHandler.getAuthors(collection.data.authors);

    const meta: ArticleMeta = {
      title: `${capitalizeFirstLetter(collection.data.title)} - ${SITE.title}`,
      metaTitle: capitalizeFirstLetter(collection.data.title),
      description: collection.data.description,
      ogImage: collection.data.cover.src,
      ogImageAlt: collection.data.covert_alt || collection.data.title,
      publishedTime: normalizeDate(collection.data.publishedTime),
      lastModified: remarkPluginFrontmatter.lastModified,
      authors: authors.map((author) => ({
        name: author.data.name,
        link: `${author.id}`,
      })),
      type: "article",
    };
    return meta;
  }
};
```

Includes:
- Page title and meta title
- Description for SEO
- Open Graph image and alt text
- Article published and modified times
- Author information with links
- Structured data type

### 6. Image Optimization

**Astro Config**: `astro.config.mjs`

```javascript
export default defineConfig({
  image: {
    responsiveStyles: true,
    breakpoints: [640, 1024],
  },
});
```

- **Formats**: AVIF, WebP with fallbacks
- **Responsive**: Multiple breakpoints (640px, 1024px)
- **Lazy loading**: Automatic for off-screen images
- **Aspect ratios**: Consistent sizing

### 7. Search Functionality

Uses **Pagefind** for static site search:

```javascript
integrations: [
  pagefind(),  // Automatic search index generation
]
```

- **Index generation**: Build-time
- **Client-side search**: Fast, no server required
- **UI**: Provided by `@pagefind/default-ui`

### 8. RSS Feed

**File**: `src/pages/rss.xml.ts`

Generates RSS feed for all published articles:
- Automatically includes all published articles
- Sorted by publication date
- Includes full content or excerpts

### 9. Sitemap

Automatically generated via `@astrojs/sitemap`:

```javascript
integrations: [
  sitemap(),
]
```

- **URL**: `/sitemap-index.xml`
- **Includes**: All public pages and articles
- **Excludes**: Drafts and future-dated content

---

## Configuration

### Site Configuration

**File:** `src/lib/config/index.ts`

```typescript
export const SITE = {
  title: "Astro News",
  description: "A news website built with Astro",
  author: "Mohammad Rahmani",
  url: "https://astro-news-six.vercel.app",
  github: "https://github.com/Mrahmani71/astro-news",
  locale: "en-US",
  dir: "ltr",
  charset: "UTF-8",
  basePath: "/",
  postsPerPage: 4,  // Number of articles per page
};

export const NAVIGATION_LINKS: Link[] = [
  { href: "/categories/technology", text: "Technology" },
  { href: "/categories/programming", text: "Programming" },
  { href: "/categories/lifestyle", text: "Lifestyle" },
  { href: "/categories/productivity", text: "Productivity" },
  { href: "/categories/health", text: "Health" },
  { href: "/categories/finance", text: "Finance" },
];
```

### Astro Configuration

**File:** `astro.config.mjs`

```javascript
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { modifiedTime, readingTime } from "./src/lib/utils/remarks.mjs";
import { SITE } from "./src/lib/config";
import pagefind from "astro-pagefind";

export default defineConfig({
  site: SITE.url,
  base: SITE.basePath,
  markdown: {
    remarkPlugins: [readingTime, modifiedTime],  // Custom remark plugins
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
```

---

## Summary of Key Features

| Feature | Implementation | Location |
|---------|----------------|----------|
| Content Storage | MDX files in git | `src/content/articles/` |
| Schema Validation | Zod with references | `src/lib/schema/` |
| Reading Time | Remark plugin (180 WPM) | `src/lib/utils/remarks.mjs` |
| Last Modified | Git log + filesystem | `src/lib/utils/remarks.mjs` |
| Pagination | Smart pagination (4/page) | `src/components/shared/pagination.astro` |
| Categories | 7 predefined categories | `src/content/categories/` |
| Authors | Multi-author support | `src/content/authors/` |
| Featured Articles | Main/sub headline flags | Article frontmatter |
| Draft Support | Draft filtering | `isDraft` field |
| Date Formatting | Long/short + relative | `src/lib/utils/date.ts` |
| Image Optimization | AVIF/WebP responsive | Astro config |
| Search | Pagefind | Build-time indexing |
| SEO | Meta + Open Graph | `src/lib/utils/getMeta.ts` |
| RSS Feed | Auto-generated | `src/pages/rss.xml.ts` |
| Sitemap | Auto-generated | `@astrojs/sitemap` |

---

## Workflow for Adding New Articles

### Manual Method

1. Create directory: `src/content/articles/your-article-slug/`
2. Create file: `index.mdx`
3. Add frontmatter:
```yaml
---
isDraft: false
isMainHeadline: false
isSubHeadline: false
title: Your Article Title
description: Article description for SEO
cover: '@assets/images/articles/your-article-slug/cover.avif'
category: technology
publishedTime: 2024-01-15T10:00:00.000Z
authors:
  - author-slug
---

Article content here...
```
4. Add cover image to `src/assets/images/articles/your-article-slug/cover.avif`
5. Commit changes

---

## Troubleshooting

### Article Not Showing Up

Check:
- `isDraft` is set to `false`
- `publishedTime` is not in the future
- Article is committed to git
- Cover image exists at specified path
- Category reference is valid
- At least one author is specified

### Images Not Loading

Check:
- Image path uses `@assets/images/` prefix
- Image file exists in `src/assets/images/`
- Image format is supported (AVIF, WebP, PNG, JPG)
- File permissions are correct

---

For more information, see the [Astro Documentation](https://astro.build).
