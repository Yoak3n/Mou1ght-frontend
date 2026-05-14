import type { FC } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/api";
import type { CategoryGroup } from "@/types/post";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "分类",
  description: "Browse categories",
};

function encodeLabel(label: string) {
  return encodeURIComponent(label);
}

function countDescendants(node: CategoryGroup): number {
  if (!node.children || node.children.length === 0) return 0;
  return node.children.reduce((sum, child) => sum + 1 + countDescendants(child), 0);
}

const CategoriesPage: FC = async () => {
  const categories = await getAllCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-baseline justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">分类</h1>
        <div className="text-sm text-gray-500">
          {categories ? `${categories.length} 个分类组` : "加载失败"}
        </div>
      </div>

      {categories && categories.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {categories.map((category) => {
            const directChildren = category.children || [];
            const descendantCount = countDescendants(category);
            const shownChildren = directChildren.slice(0, 12);
            const hiddenChildrenCount = Math.max(0, directChildren.length - shownChildren.length);

            return (
              <Card
                key={category.id}
                className="w-full bg-white border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-gray-900">
                    <Link
                      href={`/category/${encodeLabel(category.label)}`}
                      className="hover:text-amber-600 transition-colors"
                    >
                      {category.label}
                    </Link>
                  </CardTitle>
                  <div className="text-xs text-gray-500">
                    {descendantCount > 0 ? `包含 ${descendantCount} 个子分类` : "无子分类"}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {shownChildren.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {shownChildren.map((child) => (
                        <Badge key={child.id} asChild variant="secondary">
                          <Link href={`/category/${encodeLabel(child.label)}`}>{child.label}</Link>
                        </Badge>
                      ))}
                      {hiddenChildrenCount > 0 ? (
                        <Badge variant="outline">+{hiddenChildrenCount}</Badge>
                      ) : null}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      <Link
                        href={`/category/${encodeLabel(category.label)}`}
                        className="hover:text-amber-600 transition-colors"
                      >
                        查看该分类下文章
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-12">暂无分类</div>
      )}
    </div>
  );
};

export default CategoriesPage;
