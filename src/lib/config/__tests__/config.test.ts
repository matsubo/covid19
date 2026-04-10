import { describe, expect, it } from "vitest";
import { NAVIGATION_LINKS, OTHER_LINKS, SITE, SOCIAL_LINKS } from "../index";

describe("SITE config", () => {
  it("has required fields", () => {
    expect(SITE.title).toBeTruthy();
    expect(SITE.url).toMatch(/^https?:\/\//);
    expect(SITE.locale).toBeTruthy();
    expect(SITE.postsPerPage).toBeGreaterThan(0);
  });

  it("has valid charset", () => {
    expect(SITE.charset).toBe("UTF-8");
  });

  it("has valid locale format", () => {
    expect(SITE.locale).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
  });

  it("has valid basePath", () => {
    expect(SITE.basePath).toBe("/");
  });

  it("has valid URL without trailing slash", () => {
    expect(SITE.url).not.toMatch(/\/$/);
  });
});

describe("NAVIGATION_LINKS", () => {
  it("has at least one link", () => {
    expect(NAVIGATION_LINKS.length).toBeGreaterThan(0);
  });

  it("each link has href starting with /", () => {
    for (const link of NAVIGATION_LINKS) {
      expect(link.href).toMatch(/^\//);
    }
  });

  it("each link has non-empty text", () => {
    for (const link of NAVIGATION_LINKS) {
      expect(link.text).toBeTruthy();
    }
  });

  it("all hrefs are prefecture paths", () => {
    for (const link of NAVIGATION_LINKS) {
      expect(link.href).toMatch(/^\/prefecture\/[a-z]+$/);
    }
  });

  it("has no duplicate hrefs", () => {
    const hrefs = NAVIGATION_LINKS.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});

describe("OTHER_LINKS", () => {
  it("has at least one link", () => {
    expect(OTHER_LINKS.length).toBeGreaterThan(0);
  });

  it("each link has href and text", () => {
    for (const link of OTHER_LINKS) {
      expect(link.href).toBeTruthy();
      expect(link.text).toBeTruthy();
    }
  });

  it("external links have full URL", () => {
    for (const link of OTHER_LINKS) {
      if (!link.href.startsWith("/")) {
        expect(link.href).toMatch(/^https?:\/\//);
      }
    }
  });
});

describe("SOCIAL_LINKS", () => {
  it("has at least one link", () => {
    expect(SOCIAL_LINKS.length).toBeGreaterThan(0);
  });

  it("each link has href and text", () => {
    for (const link of SOCIAL_LINKS) {
      expect(link.href).toMatch(/^https?:\/\//);
      expect(link.text).toBeTruthy();
    }
  });

  it("has no duplicate hrefs", () => {
    const hrefs = SOCIAL_LINKS.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
