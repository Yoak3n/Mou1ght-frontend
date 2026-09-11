import type { FC } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ISR：标签列表变化少，缓存 10 分钟；标签增删时由后端按需失效。
export const revalidate = 600;

export const metadata: Metadata = {
  title: "标签",
  description: "Browse tags",
};

function encodeLabel(label: string) {
  return encodeURIComponent(label);
}

const TagsPage: FC = async () => {
  const tags = await getAllTags();
  const sorted = (tags || []).slice().sort((a, b) => a.label.localeCompare(b.label, "zh-Hans-CN"));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-baseline justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">标签</h1>
        <div className="text-sm text-muted-foreground">{tags ? `${sorted.length} 个标签` : "加载失败"}</div>
      </div>

      {sorted.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {sorted.map((tag) => (
            <Link key={tag.id} href={`/tag/${encodeLabel(tag.label)}`} className="block">
              <Card className="w-full bg-card border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-foreground hover:text-amber-600 transition-colors">
                    {tag.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">查看相关文章</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-center py-12">暂无标签</div>
      )}
    </div>
  );
};

export default TagsPage;
