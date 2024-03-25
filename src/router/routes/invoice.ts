
import EmptyLayout from '@/views/layouts/empty-layout.vue'
import { CustomRouteRecordRaw } from 'vue-router'

export const invoiceRoutes: CustomRouteRecordRaw = {
  path: 'invoice',
  name: 'invoice',
  component: EmptyLayout,
  meta: {
    title: '开票管理',
    iconfont: 'icon-coupon-line',
  },
  children: [
    {
      path: 'invoice-audit',
      name: 'invoiceAudit',
      component: () => import('@/views/invoice/invoice-audit.vue'),
      meta: {
        title: '发票申请',
      },
    }
  ],
}