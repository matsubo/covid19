const HOME_BREADCRUMB_NAME = "ホーム";

export type BreadcrumbListItem = {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
};

export type BreadcrumbSchema = {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: BreadcrumbListItem[];
};

type BuildBreadcrumbSchemaInput = {
  siteUrl: string;
  canonicalUrl: string;
  name?: string;
};

const isSameLocation = (a: string, b: string) =>
  a.replace(/\/+$/, "") === b.replace(/\/+$/, "");

/**
 * Builds a schema.org BreadcrumbList for the current page.
 *
 * Google requires every ListItem to carry a `name`, so a page without a usable
 * name gets no breadcrumb at all rather than a nameless item. The site root has
 * no trail of its own and is treated the same way.
 */
export const buildBreadcrumbSchema = ({
  siteUrl,
  canonicalUrl,
  name,
}: BuildBreadcrumbSchemaInput): BreadcrumbSchema | null => {
  const currentName = name?.trim();

  if (!currentName || isSameLocation(canonicalUrl, siteUrl)) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: HOME_BREADCRUMB_NAME,
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: currentName,
        item: canonicalUrl,
      },
    ],
  };
};
