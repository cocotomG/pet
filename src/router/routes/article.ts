import EmptyLayout from '@/views/layouts/empty-layout.vue'
import { CustomRouteRecordRaw } from 'vue-router'

export const articleRoutes: CustomRouteRecordRaw = {
  path: 'article',
  name: 'article',
  component: () => import('@/views/article/article-list.vue'),
  meta: {
    title: '文章管理',
    iconfont: 'icon-article-line1',
  },
}
