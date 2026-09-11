import { h } from 'vue'
import { NButton, NEllipsis, NTag } from 'naive-ui'

import PostStateComponent from '@/components/PostState/index.vue'
import type { PostState } from '@/types'

// 表格列渲染的共享助手：三个内容表格（文章/说说/留言）复用同一套渲染逻辑。

export const renderEllipsis = (text: string, maxWidth = '240px') =>
    h(NEllipsis, { lineClamp: 1, style: { maxWidth } }, { default: () => text })

export const renderTags = (tags: string[], type: 'info' | 'success' = 'info') =>
    tags.map((tag) =>
        h(NTag, { style: { marginRight: '6px' }, type, bordered: false }, { default: () => tag })
    )

export const renderPostState = (state: PostState) => h(PostStateComponent, { state })

export const renderActionButton = (onClick: (e: MouseEvent) => void) =>
    h(NButton, { onClick: (e: MouseEvent) => onClick(e) }, { default: () => '操作' })

export const sortByTime = (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime()
