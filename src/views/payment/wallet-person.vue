<template>
  <div>
    <div class="ml-10 bg-white">
      <div class="pt-4 pl-4 text-2xl">
        个人充值记录
      </div>
      <grid-table
        v-bind="bindTableAttr"
        ref="gridTableEl"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { paymentApi } from '@/api/payment'

const gridTableEl = ref<IGridTable.Expose>()
const bindTableAttr = ref<IGridTable.Props>({
  api: {
    getList: paymentApi.getRechargeList
  },
  getListApiParams: {
    walletableType: 'user'
  },
  columnSchemas: [
    {
      title: '姓名',
      dataIndex: 'walletable.name'
    },
    {
      title: '手机',
      dataIndex: 'walletable.mobile'
    },
    {
      title: '账号类型',
      dataIndex: 'walletable.accountType'
    },
    {
      title: '总充值金额',
      dataIndex: 'totalBalance'
    },
    {
      title: '真实充值金额',
      dataIndex: 'realBalance'
    },
    {
      title: '充值时间',
      dataIndex: 'createdAt'
    },
  ]
})
</script>