import type { FC } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { ArticleInfo } from '@/types/post';
import LikeButton from '../interaction/like';
import ViewButton from '../display/view';
import { CalendarIcon, UserIcon } from 'lucide-react';

const ArticleCard: FC<{ article: ArticleInfo }> = ({ article }) => {
    return (
        <Card className="w-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-gray-200 bg-white group">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-amber-600 transition-colors line-clamp-2">
                        <Link href={"/article/" + article.id} className="block">
                            {article.title}
                        </Link>
                    </CardTitle>
                    {article.categories && article.categories.length > 0 && (
                        <div className="flex gap-2 shrink-0">
                            {article.categories.slice(0, 1).map(cat => (
                                <span key={cat.id} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                    {cat.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <p className="text-gray-600 line-clamp-3 leading-relaxed">
                    {article.content}
                </p>
            </CardContent>
            <CardFooter className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <div className="flex items-center gap-1 mr-4">
                        <UserIcon className="w-4 h-4" />
                        <span>{article.author.username}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{new Date(article.time.updated_at).toLocaleDateString()}</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <ViewButton count={article.state.view} type="article" />
                    <LikeButton count={article.state.like} type="article" />
                </div>
            </CardFooter>
        </Card>
    );
};

export default ArticleCard;