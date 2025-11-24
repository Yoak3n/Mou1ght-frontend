<template>
  <div class="article-list-wrapper">
    <n-layout-header :bordered="true" v-if="$route.name === 'ArticleList'">
      <n-button type="primary" @click="$router.push('/article/list/modify/add')">新增文章</n-button>
    </n-layout-header>
    <n-layout-content content-style="padding: 24px;" v-if="$route.name === 'ArticleList'">
      <n-data-table :columns="columns" :data="data" :pagination="pagination" :bordered="false"  />
    </n-layout-content>
    <router-view/>
  </div>
</template>
<script setup lang="ts">
import { onMounted,reactive, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NLayoutHeader,
  NLayoutContent,
  NDataTable,
  DataTableColumns,
  NButton
} from 'naive-ui'
import {getArticleList} from '@/api/article'

const $route = useRoute()
const $router = useRouter()


onMounted(async () => {
  const res = await getArticleList()
  if (res) {
    console.log(res);
  }
})



type Song = {
  no: number
  title: string
  author: string
}
const createColumns = ({
  play
}: {
  play: (row: Song) => void
}): DataTableColumns<Song> => {
  return [
    {
      title: 'No',
      key: 'no'
    },
    {
      title: 'Title',
      key: 'title'
    },
    {
      title: '作者',
      key: 'author'
    },
    {
      title: 'Action',
      key: 'actions',
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => play(row)
          },
          { default: () => 'Play' }
        )
      }
    }
  ]
}

const columns = createColumns({
  play(row: Song) {
    window.$message.info(`Play ${row.title}`)
  }
})


const paginationReactive = reactive({
  page: 2,
  pageSize: 5,
  showSizePicker: true,
  pageSizes: [3, 5, 7],
  onChange: (page: number) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  }
})
const pagination = paginationReactive
const data: Song[] = [
  { no: 3, title: 'Wonderwall', author: '4:18' },
  { no: 4, title: "Don't Look Back in Anger", author: '4:48' },
  { no: 12, title: 'Champagne Supernova', author: '7:27' }
]

</script>

<style scoped>
.article-list-wrapper {
  height: 100%;
}
</style>