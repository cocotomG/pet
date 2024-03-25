<style lang='less' scoped>
</style>

<template>
  <GridTable v-bind="gridTableProps" />
</template>
<script lang='tsx' setup>
import { packageApi } from '@/api/package'
import { ref } from 'vue'

const gridTableProps = ref<IGridTable.Props>({
  api: {
    getList: packageApi.getBackPackList,
    update: packageApi.updateBackPack
  },
  editable: true,
  searchSchemas: [
    {
      label: '客户名称',
      field: 'companyId',
      component: 'CompanyApiSelect',
    } as IForm.Schema<'CompanyApiSelect'>,
    {
      label: '背调套餐',
      field: 'goodId',
      component: 'CommonApiSelect',
      componentProps: {
        commonApiSelectType: 'goods'
      }
    } as IForm.Schema<'CommonApiSelect'>,
    {
      label: '修改时间',
      field: 'updatedAt',
      component: 'DateRangePicker',
      componentProps: {
        valueFormat: 'YYYY-MM-DD'
      }
    } as IForm.Schema<'DateRangePicker'>,
  ],
  columnSchemas: [
    {
      title: '客户名称',
      dataIndex: 'company.name',
    },
    {
      title: '套餐名称',
      dataIndex: 'good.name',
    },
    {
      title: '原价（元）',
      dataIndex: 'good.amount',
    },
    {
      title: '折扣价',
      dataIndex: 'discountAmount',
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
    },
    {
      title: '操作人',
      dataIndex: 'updateAdmin.name',
    },
  ],
  formSchemas: [
    {
      label: '客户名称',
      field: 'company.name',
      component: 'Input',
      componentProps: {
        disabled: true
      }
    } as IForm.Schema<'Input'>,
    {
      label: '套餐名称',
      field: 'good.name',
      disable: true,
      component: 'Input',
      componentProps: {
        disabled: true
      }
    } as IForm.Schema<'Input'>,
    {
      label: '原价',
      field: 'good.amount',
      disable: true,
      component: 'Input',
      componentProps: {
        disabled: true
      }
    } as IForm.Schema<'Input'>,
    {
      label: '折扣金额',
      required: true,
      field: 'discountAmount',
      component: 'InputNumber',
      componentProps: {
        min: 0.01,
      }
    } as IForm.Schema<'InputNumber'>
  ]
})
</script>