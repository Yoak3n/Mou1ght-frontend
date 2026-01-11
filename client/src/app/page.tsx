import ArticleCard from "@/components/card/ArticleCard";
import ScreenPicture from "@/components/display/screen";
import { getArticleList } from "@/lib/api";



export default async function Home() {
  const articles = await getArticleList();
  return (
    <div className="w-full flex flex-col bg-gray-50/50 min-h-screen">
      <ScreenPicture />
      <div className="w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl space-y-8">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
             <h2 className="text-3xl font-bold tracking-tight text-gray-900">Latest Articles</h2>
          </div>
          
          <div className="article-list grid gap-6 sm:grid-cols-1 md:grid-cols-1">
          {articles &&
            articles.length > 0 ?
            articles.slice(0, 5).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
            : (
              <div className="text-center py-12 text-gray-500">
                No Articles Found
              </div>
            )
          }
          </div>
        </div>
      </div>
    </div>
  );
}
