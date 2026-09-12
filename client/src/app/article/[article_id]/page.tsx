import type { FC } from 'react';
import type { Metadata } from 'next';
import { getArticleDetail } from '@/lib/api/article';
import { getBlogSetting } from '@/lib/api';
import Markdown from '@/components/display/Markdown';
import TableOfContents from '@/components/display/Markdown/toc';
import ViewTracker from '@/components/interaction/viewTracker';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TagsList from '@/components/interaction/tags';
import Categories from '@/components/interaction/categories';
import LikeButton from '@/components/interaction/like';
import ViewButton from '@/components/display/view';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import Link from 'next/link';

// ISR：文章详情缓存 10 分钟，发布/更新/删除时由后端 webhook 按需失效。
export const revalidate = 600;

// 构建期后端通常不可达（返回空列表），不在构建期预渲染具体文章；
// 未预渲染的路径在首个请求时渲染并进入 ISR 缓存。
export async function generateStaticParams() {
    return [];
}

export async function generateMetadata({ params }: { params: { article_id: string } }): Promise<Metadata> {
    const { article_id } = await params;
    const [article, setting] = await Promise.all([
        getArticleDetail(article_id),
        getBlogSetting()
    ]);
    const blogTitle = setting?.nav_bar?.website_information?.title || "Mou1ght";
    
    if (!article) {
        return {
             title: `Article Not Found | ${blogTitle}`,
        }
    }

    return {
        title: article.title, // Template in layout.tsx will handle the suffix
        description: article.content.substring(0, 150),
    }
}

const ArticleView: FC<{ params: { article_id: string } }> = async ({ params }) => {
    const { article_id } = await params;
    const article = await getArticleDetail(article_id);

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <div className="bg-card p-8 rounded-lg shadow-md text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-2">文章不存在</h1>
                    <p className="text-muted-foreground">无法找到请求的文章，可能已被删除或移动。</p>
                    <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
                        返回首页
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/40 pb-12">
            <ViewTracker id={article_id} type="article" />
            {/* Header / Banner Area (Optional, currently just spacing) */}
            {/* <div className="h-64 bg-linear-to-r from-blue-50 to-indigo-50 w-full absolute top-0 left-0 z-0"></div> */}

            <div className="container mx-auto px-4 relative z-10 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Article Header Card */}
                        <div className="bg-card rounded-xl shadow-sm border border-border p-6 sm:p-10">
                            <div className="space-y-4">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                                    {article.title}
                                </h1>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-border">
                                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-8 h-8 border border-border">
                                                <AvatarImage src={article.author?.avatar} alt={article.author?.username} />
                                                <AvatarFallback>{article.author?.username?.[0]?.toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-foreground/80">{article.author?.username}</span>
                                        </div>
                                        <Separator orientation="vertical" className="h-4 hidden sm:block" />
                                        <div className="flex items-center gap-1">
                                            <CalendarIcon className="w-4 h-4" />
                                            <span>{new Date(article.time.updated_at).toLocaleDateString()}</span>
                                        </div>
                                        <Separator orientation="vertical" className="h-4 hidden sm:block" />
                                        <div className="flex items-center gap-1">
                                            <ClockIcon className="w-4 h-4" />
                                            <span>{article.state.length || 0} words</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <LikeButton id={article.id} count={article.state.like} type="article" />
                                        <ViewButton count={article.state.view} type="article" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Article Content */}
                        <div className="bg-card rounded-xl shadow-sm border border-border p-6 sm:p-10 min-h-[500px]">
                            <Markdown content={article.content} />
                        </div>

                        {/* Article Footer Actions (Removed as moved to header) */}
                        {/* 
                        <div className="bg-card rounded-xl shadow-sm border border-border p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                             <div className="text-sm text-muted-foreground">
                                Last updated on {new Date(article.time.updated_at).toLocaleString()}
                            </div>
                        </div> 
                        */}
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="sticky top-24 space-y-6">
                            {/* Author Card */}
                            <Card className="shadow-sm border-border">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">About Author</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 mb-4">
                                        <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
                                            <AvatarImage src={article.author?.avatar} alt={article.author?.username} />
                                            <AvatarFallback className="text-lg">{article.author?.username?.[0]?.toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <div className="font-bold text-lg text-foreground truncate">{article.author?.username}</div>
                                            <div className="text-xs text-muted-foreground">Author</div>
                                        </div>
                                    </div>
                                    {article.author?.bio ? (
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                            {article.author.bio}
                                        </p>
                                    ) : null}
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href={`/author/${encodeURIComponent(article.author?.username || '')}`}
                                            className="inline-flex items-center justify-center rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                                        >
                                            查看 TA 的文章
                                        </Link>
                                        <Link
                                            href="/sharings"
                                            className="inline-flex items-center justify-center rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                                        >
                                            去说说逛逛
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* TOC Card */}
                            <Card className="shadow-sm border-border">
                                <CardHeader>
                                    <CardTitle className="text-lg">Table of Contents</CardTitle>
                                </CardHeader>
                                <CardContent className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                                    <TableOfContents content={article.content} />
                                </CardContent>
                            </Card>

                            {/* Categories & Tags */}
                            <Card className="shadow-sm border-border">
                                <CardContent className="pt-1 space-y-4">
                                    <Categories categories={article.categories} />
                                    <Separator />
                                    <TagsList tags={article.tags} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleView;
