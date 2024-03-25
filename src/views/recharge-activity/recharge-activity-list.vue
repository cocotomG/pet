<template>
  <div>
    <grid-table v-bind="bindTableAttr" />
  </div>
</template>
<script lang="tsx" setup>
import { rechargeActivityApi } from '@/api/activity'
const bindTableAttr = ref<IGridTable.Props>({
  api: {
    getList: rechargeActivityApi.getRechargeActivityList
  },
  columnSchemas: [
    {
      title: '活动名称',
      dataIndex: 'name',
    },
    {
      title: '参与人数',
      dataIndex: 'joinCount'
    },
    {
      title: '开始时间',
      dataIndex: 'validStartTime'
    },
    {
      title: '结束时间',
      dataIndex: 'validEndTime'
    },
    {
      title: '是否上架',
      dataIndex: 'isShelves'
    },
    {
      title: '创建人',
      dataIndex: 'createAdmin.name'
    },
  ],
  searchSchemas: [
    {
      label: '活动名称',
      field: 'name'
    }
  ]
})
</script>