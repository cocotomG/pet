import EmptyLayout from '@/views/layouts/empty-layout.vue'
import { CustomRouteRecordRaw } from 'vue-router'

export const companyRoutes: CustomRouteRecordRaw = {
  path: 'company',
  name: 'company',
  redirect: { name: 'companyUnvalidList' },
  component: EmptyLayout,
  meta: {
    title: '客户管理',
    iconfont: 'icon-user-settings-line',
  },
  children: [
    {
      path: 'company-unvalid-list',
      name: 'companyUnvalidList',
      component: () => import('@/views/company/company-list.vue'),
      meta: {
        title: '待认证客户',
      },
      props: {
        status: [0, 2]
      }
    },
    {
      path: 'company-valid-list',
      name: 'companyValidList',
      component: () => import('@/views/company/company-list.vue'),
      meta: {
        title: '已认证客户',
      },
      props: {
        status: [1]
      }
    },
  ],
}
