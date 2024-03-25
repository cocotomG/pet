<template>
  <grid-table v-bind="tableAttrs" />
</template>
<script lang="ts" setup>
import { contractApi } from '@/api/contract'
import { previewFromUrl } from '@/utils/file'
import ContractTemplateUpload from './component/contract-template-upload.vue'
import { useAppStore } from '@/store'
import { router } from '@/router'
const { getReferenceItems } = useAppStore()
const tableAttrs = ref<IGridTable.Props>({
  title: '合同模板',
  creatable: true,
  api: {
    getList: contractApi.getContractTemplates,
    store: data => {
      data.filePath = data.filePath[0]
      return contractApi.addContractTemplate(data)
    },
  },
  columnSchemas: [
    {
      title: '模板名称',
      dataIndex: 'name'
    },
    {
      title: '合同主体',
      dataIndex: 'contractCompany.name'
    },
    {
      title: '合同类型',
      dataIndex: 'type',
      enumSchemas: getReferenceItems('contractTemplateTypeEnum')
    },
    {
      title: '模板状态',
      dataIndex: 'isEnable',
      enumSchemas: getReferenceItems('enableEnum')
    },
    {
      title: '创建人',
      dataIndex: 'createAdmin.name'
    },
    {
      title: '创建日期',
      dataIndex: 'createdAt'
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
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
  formSchemas: [
    {
      required: true,
      label: '模板文件',
      field: 'filePath',
      customComponent: ContractTemplateUpload,
      rules: [
        {
          required: true,
          message: '请上传模板文件'
        }
      ],
    } as IForm.Schema<'Upload'>,
    {
      required: true,
      label: '合同模板名称',
      field: 'name',
      component: 'Input',
    } as IForm.Schema<'Input'>,
    {
      label: '签约主体',
      field: 'contractCompanyId',
      component: 'CommonApiSelect',
      required: true,
      componentProps: {
        commonApiSelectType: 'contractCompany',
      }
    } as IForm.Schema<'CommonApiSelect'>,
    {
      label: '模板类型',
      field: 'type',
      required: true,
      component: 'ReferenceSelect',
      componentProps: {
        referenceKey: 'contractTemplateTypeEnum'
      }
    } as IForm.Schema<'ReferenceSelect'>,
    {
      label: '备注信息',
      field: 'remark',
      component: 'InputTextArea',
      componentProps: {
        maxlength: 100,
        showCount: true,
      }
    } as IForm.Schema<'InputTextArea'>,
    {
      label: '状态',
      field: 'isEnable',
      component: 'RadioGroup',
      span: 12,
      defaultValue: 1,
      required: true,
      componentProps: {
        options: getReferenceItems('enableEnum')
      }
    } as IForm.Schema<'RadioGroup'>,
  ],
  tableActions: [],
  rowActions: [
    {
      label: '发起合同',
      click: record => router.push({
        name: 'contractTemplateDetail',
        query: { id: record.id }
      })
    },
    {
      label: '预览',
      // click: v => {

      // }
      click: v => {
        previewFromUrl(v.filePath)
      }
    },
    {
      label: '编辑',
      click: async v => {
        const result = await contractApi.updateContractTemplate(v.id)
        window.open(result)
      }
    },
  ],
  rowActionsWidth: 180
})
</script>