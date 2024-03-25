import EmptyLayout from '@/views/layouts/empty-layout.vue'
import { CustomRouteRecordRaw } from 'vue-router'

export const systemRoutes: CustomRouteRecordRaw = {
  path: 'system',
  name: 'system',
  redirect: { name: 'articleList' },
  component: EmptyLayout,
  meta: {
    title: '系统管理',
    iconfont: 'icon-settings-line',
  },
  children: [
    {
      path: 'menu-list',
      name: 'menuList',
      component: () => import('@/views/system/menu-list.vue'),
      meta: {
        title: '菜单列表',
      },
    },
  ],
}
