import type { FC } from 'react';
import { getArticlesByTagLabel } from '@/lib/api';
import ArticleCard from '@/components/card/ArticleCard';


const TagPageList: FC<{ params: { tag_label: string } }> = async({ params }) => {
    const {tag_label} = await params;
    const articles = await getArticlesByTagLabel(tag_label);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Tag: {tag_label}</h1>
      {articles && articles.length > 0 ? (
          <div className="grid gap-6">
              {articles.map(article => (
                  <ArticleCard key={article.id} article={article} />
              ))}
          </div>
      ) : (
          <p className="text-gray-500 text-center py-10">No articles found with this tag.</p>
      )}
    </div>
  );
};

export default TagPageList;
