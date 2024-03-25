<template>
  <div>
    <div class="bg-white">
      <grid-table
        v-bind="bindTableAttr"
        ref="gridTableEl"
      />
    </div>
  </div>
</template>
<script lang="tsx" setup>
import globalModelForm from '@/hooks/global-model-form'
import { paymentApi } from '@/api/payment'
const props = defineProps({
  walletableType: {
    type: String,
    default: 'company'
  }
})
const gridTableEl = ref<IGridTable.Expose>()
const bindTableAttr = ref<IGridTable.Props>({
  api: {
    getList: paymentApi.getRechargeList
  },
  getListApiParams: {
    walletableType: props.walletableType
  },
  columnSchemas: [
    {
      title: '客户名称',
      dataIndex: 'walletable.name'
    },
    {
      title: '联系电话',
      dataIndex: 'walletable.legalMobile'
    },
    {
      title: '银行渠道',
      dataIndex: 'walletable.bankName'
    },
    {
      title: '银行账号',
      dataIndex: 'walletable.bankAccount'
    },
    {
      title: '当前余额',
      dataIndex: 'totalBalance'
    },
    {
      title: '累计充值金额',
      dataIndex: 'totalRealBalance'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt'
    },
  ],
  tableActions: [
    {
      label: '充值',
      type: 'primary',
      click: () => {
        globalModelForm.init({
          title: '充值',
          schemas: [
            {
              label: '客户',
              field: 'companyId',
              required: true,
              component: 'CompanyApiSelect'
            },
            {
              label: '充值类型',
              field: 'type',
              component: 'ReferenceSelect',
              required: true,
              componentProps: {
                referenceKey: 'manualWalletMoneyLogTypeEnum'
              }
            },
            {
              label: '充值金额',
              field: 'amount',
              required: true,
              component: 'InputMoney',
              componentProps: {
                min: 0
              }
            } as IForm.Schema<'InputMoney'>
          ],
          successCallback: async v => {
            await paymentApi.addRecharge(v)
            gridTableEl.value?.reload()
          }
        })
      }
    }
  ]
})

// function recharge() {
//   globalModelForm.init({
//     title: '新增交易流水',
//     schemas: [
//       {
//         label: '客户',
//         field: 'companyId',
//         required: true,
//         component: 'CompanyApiSelect'
//       },
//       {
//         label: '充值类型',
//         field: 'type',
//         component: 'ReferenceSelect',
//         required: true,
//         componentProps: {
//           referenceKey: 'manualWalletMoneyLogTypeEnum'
//         }
//       },
//       {
//         label: '客户',
//         field: 'amount',
//         required: true,
//         component: 'InputMoney'
//       } as IForm.Schema<'InputMoney'>
//     ],
//     successCallback: async v => {
//       await paymentApi.addRecharge(v)
//       gridTableEl.value.reload()
//     }
//   })
// }
</script>