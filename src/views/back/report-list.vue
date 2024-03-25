<style lang='less' scoped>
</style>

<template>
  <grid-table
    v-bind="gridAttrs"
    ref="gridRef"
  />
</template>
<script lang='ts' setup>import { backApi } from '@/api/back'
import { useAppStore } from '@/store'

const { getReferenceItems, getReferenceConstantMap } = useAppStore()

const gridAttrs = ref<IGridTable.Props>({
  title: '背调报告列表',
  api: {
    getList: backApi.reportAsZipList
  },
  // searchSchemas: [
  //   {
  //     label: '名称',
  //     field: 'name',
  //     component: 'Input',

  //   } as IForm.Schema<'Input'>,
  //   {
  //     label: '导出状态',
  //     field: 'exportStatus',
  //     component: 'ReferenceSelect',
  //     componentProps: {
  //       referenceKey: 'backSystemPdfExportStatusEnum'
  //     }
  //   } as IForm.Schema<'ReferenceSelect'>,
  // ],

  columnSchemas: [
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '导出数',
      dataIndex: 'exportCount'
    },
    {
      title: '导出状态',
      dataIndex: 'exportStatus',
      enumSchemas: getReferenceItems('backSystemPdfExportStatusEnum')
    },
    {
      title: '导出备注',
      dataIndex: 'exportRemark'
    },
    {
      title: '导出人',
      dataIndex: 'createAdmin.name'
    },
  ],
  rowActions: [
    {
      label: '下载报告',
      click: record => {
        window.open(record.fileUrl, '_self')
      },
      isShow: record => getReferenceConstantMap('backSystemPdfExportStatusEnum').DERIVED.value === record.exportStatus
    }
  ]
})
const gridRef = ref<IGridTable.Expose>()

</script>