import type { FC } from 'react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { ArticleInfo } from '@/types/post';
import LikeButton from '../interaction/like';
import ViewButton from '../display/view';

const ArticleCard: FC<{ article: ArticleInfo }> = ({ article }) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500">
                    {article.content.length > 100 ?
                        article.content.slice(0, 100) + '...'
                        : article.content}
                </p>
            </CardContent>
            <CardFooter className="flex flex-row items-center justify-between">
                <div>
                    <ViewButton count={article.state.view} type="article" />
                    <LikeButton count={article.state.like} type="article" />
                </div>
                <div className="flex flex-col items-end justify-end">
                    <div className="text-sm text-gray-500">
                        {new Date(article.time.updated_at).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                        {article.author.username}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default ArticleCard;