import { getArticleList, getBlogSetting } from "@/lib/api";

export const revalidate = 3600;

function getSiteUrl(): string {
  const raw =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";
  const trimmed = raw.trim().replace(/\/+$/, "");
  return trimmed.replace(/\/api\/v1$/, "");
}

function xmlEscape(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function cdata(input: string): string {
  const safe = input.replaceAll("]]>", "]]]]><![CDATA[>");
  return `<![CDATA[${safe}]]>`;
}

function excerpt(text: string, maxLen: number): string {
  const cleaned = (text || "").replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLen) return cleaned;
  return `${cleaned.slice(0, maxLen)}…`;
}

export async function GET(): Promise<Response> {
  const siteUrl = getSiteUrl();
  const [articles, setting] = await Promise.all([getArticleList(), getBlogSetting()]);

  const title = setting?.nav_bar?.website_information?.title || "Mou1ght";
  const description =
    (setting?.nav_bar?.website_information?.keywords || []).join(" / ") || `${title} RSS`;

  const now = new Date().toUTCString();

  const itemsXml = (articles ?? [])
    .filter((a) => a?.id && a?.title)
    .map((a) => {
      const link = `${siteUrl}/article/${encodeURIComponent(a.id)}`;
      const pubDate = new Date(a.time?.created_at || a.time?.updated_at || Date.now()).toUTCString();

      const categories = [
        ...(a.categories ?? []).map((c) => c.label).filter(Boolean),
        ...(a.tags ?? []).map((t) => t.label).filter(Boolean),
      ];

      return [
        "<item>",
        `<title>${xmlEscape(a.title)}</title>`,
        `<link>${xmlEscape(link)}</link>`,
        `<guid isPermaLink="true">${xmlEscape(link)}</guid>`,
        `<pubDate>${xmlEscape(pubDate)}</pubDate>`,
        `<description>${cdata(excerpt(a.content, 240))}</description>`,
        ...categories.map((c) => `<category>${cdata(String(c))}</category>`),
        `<content:encoded>${cdata(a.content || "")}</content:encoded>`,
        "</item>",
      ].join("");
    })
    .join("");

  const feedUrl = `${siteUrl}/rss.xml`;

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    "<channel>",
    `<title>${xmlEscape(title)}</title>`,
    `<link>${xmlEscape(siteUrl)}</link>`,
    `<description>${cdata(description)}</description>`,
    `<language>zh-CN</language>`,
    `<lastBuildDate>${xmlEscape(now)}</lastBuildDate>`,
    `<atom:link href="${xmlEscape(feedUrl)}" rel="self" type="application/rss+xml" />`,
    itemsXml,
    "</channel>",
    "</rss>",
  ].join("");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
