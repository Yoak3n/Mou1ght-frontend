import { h } from "vue"

import { NButton, NEllipsis, NTag } from "naive-ui"
import type { DataTableColumns,DropdownOption } from "naive-ui"

import type { ArticleInfo, PostState, UserInfo } from "@/types"
import PostStateComponent from '@/components/Thing/PostState/index.vue'
export interface RowData {
    id: string,
    title: string,
    brief: string,
    tags: string[]
    categories: string[]
    author: UserInfo
    update_time: string,
    state: PostState
}

export const createColumns = ({ action }: { action: (e:MouseEvent,data: RowData) => void }): DataTableColumns<RowData> => {
    return [
        {
            key: 'title',
            title: '标题',
            resizable: true,
            minWidth: 50
        }, {
            key: 'brief',
            title: '摘要',
            render(row) {
                return h(
                    NEllipsis, {
                    lineClamp: 1,
                    style: {
                        maxWidth: '240px'
                    }
                }, {
                    default: () => row.brief
                }
                )
            }
        }, {
            key: 'categories',
            title: '分类',
            render(row) {
                const categories = row.categories.map(item =>
                    h(
                        NTag, {
                        style: {
                            marginRight: '6px'
                        },
                        type: 'success',
                        bordered: false
                    }, {
                        default: () => item
                    })
                )
                return categories
            }
        }, {
            key: 'tags',
            title: '标签',
            render(row) {
                const tags = row.tags.map(item =>
                    h(
                        NTag, {
                        style: {
                            marginRight: '6px'
                        },
                        type: 'info',
                        bordered: false
                    }, {
                        default: () => item
                    })
                )
                return tags
            }
        }, {
            key: 'author',
            title: '作者',
            render(row) {
                return h(
                    'div', {}, { default: () => row.author.username }
                )
            }
        }, {
            key: 'state',
            title: '状态',
            render(row){
                return h(
                    PostStateComponent,
                    {
                        state: row.state
                    }
                )
            }
        },{
            key: 'update_time',
            title: '更新时间',
            sorter: (row1,row2)=> {
                const date1 = new Date(row1.update_time)
                const date2 = new Date(row2.update_time)
                return date1.getTime() - date2.getTime()
            },
            width: 200
        },{
            key: 'action',
            title: '',
            render(row){
                return h(
                    NButton,{
                        onClick: (e)=> action(e,row)
                    },{
                        default: () => '操作'
                    }
                )
            }
        }
    ]
}

export const createData = (articles: ArticleInfo[]): RowData[] => {
    return articles.map(item => {
        return {
            id: item.id,
            title: item.title,
            brief: item.content,
            tags: item.tags.map(t => t.label),
            categories: item.categories.map(c => c.label),
            author: item.author,
            update_time: item.time.updated_at,
            state: item.state
        }
    })
}

export const contextMenuOptions:DropdownOption[] = [
    {
        label: '更新文章',
        key: 'updateArticle'
    },{
        label: '预览文章',
        key: 'previewArticle'
    }
]
