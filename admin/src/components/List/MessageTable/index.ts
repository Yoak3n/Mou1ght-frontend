import { NButton, NEllipsis, type DropdownOption } from "naive-ui"
import { type DataTableColumns } from "naive-ui"
import { h } from "vue"

import type { MessageInfo, PostState} from "@/types"
import PostStateComponent from '@/components/Thing/PostState/index.vue'

export interface RowData {
    id: string,
    brief: string,
    update_time: string,
    state: PostState,
}

export const createColumns = ({ action }: { action: (e:MouseEvent,data: RowData) => void }): DataTableColumns<RowData> => {
    return [
        {
            key: 'brief',
            title: '摘要',
            resizable: true,
            minWidth: 200,
            maxWidth: 400,
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

export const createData = (messages: MessageInfo[]): RowData[] => {
    return messages.map(item => {
        return {
            id: item.id,
            brief: item.content,
            update_time: item.time.updated_at,
            state: item.state,
        }
    })
}

export const contextMenuOptions:DropdownOption[] = [
    {
        label: '审核通过',
        key: 'passMessage'
    },{
        label: '预览留言',
        key: 'previewMessage'
    },{
        label: '删除留言',
        key: 'deleteMessage',
        type: 'error'
    }
]