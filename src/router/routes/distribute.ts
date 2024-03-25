import EmptyLayout from '@/views/layouts/empty-layout.vue'
import { CustomRouteRecordRaw } from 'vue-router'

export const distributeRoutes: CustomRouteRecordRaw = {
  path: 'distribute',
  name: 'distribute',
  component: EmptyLayout,
  meta: {
    title: '分销活动管理',
    iconfont: 'icon-account-pin-box-line1',
  },
  children: [
    {
      path: 'activity',
      name: 'activity',
      component: () => import('@/views/distribute/activity-list.vue'),
      meta: {
        title: '活动列表',
        iconfont: 'icon-article-line1',
      },
    },
    {
      path: 'poster',
      name: 'poster',
      component: () => import('@/views/distribute/poster-list.vue'),
      meta: {
        title: '海报列表',
        iconfont: 'icon-article-line1',
      },
    },
    {
      path: 'distribute-list',
      name: 'distributeList',
      component: () => import('@/views/distribute/distribute-list.vue'),
      meta: {
        title: '分销管理',
        iconfont: 'icon-article-line1',
      },
    },
    {
      path: 'distribute-order-list',
      name: 'distributeOrderList',
      component: () => import('@/views/distribute/order-list.vue'),
      meta: {
        title: '分销订单',
        iconfont: 'icon-article-line1',
      },
    },
    {
      path: 'withdraw-list',
      name: 'withdraw-list',
      component: () => import('@/views/distribute/withdraw-list.vue'),
      meta: {
        title: '活动提现',
        iconfont: 'icon-article-line1',
      },
    },
  ],
}
