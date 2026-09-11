import { h } from 'vue'
import type { DataTableColumns, DropdownOption } from 'naive-ui'

import type { SharingInfo, PostState, UserInfo, Attachment } from '@/types'
import AttachmentPreview from '@/components/Attachment/Preview.vue'
import { renderEllipsis, renderTags, renderPostState, renderActionButton, sortByTime } from '../shared'

export interface RowData {
    id: string
    brief: string
    tags: string[]
    author: UserInfo
    update_time: string
    state: PostState
    attachments?: Attachment[]
}

export const createColumns = ({ action }: { action: (e: MouseEvent, data: RowData) => void }): DataTableColumns<RowData> => [
    {
        key: 'brief',
        title: '摘要',
        resizable: true,
        minWidth: 200,
        render: (row) => renderEllipsis(row.brief),
    },
    {
        key: 'tags',
        title: '标签',
        render: (row) => renderTags(row.tags, 'info'),
    },
    {
        key: 'attachments',
        title: '附件',
        render: (row) => h(AttachmentPreview, { srcs: row.attachments || [] }),
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

export const createData = (sharings: SharingInfo[]): RowData[] =>
    sharings.map((item) => ({
        id: item.id,
        brief: item.content,
        tags: item.tags.map((t) => t.label),
        author: item.author,
        update_time: item.time.updated_at,
        state: item.state,
        attachments: item.attachments || [],
    }))

export const contextMenuOptions: DropdownOption[] = [
    {
        label: '设为公开',
        key: 'publishSharing',
    },
    {
        label: '设为私密',
        key: 'privateSharing',
    },
    {
        label: '预览说说',
        key: 'previewSharing',
    },
    {
        label: '删除说说',
        key: 'deleteSharing',
        type: 'error',
    },
]
