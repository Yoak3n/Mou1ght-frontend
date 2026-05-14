<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NAlert, NButton, NCard, NDataTable, NDivider, NEmpty, NGrid, NGi, NProgress, NSkeleton, NSpace, NStatistic, NTabPane, NTabs, NTag } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart, BarChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

import { getAttachmentList, type AttachmentInfo } from '@/api/attachment'

use([PieChart, BarChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])

type AttachmentTypeStat = {
    type: string
    label: string
    count: number
    bytes: number
}

const router = useRouter()

const loading = ref(false)
const errorMessage = ref<string | null>(null)
const attachments = ref<AttachmentInfo[]>([])
const tabKey = ref<'bytes' | 'count' | 'detail'>('bytes')

const totalCount = computed(() => attachments.value.length)
const totalBytes = computed(() => attachments.value.reduce((sum, a) => sum + (a.size || 0), 0))

const typeStats = computed<AttachmentTypeStat[]>(() => {
    const map = new Map<string, AttachmentTypeStat>()
    for (const a of attachments.value) {
        const mime = a.mime || ''
        const { type, label } = normalizeAttachmentType(mime, a.original_name)
        const key = type || 'unknown'
        const prev = map.get(key)
        if (prev) {
            prev.count += 1
            prev.bytes += a.size || 0
        } else {
            map.set(key, {
                type: key,
                label,
                count: 1,
                bytes: a.size || 0,
            })
        }
    }
    return Array.from(map.values()).sort((a, b) => b.bytes - a.bytes)
})

const typeCount = computed(() => typeStats.value.length)

const bytesPieOption = computed(() => {
    const data = typeStats.value
        .filter((s) => s.bytes > 0)
        .map((s) => ({ name: s.label || s.type, value: s.bytes }))

    return {
        tooltip: { trigger: 'item' },
        legend: { type: 'scroll', orient: 'vertical', right: 0, top: 8, bottom: 8 },
        series: [
            {
                name: '空间占用',
                type: 'pie',
                radius: ['45%', '70%'],
                center: ['40%', '50%'],
                avoidLabelOverlap: true,
                label: { show: false },
                emphasis: { label: { show: true, fontSize: 12, formatter: '{b}\n{d}%' } },
                labelLine: { show: false },
                data,
            },
        ],
    }
})

const countBarOption = computed(() => {
    const top = typeStats.value.slice(0, 8)
    const labels = top.map((s) => s.label || s.type)
    const values = top.map((s) => s.count)
    return {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: 8, right: 8, top: 8, bottom: 8, containLabel: true },
        xAxis: { type: 'value', minInterval: 1 },
        yAxis: { type: 'category', data: labels, inverse: true },
        series: [
            {
                name: '数量',
                type: 'bar',
                data: values,
                barMaxWidth: 18,
            },
        ],
    }
})

const columns = computed<DataTableColumns<AttachmentTypeStat>>(() => [
    {
        title: '类型',
        key: 'label',
        width: 140,
        render: (row) =>
            h(
                NTag,
                { type: 'info', size: 'small', round: true },
                { default: () => row.label || row.type }
            ),
    },
    { title: '数量', key: 'count', width: 80 },
    {
        title: '占用空间',
        key: 'bytes',
        width: 140,
        render: (row) => formatBytes(row.bytes),
    },
    {
        title: '占比',
        key: 'ratio',
        render: (row) => {
            const total = totalBytes.value
            const percent = total > 0 ? (row.bytes / total) * 100 : 0
            return h(NProgress, {
                type: 'line',
                percentage: Number(percent.toFixed(2)),
                indicatorPlacement: 'inside',
                height: 14,
                borderRadius: 6,
            })
        },
    },
])

const fetchAttachmentStats = async () => {
    loading.value = true
    errorMessage.value = null
    try {
        const res = await getAttachmentList()
        if (res.code === 0) {
            attachments.value = res.data?.attachments ?? []
            return
        }
        throw new Error(res.message || '获取附件列表失败')
    } catch (e: any) {
        attachments.value = []
        errorMessage.value = e?.message || String(e) || '获取附件列表失败'
    } finally {
        loading.value = false
    }
}

const goManage = () => {
    router.push({ name: 'post' })
}

