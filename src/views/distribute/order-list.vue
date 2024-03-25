<template>
  <grid-table v-bind="bindGridTableAttr" ref="tableRef" />
</template>
<script lang="ts" setup>
import { distributeApi } from '@/api/distribute'
import { useAppStore } from '@/store'
import { useMessage } from '@/hooks/message'
import globalModelForm from '@/hooks/global-model-form'
const { getReferenceItems } = useAppStore()
const selectRows = ref()
const distributionOrderId = ref()
const tableRef = ref<IGridTable.Expose>()
const bindGridTableAttr = ref<IGridTable.Props>({
  title: '分销订单',
  api: {
    getList: distributeApi.getDistributeOrderList
  },
  selectable: true,
  columnSchemas: [
    {
      title: '订单编号',
      dataIndex: 'bdOrder.sn'
    },
    {
      title: '邀请用户',
      dataIndex: 'inviteUser.name'
    },
    {
      title: '邀请手机号',
      dataIndex: 'inviteUser.mobile'
    },
    {
      title: '注册用户',
      dataIndex: 'registerUser.realname'
    },
    {
      title: '注册手机号',
      dataIndex: 'registerUser.mobile'
    },
    {
      title: '注册时间',
      dataIndex: 'registerUser.createdAt'
    },
    {
      title: '所属群体',
      dataIndex: 'registerUser.accountType',
      enumSchemas: getReferenceItems('accountTypeEnum')
    },
    {
      title: '订单金额',
      dataIndex: 'orderAmount'
    },
    {
      title: '提现金额',
      dataIndex: 'withdrawalMoney'
    },
    {
      title: '收益',
      dataIndex: 'incomeAmount',
    },
    {
      title: '分销提成',
      customRender: ({ record }) => parseFloat(record?.distributeRate) + '%'
    },
    {
      title: '提现方式',
      dataIndex: 'withdrawalType',
      enumSchemas: getReferenceItems('withdrawalTypeEnum')
    },
    {
      title: '提现状态',
      dataIndex: 'withdrawalStatus',
      enumSchemas: getReferenceItems('withdrawalStatusEnum')
    },
    {
      title: '提现时间',
      dataIndex: 'withdrawalTime'
    },
  ],
  searchSchemas: [
    {
      label: '注册时间',
      field: 'createdAt',
      component: 'DateRangePicker',
      componentProps: {
        valueFormat: 'YYYY-MM-DD'
      }
    } as IForm.Schema<'DateRangePicker'>,
    {
      label: '订单编号',
      field: 'orderSn',
      component: 'Input'
    } as IForm.Schema<'Input'>,
    {
      label: '邀请人手机号',
      field: 'inviteUserMobile',
      component: 'Input'
    } as IForm.Schema<'Input'>,
    {
      label: '注册手机号',
      field: 'registerUserMobile',
      component: 'Input'
    } as IForm.Schema<'Input'>,
    {
      label: '所属群体',
      field: 'userType',
      component: 'ReferenceSelect',
      componentProps: {
        referenceKey: 'distributeJoinerTypeEnum'
      }
    } as IForm.Schema<'ReferenceSelect'>,
    {
      label: '提现方式',
      field: 'withdrawalType',
      component: 'ReferenceSelect',
      componentProps: {
        referenceKey: 'withdrawalTypeEnum'
      }
    } as IForm.Schema<'ReferenceSelect'>,
    {
      label: '提现状态',
      field: 'withdrawalStatus',
      component: 'ReferenceSelect',
      componentProps: {
        referenceKey: 'withdrawalStatusEnum'
      }
    } as IForm.Schema<'ReferenceSelect'>,
  ],
  tableActions: [
    {
      label: '提现流水',
      type: 'primary',
      needReload: true,
      click: async () => {
        selectRows.value = tableRef.value?.getSelectionRows()
        distributionOrderId.value = tableRef.value?.getSelectionRows().map(item => item.id)
        console.log(distributionOrderId.value)
        if (selectRows.value.length === 0) {
          return useMessage.error('请选择订单')
        }
        await globalModelForm.init({
          title: '新增提现流水',
          destroyOnClose: true,
          schemas: [
            {
              label: '',
              field: '',
              component: 'PureDisplay',
              renderComponentContent: () => `共处理${selectRows.value.length}个订单的提现流水`
            } as IForm.Schema<'PureDisplay'>,
            {
              label: '提现方式',
              field: 'withdrawalType',
              required: true,
              component: 'ReferenceSelect',
              componentProps: {
                referenceKey: 'withdrawalTypeEnum'
              }
            } as IForm.Schema<'ReferenceSelect'>,
            {
              label: '提现金额',
              field: 'withdrawalMoney',
              required: true,
              componentProps: {
                min: 0,
                precision: 2
              },
              component: 'InputNumber'
            } as IForm.Schema<'InputNumber'>
          ],
          successCallback: async v => {
            console.log(Object.assign({}, { distributionOrderId: distributionOrderId.value }, { ...v }))
            await distributeApi.addOrderWithdrawal(Object.assign({}, { distributionOrderId: distributionOrderId.value }, { ...v }))
            await tableRef.value?.reload()
            return Promise.resolve('')
          }
        })
        return Promise.resolve('')
      }
    }
  ]
})
</script>