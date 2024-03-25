import EmptyLayout from '@/views/layouts/empty-layout.vue'
import { CustomRouteRecordRaw } from 'vue-router'

export const intendedCustomersRoutes: CustomRouteRecordRaw = {
  path: 'intended-customers',
  name: 'intended-customers',
  redirect: { name: 'articleList' },
  component: EmptyLayout,
  meta: {
    title: '意向客户管理',
    iconfont: 'icon-user-heart-line',
  },
  children: [
    {
      path: 'customers-list',
      name: 'customersList',
      component: () => import('@/views/intended-customers/customers-list.vue'),
      meta: {
        title: '意向客户列表',
      },
    },
  ],
}
