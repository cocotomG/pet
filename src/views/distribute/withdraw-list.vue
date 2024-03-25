<template>
  <grid-table v-bind="bindGridTableAttr" ref="tableRef" />
</template>
<script lang="ts" setup>
import { distributeApi } from '@/api/distribute'
import { useAppStore } from '@/store'
const { getReferenceItems } = useAppStore()
const tableRef = ref<IGridTable.Expose>()
const bindGridTableAttr = ref<IGridTable.Props>({
  title: '活动体现',
  api: {
    getList: distributeApi.getOrderWithdrawalFlowFlowList
  },
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
      title: '已提现金额',
      dataIndex: 'withdrawalMoney'
    },
    {
      title: '收益',
      dataIndex: 'incomeAmount',
    },
    {
      title: '分销比例',
      dataIndex: 'distributeRate'
    },
    {
      title: '提现方式',
      dataIndex: 'withdrawalType',
      enumSchemas: getReferenceItems('withdrawalTypeEnum')
    },
    // {
    //   title: '注册时间',
    //   dataIndex: 'registerUser.createdAt'
    // },
    {
      title: '提现时间',
      dataIndex: 'withdrawalTime'
    },
    // {
    //   title: '提现状态',
    //   dataIndex: 'withdrawalStatus',
    //   enumSchemas: getReferenceItems('withdrawalStatusEnum')
    // }
  ],
  searchSchemas: [
    {
      label: '提现时间',
      field: 'withdrawalTime',
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
    // {
    //   label: '提现状态',
    //   field: 'withdrawalStatus',
    //   component: 'ReferenceSelect',
    //   componentProps: {
    //     referenceKey: 'withdrawalStatusEnum'
    //   }
    // } as IForm.Schema<'ReferenceSelect'>,
  ],

})
</script>