function normalizeAttachmentType(mime: string, filename: string) {
    const m = (mime || '').toLowerCase()
    if (m.startsWith('image/')) return { type: 'image', label: '图片' }
    if (m.startsWith('video/')) return { type: 'video', label: '视频' }
    if (m.startsWith('audio/')) return { type: 'audio', label: '音频' }
    if (m.startsWith('text/')) return { type: 'text', label: '文本' }
    if (m === 'application/pdf') return { type: 'pdf', label: 'PDF' }
    if (m.includes('zip') || m.includes('rar') || m.includes('7z') || m.includes('tar')) return { type: 'archive', label: '压缩包' }

    const ext = (filename || '').split('.').pop()?.toLowerCase()
    if (!ext || ext === filename.toLowerCase()) return { type: 'unknown', label: '其他' }
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico', 'avif'].includes(ext))
        return { type: 'image', label: '图片' }
    if (['mp4', 'mov', 'mkv', 'avi', 'webm'].includes(ext)) return { type: 'video', label: '视频' }
    if (['mp3', 'wav', 'aac', 'flac', 'ogg'].includes(ext)) return { type: 'audio', label: '音频' }
    if (['txt', 'md', 'json', 'xml', 'csv', 'log'].includes(ext)) return { type: 'text', label: '文本' }
    if (['pdf'].includes(ext)) return { type: 'pdf', label: 'PDF' }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return { type: 'archive', label: '压缩包' }
    return { type: ext, label: ext.toUpperCase() }
}

function formatBytes(bytes: number) {
    const b = Number.isFinite(bytes) ? bytes : 0
    if (b <= 0) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    const base = 1024
    const exp = Math.min(Math.floor(Math.log(b) / Math.log(base)), units.length - 1)
    const value = b / Math.pow(base, exp)
    return `${value.toFixed(value >= 10 || exp === 0 ? 0 : 1)} ${units[exp]}`
}

onMounted(() => {
    void fetchAttachmentStats()
})
</script>

<template>
    <n-card title="附件面板" hoverable size="small" :content-style="{ padding: '12px' }">
        <n-space vertical size="small">
            <n-space justify="space-between" align="center">
                <n-grid :x-gap="8" cols="3 s:1 m:3 l:3 xl:3 2xl:3" responsive="screen" class="stats-grid">
                    <n-gi>
                        <n-statistic label="附件总数" :value="totalCount" :value-style="{ fontSize: '16px' }" />
                    </n-gi>
                    <n-gi>
                        <n-statistic label="总占用空间" :value="formatBytes(totalBytes)" :value-style="{ fontSize: '16px' }" />
                    </n-gi>
                    <n-gi>
                        <n-statistic label="类型数量" :value="typeCount" :value-style="{ fontSize: '16px' }" />
                    </n-gi>
                </n-grid>
                <n-space>
                    <n-button size="small" tertiary :loading="loading" @click="fetchAttachmentStats">刷新</n-button>
                </n-space>
            </n-space>

            <n-divider style="margin: 8px 0" />

            <n-skeleton v-if="loading" text :repeat="6" />
            <n-alert v-else-if="errorMessage" type="error" title="加载失败">
                {{ errorMessage }}
            </n-alert>
            <n-empty v-else-if="totalCount === 0" description="暂无附件" />
            <template v-else>
                <n-tabs v-model:value="tabKey" type="line" size="small" animated>
                    <n-tab-pane name="bytes" tab="空间占用">
                        <div class="chart-wrap" v-if="tabKey === 'bytes'">
                            <v-chart class="chart" :option="bytesPieOption" autoresize />
                        </div>
                    </n-tab-pane>
                    <n-tab-pane name="count" tab="数量">
                        <div class="chart-wrap" v-if="tabKey === 'count'">
                            <v-chart class="chart" :option="countBarOption" autoresize />
                        </div>
                    </n-tab-pane>
                    <n-tab-pane name="detail" tab="明细">
                        <n-data-table v-if="tabKey === 'detail'" :columns="columns" :data="typeStats" :bordered="false" size="small" />
                    </n-tab-pane>
                </n-tabs>

                <n-space justify="end" size="small">
                    <n-button size="small" quaternary type="primary" @click="goManage">去内容管理</n-button>
                </n-space>
            </template>
        </n-space>
    </n-card>
</template>

<style scoped>
.stats-grid {
    flex: 1;
}
.chart-wrap {
    width: 100%;
    padding: 4px 0 0 0;
}
.chart {
    width: 100%;
    height: 180px;
}
</style>
