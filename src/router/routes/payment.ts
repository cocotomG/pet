import { useAppStore } from '@/store'
import EmptyLayout from '@/views/layouts/empty-layout.vue'
import { CustomRouteRecordRaw } from 'vue-router'
// const { getReferenceConstantMap } = useAppStore()

export const paymentRoutes: CustomRouteRecordRaw = {
  path: 'payment',
  name: 'payment',
  component: EmptyLayout,
  redirect: { name: 'walletCompany' },
  meta: {
    title: '资产中心',
    iconfont: 'icon-database',
  },
  children: [
    {
      path: 'wallet-company',
      name: 'walletCompany',
      component: () => import('@/views/payment/wallet-company.vue'),
      meta: {
        title: '企业钱包',
      },
    },
    {
      path: 'wallet-recharge-log',
      name: 'walletRechargeLog',
      component: () => import('@/views/payment/wallet-log.vue'),
      meta: {
        title: '充值流水',
      },
      props: {
        type: 2
      }
    },
    {
      path: 'wallet-log',
      name: 'walletLog',
      component: () => import('@/views/payment/wallet-log.vue'),
      meta: {
        title: '交易流水'
      },
      props: {
        type: 'all'
      }
    }
    // {
    //   path: 'wallet-person',
    //   name: 'walletPerson',
    //   component: () => import('@/views/payment/wallet-person.vue'),
    //   meta: {
    //     title: '个人充值流水',
    //   },
    // },
  ],
}
