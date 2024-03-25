<template>
  <grid-table v-bind="bindGridTableAttr" ref="tableRef" />
</template>
<script lang="ts" setup>
import { distributeApi } from '@/api/distribute'
import { useAppStore } from '@/store'
import { find } from 'lodash-es'
const { getReferenceItems } = useAppStore()
let posterList = ref([
  {
    label: '平台流量',
    value: 0
  }
])
const tableRef = ref<IGridTable.Expose>()
const bindGridTableAttr = ref<IGridTable.Props>({
  title: '分销管理',
  api: {
    getList: distributeApi.getDistributeList
  },
  columnSchemas: [
    {
      title: '注册用户',
      dataIndex: 'name'
    },
    {
      title: '注册手机',
      dataIndex: 'mobile'
    },
    {
      title: '所属来源',
      dataIndex: 'user.source',
      customRender: ({ record }) => (record.user?.source === 0 ? '平台流量' : (find(posterList.value, ['value', record?.user?.source]))?.label)
    },
    {
      title: '所属群体',
      dataIndex: 'userType',
      enumSchemas: getReferenceItems('distributeJoinerTypeEnum')
    },
    {
      title: '所属下级',
      dataIndex: 'sumTotalInviteNumber'
    },
    // {
    //   title: '总邀请人数',
    //   dataIndex: 'sumTotalInviteNumber'
    // },
    {
      title: '分销订单数',
      dataIndex: 'sumTotalConsumeNumber'
    },
    {
      title: '分销总金额',
      // dataIndex: 'sumTotalConsumeAmount'
      customRender: ({ record }) => record?.sumTotalConsumeAmount?.toFixed(2)
    },
    {
      title: '累计收益',
      dataIndex: 'sumIncomeMoney'
    }
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
      label: '注册手机号',
      field: 'registerUserMobile',
      component: 'Input'
    } as IForm.Schema<'Input'>,
    {
      label: '所属来源',
      field: 'source',
      component: 'Select',
      componentProps: {
        options: posterList.value
      }
    } as IForm.Schema<'Select'>,
    {
      label: '所属群体',
      field: 'userType',
      component: 'ReferenceSelect',
      componentProps: {
        referenceKey: 'distributeJoinerTypeEnum'
      }
    } as IForm.Schema<'ReferenceSelect'>,
  ]
})
// 所属来源
async function getPosterList() {
  let posters = await distributeApi.getPosterList({})
  posters.forEach(item => {
    posterList.value.push({
      label: item.name,
      value: item.id
    })
  })
}
getPosterList()
</script>