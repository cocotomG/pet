<style lang='less' scoped>
</style>

<template>
  <grid-table
    v-bind="gridAttrs"
    ref="gridRef"
  />
</template>
<script lang='ts' setup>import { backApi } from '@/api/back'
import { companyApi } from '@/api/company'
import { useAppStore } from '@/store'
import { exportExcelDetail, TextKeyMap } from '@/utils/xlsx'
const gridRef = ref<IGridTable.Expose>()
const { getReferenceItems, getReferenceItemsValueMap, getReferenceConstantMap } = useAppStore()
const gridAttrs = ref<IGridTable.Props>({
  title: '下单记录',
  api: {
    getList: backApi.getBackList,
  },
  columnSchemas: [
    {
      title: '客户名称',
      dataIndex: 'company.name'
    },
    {
      title: '背调方案',
      dataIndex: 'goodName'
    },
    {
      title: '姓名',
      dataIndex: 'realname'
    },
    {
      title: '手机号',
      dataIndex: 'mobile'
    },
    {
      title: '提交时间',
      dataIndex: 'authDate'
    },
    {
      title: '订单状态',
      dataIndex: 'backStatus',
      enumSchemas: getReferenceItems('backSystemStatusEnum'),

    },
    {
      title: '风险等级',
      dataIndex: 'level',
      enumSchemas: getReferenceItems('backSystemLevelEnum'),
    },
  ],
  searchSchemas: [
{
  label: '客户名称',
  field: 'companyId',
  component: 'CustomApiSelect',
  componentProps: {
    api: () => companyApi.getCompanyList({ auditStatuses: [1] }),
    valueField: 'id',
    labelField: 'name'
  }
} as IForm.Schema<'CustomApiSelect'>,
{
  label: '背调方案',
  field: 'goodId',
  component: 'CommonApiSelect',
  componentProps: {
    commonApiSelectType: 'goods',
  }
} as IForm.Schema<'CommonApiSelect'>,
{
  label: '姓名',
  field: 'realname',
  component: 'Input',
} as IForm.Schema<'Input'>,
{
  label: '手机号',
  field: 'mobile',
  component: 'Input',
} as IForm.Schema<'Input'>,
{
  label: '提交时间',
  field: 'orderedAt',
  component: 'DateRangePicker',
  componentProps: {
    valueFormat: 'YYYY-MM-DD'
  }
} as IForm.Schema<'DateRangePicker'>,
{
  label: '订单状态',
  field: 'backStatus',
  component: 'ReferenceSelect',
  componentProps: {
    referenceKey: 'backSystemStatusEnum'
  }
} as IForm.Schema<'ReferenceSelect'>,
{
  label: '风险等级',
  field: 'level',
  component: 'ReferenceSelect',
  componentProps: {
    referenceKey: 'backSystemLevelEnum'
  }
} as IForm.Schema<'ReferenceSelect'>,
  ],
  rowActions: [
    {
      label: '查看报告',
      isShow: record => record.backStatus === getReferenceConstantMap('backSystemStatusEnum').DONE.value,
      click: record => {
        window.open(record.filePath)
      }
    }
  ],
  tableActions: [
    {
      label: '导出列表',
      type: 'primary',
      click: async () => {
        const exportList = await backApi.getBackList(Object.assign({ pageSize: 5000 }, gridRef.value?.getSearchParams()))
        const textKeyMaps: TextKeyMap[] = [
          { 客户名称: 'companyName' },
          { 背调方案: 'backWay' },
          { 姓名: 'realname' },
          { 手机号: 'mobile' },
          { 身份证号: 'idcard' },
          { 提交时间: 'authDate' },
          { 订单状态: 'backStatus' },
          { 风险等级: 'level' },
        ]
        const dataList = exportList.map(v => ({
          companyName: v.company?.name,
          backWay: v.goodName,
          realname: v.realname,
          mobile: v.mobile,
          idcard: v.idcard,
          authDate: v.authDate,
          backStatus: getReferenceItemsValueMap('backSystemStatusEnum')[v.backStatus]?.label,
          level: getReferenceItemsValueMap('backSystemLevelEnum')[v.level]?.label,
        }))
        await exportExcelDetail(
          textKeyMaps,
          dataList,
          '下单列表导出表'
        )
      }
    }, {
      label: '导出报告',
      type: 'primary',
      click: async () => {
        await backApi.exportReport(gridRef.value?.getSearchParams())
      }
    }
  ]
})

</script>