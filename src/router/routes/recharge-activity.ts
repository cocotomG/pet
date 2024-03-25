import EmptyLayout from '@/views/layouts/empty-layout.vue'
import { CustomRouteRecordRaw } from 'vue-router'

export const rechargeActivityRoutes: CustomRouteRecordRaw = {
  path: 'recharge-activity',
  name: 'rechargeActivity',
  component: () => import('@/views/recharge-activity/recharge-activity-list.vue'),
  meta: {
    title: '充值活动管理',
    iconfont: 'icon-money-cny-box-line',
  }
}
