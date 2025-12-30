import type { FC } from 'react'
const ArticleView: FC<{ params: { article_id: string } }> = async({ params }) => {
    const {article_id} = await params
    return (
        <div>
            {article_id}
        </div>
    )
}

export default ArticleView