<template>
  <grid-table v-bind="tableAttrs" />
</template>

<script setup lang="tsx">
import { contractApi } from '@/api/contract'
// import { router } from '@/router'
import { useMessage } from '@/hooks/message'
import { useAppStore } from '@/store'
import { previewFromUrl } from '@/utils/file'
const { getReferenceItems, getReferenceConstantMap } = useAppStore()
const contractStatus = getReferenceConstantMap('contractSignStatusEnum')
const tableAttrs = computed((): IGridTable.Props => ({
  title: '合同',
  api: {
    getList: contractApi.getContractSigners,
  },
  columnSchemas: [
    {
      title: '合同编号',
      dataIndex: 'contract.sn'
    },
    {
      title: '合同名称',
      dataIndex: 'contract.name'
    },
    {
      title: '合同类型',
      dataIndex: 'template.type',
      enumSchemas: getReferenceItems('contractTemplateTypeEnum')
    },
    {
      title: '甲方',
      dataIndex: 'template.contractCompany.name'
    },
    {
      title: '甲方法人',
      dataIndex: 'template.contractCompany.legalName'
    },
    {
      title: '乙方',
      dataIndex: 'company.name'
    },
    {
      title: '乙方法人',
      dataIndex: 'company.legalName'
    },
    {
      title: '发起时间',
      dataIndex: 'createdAt'
    },
    {
      title: '合同状态',
      dataIndex: 'signStatus',
      enumSchemas: getReferenceItems('contractSignStatusEnum')
    },
    {
      title: '创建日期',
      dataIndex: 'createdAt'
    }
  ],
  searchSchemas: [
    {
      label: '合同模板名称',
      field: 'name',
      component: 'Input'
    } as IForm.Schema<'Input'>,
    {
      label: '合同类型',
      field: 'type',
      component: 'ReferenceSelect',
      componentProps: {
        referenceKey: 'contractTemplateTypeEnum'
      }
    } as IForm.Schema<'ReferenceSelect'>,
  ],
  rowActions: [
    {
      label: '催签',
      isShow: record => record.signStatus === contractStatus.SIGNING.value,
      click: async record => {
        await contractApi.remindContract({ id: record.id })
        useMessage.success('催签成功')
      }
    },
    {
      label: '预览',
      click: record => {
        previewFromUrl(record.filePath)
      },
      isShow: record => record.filePath && record.signStatus === contractStatus.SIGNED.value
    },
  ],
}))
</script>
