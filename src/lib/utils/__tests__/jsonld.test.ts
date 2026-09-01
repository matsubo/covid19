import { describe, expect, it } from "vitest";
import { buildBreadcrumbSchema } from "../jsonld";

const siteUrl = "https://covid19.teraren.com";
const canonicalUrl = "https://covid19.teraren.com/prefecture/kochi/10/";

describe("buildBreadcrumbSchema", () => {
  it("returns a BreadcrumbList with the site root as the first item", () => {
    const schema = buildBreadcrumbSchema({
      siteUrl,
      canonicalUrl,
      name: "高知県の新型コロナウイルス新規陽性者数グラフ",
    });

    expect(schema?.["@type"]).toBe("BreadcrumbList");
    expect(schema?.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "ホーム",
      item: siteUrl,
    });
  });

  it("adds the current page as the second item", () => {
    const schema = buildBreadcrumbSchema({
      siteUrl,
      canonicalUrl,
      name: "高知県の新型コロナウイルス新規陽性者数グラフ",
    });

    expect(schema?.itemListElement).toHaveLength(2);
    expect(schema?.itemListElement[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "高知県の新型コロナウイルス新規陽性者数グラフ",
      item: canonicalUrl,
    });
  });

  it("returns null when the current page has no name", () => {
    expect(
      buildBreadcrumbSchema({ siteUrl, canonicalUrl, name: undefined }),
    ).toBeNull();
  });

  it("returns null when the current page name is blank", () => {
    expect(
      buildBreadcrumbSchema({ siteUrl, canonicalUrl, name: "   " }),
    ).toBeNull();
  });

  it("never emits a ListItem without a name", () => {
    for (const name of [undefined, "", "  ", "ページ"]) {
      const schema = buildBreadcrumbSchema({ siteUrl, canonicalUrl, name });
      for (const listItem of schema?.itemListElement ?? []) {
        expect(listItem.name).toBeTruthy();
      }
    }
  });

  it("trims surrounding whitespace from the name", () => {
    const schema = buildBreadcrumbSchema({
      siteUrl,
      canonicalUrl,
      name: "  すべてのグラフ  ",
    });

    expect(schema?.itemListElement[1]?.name).toBe("すべてのグラフ");
  });

  it("returns null on the site root, which has no trail of its own", () => {
    const schema = buildBreadcrumbSchema({
      siteUrl,
      canonicalUrl: `${siteUrl}/`,
      name: "COVID-19新規陽性者数の遷移グラフ",
    });

    expect(schema).toBeNull();
  });
});
