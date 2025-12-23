import { h } from "vue"

import { NButton, NEllipsis, NTag } from "naive-ui"
import type { DataTableColumns} from 'naive-ui'

import type { SharingInfo, PostState, UserInfo } from "@/types"
import PostStateComponent from '@/components/Thing/PostState/index.vue'


export interface RowData {
    id: string,
    brief: string,
    tags: string[]
    author: UserInfo,
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

export const createData = (sharings: SharingInfo[]): RowData[] => {
    return sharings.map(item => {
        return {
            id: item.id,
            brief: item.content,
            tags: item.tags.map(t => t.label),
            author: item.author,
            update_time: item.time.updated_at,
            state: item.state
        }
    })
}