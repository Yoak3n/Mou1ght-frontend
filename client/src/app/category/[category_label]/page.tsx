import type { FC } from 'react';
import { getArticlesByCategoryLabel } from '@/lib/api';
import ArticleCard from '@/components/card/ArticleCard';


const CategoryDetail: FC<{ params: { category_label: string } }> = async ({ params }) => {
  const { category_label } = await params;
  const decodedCategoryLabel = (() => {
    try {
      return decodeURIComponent(category_label);
    } catch {
      return category_label;
    }
  })();

  
  const articles = decodedCategoryLabel ? await getArticlesByCategoryLabel(decodedCategoryLabel) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Category: {decodedCategoryLabel}</h1>
      {articles && articles.length > 0 ? (
          <div className="grid gap-6">
              {articles.map(article => (
                  <ArticleCard key={article.id} article={article} />
              ))}
          </div>
      ) : (
          <p className="text-gray-500 text-center py-10">No articles found in this category.</p>
      )}
    </div>
  );
};

export default CategoryDetail;
