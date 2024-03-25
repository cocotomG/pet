import EmptyLayout from '@/views/layouts/empty-layout.vue'
import { CustomRouteRecordRaw } from 'vue-router'

export const backRoutes: CustomRouteRecordRaw = {
  path: 'back',
  name: 'back',
  redirect: { name: 'articleList' },
  component: EmptyLayout,
  meta: {
    title: '背调管理',
    iconfont: 'icon-file-user-line',
  },
  children: [
    {
      path: 'back-record',
      name: 'backRecord',
      component: () => import('@/views/back/back-record.vue'),
      meta: {
        title: '下单记录',
      },
    },
    {
      path: 'report-list',
      name: 'reportList',
      component: () => import('@/views/back/report-list.vue'),
      meta: {
        title: '报告列表',
      },
    },
  ],
}
