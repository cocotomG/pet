<template>
  <grid-table
    v-bind="bindTableAttr"
    ref="gridTableEl"
  />
</template>
<script lang="tsx" setup>
import { paymentApi } from '@/api/payment'
import { useAppStore } from '@/store'
const props = defineProps({
  type: {
    type: [String, Number],
  }
})

const { getReferenceItems, getReferenceConstantMap } = useAppStore()
const gridTableEl = ref<IGridTable.Expose>()


const bindTableAttr = computed(():IGridTable.Props => ({
  api: {
    getList: paymentApi.getRechargeLog
  },
  getListApiParams: props.type === getReferenceConstantMap('walletMoneyLogTypeEnum').RECHARGE.value ? {
    type: props.type
  } : undefined,
  columnSchemas: [
    {
      title: '客户名称',
      dataIndex: 'customerName'
    },
    {
      title: '联系电话',
      dataIndex: 'mobile'
    },
    {
      title: '流水名称',
      dataIndex: 'name'
    },
    {
      title: '支付渠道',
      dataIndex: 'channel',
      enumSchemas: getReferenceItems('walletMoneyLogChannelEnum')
    },
    {
      title: '金额',
      dataIndex: 'amount',
      customRender: ({ record }) => <div>{record.isOut ? `-${record.amount}` : `+${record.amount}`}</div>
    },
    {
      title: '充值时间',
      dataIndex: 'createdAt'
    },
  ],
  searchSchemas: searchSchemas.value
}))

const searchSchemas = computed<IForm.Schema[]>(() => (props.type === 'recharge' ? [
  {
    label: '客户名称',
    field: 'companyId',
    component: 'CompanyApiSelect'
  }
] : [
  {
    label: '客户名称',
    field: 'companyId',
    component: 'CompanyApiSelect'
  },
  {
    label: '流水类型',
    field: 'type',
    component: 'ReferenceSelect',
    componentProps: {
      referenceKey: 'walletMoneyLogTypeEnum'
    }
  }
]))

</script>