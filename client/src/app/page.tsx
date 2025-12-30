import ArticleCard from "@/components/card/ArticleCard";
import ScreenPicture from "@/components/display/screen";
import { getArticleList } from "@/lib/api";



export default async function Home() {
  const articles = await getArticleList();
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <ScreenPicture />
      <div className="text-xl font-bold w-full flex flex-col items-center justify-center">
        <div className="article-list w-4xl ">
          {articles &&
            articles.length > 0 ?
            articles.slice(0, 5).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
            : "No Articles"
          }
        </div>

      </div>
    </div>
  );
}
