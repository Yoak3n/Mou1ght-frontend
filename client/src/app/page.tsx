import Link from "next/link";
import ArticleCard from "@/components/card/ArticleCard";
import ScreenPicture from "@/components/display/screen";
import { getArticleListPage } from "@/lib/api";

// ISR：首页按页缓存 5 分钟，后台发布内容时由后端 webhook 按需失效。
export const revalidate = 300;

const PAGE_SIZE = 5;

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const data = await getArticleListPage(page, PAGE_SIZE);
  const articles = data?.articles ?? null;
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="w-full flex flex-col bg-muted/40 min-h-screen">
      <ScreenPicture />
      <div className="w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl space-y-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
             <h2 className="text-3xl font-bold tracking-tight text-foreground">Latest Articles</h2>
          </div>
          
          <div className="article-list grid gap-6 sm:grid-cols-1 md:grid-cols-1">
          {articles &&
            articles.length > 0 ?
            articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
            : (
              <div className="text-center py-12 text-muted-foreground">
                No Articles Found
              </div>
            )
          }
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-6 text-sm">
              {page > 1 ? (
                <Link
                  href={`/?page=${page - 1}`}
                  scroll={false}
                  className="px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-accent"
                >
                  上一页
                </Link>
              ) : (
                <span className="px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground/60 cursor-not-allowed">
                  上一页
                </span>
              )}
              <span className="text-muted-foreground">
                第 {page} / {totalPages} 页
              </span>
              {page < totalPages ? (
                <Link
                  href={`/?page=${page + 1}`}
                  scroll={false}
                  className="px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-accent"
                >
                  下一页
                </Link>
              ) : (
                <span className="px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground/60 cursor-not-allowed">
                  下一页
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
