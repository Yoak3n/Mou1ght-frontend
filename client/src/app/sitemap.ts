import type { MetadataRoute } from "next";
import { getAllCategories, getAllTags, getArticleList } from "@/lib/api";
import type { CategoryGroup } from "@/types/post";

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

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d;
}

function flattenCategoryLabels(nodes: CategoryGroup[]): string[] {
  const labels: string[] = [];
  const stack = [...nodes];
  while (stack.length) {
    const node = stack.pop();
    if (!node) continue;
    if (typeof node.label === "string" && node.label.length) labels.push(node.label);
    const children = node.children;
    if (Array.isArray(children) && children.length) {
      for (const child of children) stack.push(child);
    }
  }
  return labels;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [articles, categories, tags] = await Promise.all([
    getArticleList(),
    getAllCategories(),
    getAllTags(),
  ]);

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/sharings`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/board`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/categories`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/tags`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = (articles ?? []).map((a) => {
    const lastModified =
      parseDate(a.time?.updated_at) || parseDate(a.time?.created_at) || now;
    return {
      url: `${siteUrl}/article/${encodeURIComponent(a.id)}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  const categoryPages: MetadataRoute.Sitemap = flattenCategoryLabels(categories ?? []).map(
    (label) => ({
      url: `${siteUrl}/category/${encodeURIComponent(label)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    })
  );

  const tagPages: MetadataRoute.Sitemap = (tags ?? []).map((t) => ({
    url: `${siteUrl}/tag/${encodeURIComponent(t.label)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticPages, ...articlePages, ...categoryPages, ...tagPages];
}
