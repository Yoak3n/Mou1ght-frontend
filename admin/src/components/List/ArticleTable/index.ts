import type { DataTableColumns, DropdownOption } from 'naive-ui'

import type { ArticleInfo, PostState, UserInfo } from '@/types'
import { renderEllipsis, renderTags, renderPostState, renderActionButton, sortByTime } from '../shared'

export interface RowData {
    id: string
    title: string
    brief: string
    tags: string[]
    categories: string[]
    author: UserInfo
    update_time: string
    state: PostState
}

export const createColumns = ({ action }: { action: (e: MouseEvent, data: RowData) => void }): DataTableColumns<RowData> => [
    {
        key: 'title',
        title: '标题',
        resizable: true,
        minWidth: 50,
    },
    {
        key: 'brief',
        title: '摘要',
        render: (row) => renderEllipsis(row.brief),
    },
    {
        key: 'categories',
        title: '分类',
        render: (row) => renderTags(row.categories, 'success'),
    },
    {
        key: 'tags',
        title: '标签',
        render: (row) => renderTags(row.tags, 'info'),
    },
    {
        key: 'author',
        title: '作者',
        render: (row) => row.author.username,
    },
    {
        key: 'state',
        title: '状态',
        render: (row) => renderPostState(row.state),
    },
    {
        key: 'update_time',
        title: '更新时间',
        sorter: (a, b) => sortByTime(a.update_time, b.update_time),
        width: 200,
    },
    {
        key: 'action',
        title: '',
        render: (row) => renderActionButton((e) => action(e, row)),
    },
]

export const createData = (articles: (ArticleInfo | null | undefined)[]): RowData[] => {
    return (articles || []).filter((v): v is ArticleInfo => !!v).map((item) => ({
        id: item.id,
        title: item.title,
        brief: item.content,
        tags: item.tags.map((t) => t.label),
        categories: item.categories.map((c) => c.label),
        author: item.author,
        update_time: item.time.updated_at,
        state: item.state,
    }))
}

export const contextMenuOptions: DropdownOption[] = [
    {
        label: '更新文章',
        key: 'updateArticle',
    },
    {
        label: '更改状态',
        key: 'changeStatus',
    },
    {
        label: '预览文章',
        key: 'previewArticle',
    },
    {
        label: '删除文章',
        key: 'deleteArticle',
        type: 'error',
    },
]
