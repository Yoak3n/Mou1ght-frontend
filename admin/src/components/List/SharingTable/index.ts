import { h } from "vue"

import { NButton, NEllipsis, NTag} from "naive-ui"
import type { DataTableColumns, DropdownOption} from 'naive-ui'

import type { SharingInfo, PostState, UserInfo, Attachment } from "@/types"
import PostStateComponent from '@/components/Thing/PostState/index.vue'
import AttachmentColumn from "@/components/Thing/Attachment/index.vue"

export interface RowData {
    id: string,
    brief: string,
    tags: string[]
    author: UserInfo,
    update_time: string,
    state: PostState,
    attachments?: Attachment[]
}

export const createColumns = ({ action }: { action: (e:MouseEvent,data: RowData) => void }): DataTableColumns<RowData> => {
    return [
        {
            key: 'brief',
            title: '摘要',
            resizable: true,
            minWidth: 200,
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
            key: 'attachments',
            title: '附件',
            render(row) {
                return h(
                    AttachmentColumn, {
                        srcs: row.attachments || []
                    }
                )
            }
        },{
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
            state: item.state,
            attachments: item.attachments || []
        }
    })
}

export const contextMenuOptions:DropdownOption[] = [
    // {
    //     label: '更新说说',
    //     key: 'updateSharing'
    // },
    {
        label: '预览说说',
        key: 'previewSharing'
    },{
        label: '删除说说',
        key: 'deleteSharing',
        type: 'error'
    }
]
