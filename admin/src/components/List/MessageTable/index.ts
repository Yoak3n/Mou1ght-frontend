import type { DataTableColumns, DropdownOption } from 'naive-ui'

import type { MessageInfo, PostState } from '@/types'
import { renderEllipsis, renderPostState, renderActionButton, sortByTime } from '../shared'

export interface RowData {
    id: string
    brief: string
    update_time: string
    state: PostState
}

export const createColumns = ({ action }: { action: (e: MouseEvent, data: RowData) => void }): DataTableColumns<RowData> => [
    {
        key: 'brief',
        title: '摘要',
        resizable: true,
        minWidth: 200,
        maxWidth: 400,
        render: (row) => renderEllipsis(row.brief),
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

export const createData = (messages: MessageInfo[]): RowData[] =>
    messages.map((item) => ({
        id: item.id,
        brief: item.content,
        update_time: item.time.updated_at,
        state: item.state,
    }))

export const contextMenuOptions: DropdownOption[] = [
    {
        label: '审核通过',
        key: 'passMessage',
    },
    {
        label: '预览留言',
        key: 'previewMessage',
    },
    {
        label: '删除留言',
        key: 'deleteMessage',
        type: 'error',
    },
]
