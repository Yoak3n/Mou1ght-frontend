import type { FC } from 'react'
import { getArticleDetail } from '@/lib/api/article'
import Markdown from '@/components/display/Markdown'
import TableOfContents from '@/components/display/Markdown/toc'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import TagsList from '@/components/interaction/tags'
import Categories from '@/components/interaction/categories'
const ArticleView: FC<{ params: { article_id: string } }> = async ({ params }) => {
    const { article_id } = await params
    const article = await getArticleDetail(article_id);
    console.log(article)
    if (!article) {
        return (
            <div className="article-view flex flex-col items-center justify-center">
                <div className="h-40 bg-red-100  w-full  text-white text-center">
                    文章不存在
                </div>
            </div>
        )
    }
    return (
        <div className="article-view flex flex-col items-center justify-center">
            {/* 文章封面 */}
            <div className="h-40 bg-blue-100  w-full text-white text-center"></div>
            {/* 文章文本内容 */}
            <div className="flex w-full px-4 min-h-96 relative">
                {/* 文章内容 */}
                <div className="w-full p-4 flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                    <div className="w-full">
                        <Markdown content={article.content} />
                        <div className="text-sm text-gray-700 mb-4 text-center">{article.time.updated_at.substring(0, 10)}</div>
                    </div>
                </div>


                <div className="article-information p-4 m-4 border rounded-md w-64 absolute top-0 right-0">
                    {/* 文章目录 */}
                    <TableOfContents content={article.content} />
                    {/* 文章作者 */}
                    <div className="flex items-center gap-3 ">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={article.author.avatar} alt={article.author.username} />
                            <AvatarFallback>{article.author.username}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm text-gray-700 flex items-center">{article.author.username}</div>
                    </div>
                    {/* 文章发布时间 */}

                    <Separator/>
                    <Categories categories={article.categories}/>
                    <Separator/>
                    <TagsList tags={article.tags}/>
                </div>
            </div>


        </div>
    )
}

export default ArticleView
