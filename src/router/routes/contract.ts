import EmptyLayout from '@/views/layouts/empty-layout.vue'
import { CustomRouteRecordRaw } from 'vue-router'

export const contractRoutes: CustomRouteRecordRaw = {
  path: 'contract',
  name: 'contract',
  component: EmptyLayout,
  meta: {
    title: '合同管理',
    iconfont: 'icon-account-pin-box-line1',
  },
  children: [
    {
      path: 'contract-template-list',
      name: 'contractTemplateList',
      component: () => import('@/views/contract/contract-template-list.vue'),
      meta: {
        title: '合同模板',
      },
    },
    {
      path: 'contract-template-detail',
      name: 'contractTemplateDetail',
      component: () => import('@/views/contract/contract-template-detail.vue'),
      meta: {
        parentName: 'contractTemplateList',
        hideInMenu: true,
        title: '发起合同',
      },
    },
    {
      path: 'contract-list',
      name: 'contractList',
      component: () => import('@/views/contract/contract-list.vue'),
      meta: {
        title: '合同签署列表',
      },
    }
  ],
}
