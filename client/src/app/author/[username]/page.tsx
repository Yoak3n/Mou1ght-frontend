import type { FC } from 'react';
import type { Metadata } from 'next';
import { getAuthorByUsername, getBlogSetting } from '@/lib/api';
import ArticleCard from '@/components/card/ArticleCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export const revalidate = 600;

export async function generateStaticParams() {
    return [];
}

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
    const { username } = await params;
    const decoded = safeDecode(username);
    const setting = await getBlogSetting();
    const blogTitle = setting?.nav_bar?.website_information?.title || 'Mou1ght';
    return {
        title: `${decoded} | ${blogTitle}`,
        description: `${decoded} 发布的文章`,
    };
}

function safeDecode(v: string) {
    try {
        return decodeURIComponent(v);
    } catch {
        return v;
    }
}

const AuthorPage: FC<{ params: { username: string } }> = async ({ params }) => {
    const { username } = await params;
    const decoded = safeDecode(username);
    const data = await getAuthorByUsername(decoded);
    const author = data?.author;
    const articles = data?.articles ?? [];

    return (
        <div className="min-h-screen bg-muted/40 pb-12">
            <div className="container mx-auto px-4 pt-12">
                <div className="max-w-3xl mx-auto space-y-6">
                    <Card className="shadow-sm border-border">
                        <CardHeader>
                            <CardTitle className="text-lg">About Author</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-4">
                                <Avatar className="w-16 h-16 border-2 border-white shadow-sm shrink-0">
                                    <AvatarImage src={author?.avatar} alt={author?.username || decoded} />
                                    <AvatarFallback className="text-lg">
                                        {(author?.username || decoded)?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <div className="font-bold text-lg text-foreground">
                                        {author?.username || decoded}
                                    </div>
                                    {author?.bio ? (
                                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                            {author.bio}
                                        </p>
                                    ) : (
                                        <p className="mt-1 text-sm text-muted-foreground">这个作者很懒，还没有写签名。</p>
                                    )}
                                    <div className="mt-3 text-xs text-muted-foreground">
                                        共 {articles.length} 篇文章
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {articles.length > 0 ? (
                        <div className="grid gap-6">
                            {articles.map(article => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-muted-foreground">
                            暂无已发布文章。
                            <Link href="/" className="ml-2 text-blue-600 hover:underline">返回首页</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthorPage;
