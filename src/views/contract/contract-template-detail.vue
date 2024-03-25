<template>
  <div>
    <a-card title="发起合同">
      <div>
        <div class="flex items-center mb-4">
          <div class="m-0 g-title">
            合同信息
          </div>
          <a-button
            type="primary"
            ghost
            size="small"
            class="ml-4"
            @click="handlePreviewFile"
          >
            预览合同内容
          </a-button>
        </div>
        <basic-form
          v-bind="templateDetailAttr"
          ref="templateDetailEl"
        />
        <a-divider />
        <div class="flex items-center justify-between mb-4">
          <div class="m-0 g-title">
            签署方信息
          </div>
          <a-button
            type="primary"
            class="mr-4"
            @click="handleAddUserSign"
          >
            添加签署方
          </a-button>
        </div>
        <grid-table
          v-bind="signObjectAttr"
          ref="signObjectEl"
        />
        <div class="flex justify-end mt-8">
          <a-button
            class="mr-4"
            @click="handleCancelSign"
          >
            取消
          </a-button>
          <a-button
            type="primary"
            class="mr-4"
            @click="handleSubmitSign"
          >
            发起签署
          </a-button>
        </div>
      </div>
    </a-card>
    <basic-modal
      v-bind="signModalAttr"
      v-model:visible="isSignVisible"
    >
      <grid-table
        v-bind="addSignObjectAttr"
        ref="addSignObjectEl"
      />
    </basic-modal>
  </div>
</template>

<script setup lang="tsx">
import { contractApi } from '@/api/contract'
import { BasicModalProps } from '@/components/modal/prop'
import { previewFromUrl } from '@/utils/file'
import { useMessage } from '@/hooks/message'
import { uniqBy, remove } from 'lodash-es'
import { useAppStore } from '@/store'
import { router } from '@/router'
import { companyApi } from '@/api/company'
const { getReferenceItems } = useAppStore()

const route = useRoute()

// 合同模板id
const templateId = route.query.id

// 合同模板详情
const templateDetail = ref()

/** 签署框 添加签署表格 元素 */
const addSignObjectEl = ref<IGridTable.Expose>()

/** 已添加签署表 */
const signObjectEl = ref<IGridTable.Expose>()

// 弹出框
const isSignVisible = ref(false)

/** 已添加签署 */
const signObjectList = ref([])

// 合同模板表单
const templateDetailEl = ref()
const templateDetailAttr = computed((): IForm.Props => ({
  layout: 'horizontal',
  actionable: false,
  schemas: [
    {
      label: '合同文件名称',
      field: 'name',
      span: 12,
      required: true,
      defaultValue: templateDetail.value?.name
    } as IForm.Schema<'Input'>,
    {
      label: '合同类型',
      field: 'type',
      span: 12,
      required: true,
      component: 'ReferenceSelect',
      defaultValue: templateDetail.value?.type,
      componentProps: {
        referenceKey: 'contractTemplateTypeEnum',
        disabled: true,
      },
    } as IForm.Schema<'ReferenceSelect'>,
    {
      label: '签署截止时间',
      field: 'signEndTime',
      required: true,
      span: 12,
      component: 'DatePicker',
      componentProps: {
        valueFormat: 'YYYY-MM-DD',
        disabledDate: dayjs => dayjs.isBefore(new Date(), 'day')
      }
    } as IForm.Schema<'DatePicker'>,
    {
      label: '合同主体',
      field: 'contractCompanyId',
      component: 'CommonApiSelect',
      required: true,
      span: 12,
      defaultValue: templateDetail.value?.contractCompanyId,
      componentProps: {
        commonApiSelectType: 'contractCompany',
        disabled: true,
      }
    } as IForm.Schema<'CommonApiSelect'>,
    {
      label: '备注',
      field: 'remark',
      span: 12,
      component: 'InputTextArea'
    } as IForm.Schema<'InputTextArea'>,
  ]
}))

/** 添加签署 modal弹出窗 */
const signModalAttr = computed((): BasicModalProps => ({
  width: 1100,
  okText: '添加',
  okType: 'primary',
  cancelText: '取消',
  onCancel: () => {
    isSignVisible.value = false
  },
  onOk: () => {
    let result = addSignObjectEl.value?.getSelectionRows()
    if (result?.length === 0) {
      return useMessage.error('请选择签署用户')
    }
    signObjectList.value = uniqBy(unref(signObjectList).concat(result), 'id')
    isSignVisible.value = false
    nextTick(() => {
      signObjectEl.value?.reload()
      signObjectEl.value?.resetSelection()
    })
  }
}))

// 弹出框中的添加签署方
const addSignObjectAttr = computed((): IGridTable.Props => ({
  showTools: false,
  selectable: true,
  scroll: {
    x: 1000,
    y: 400
  },
  getCheckboxProps: record => ({
    disabled: unref(signObjectList).some((item:Recordable) => item.id == record.id),
  }),
  sticky: true,
  api: {
    getList: companyApi.getCompanyList,
  },
  columnSchemas: [
    {
      title: '客户名称',
      dataIndex: 'name',
    },
    {
      title: '营业执照编号',
      dataIndex: 'businessLicense',
    },
    {
      title: '企业开户银行',
      dataIndex: 'bankName',

    },
    {
      title: '企业对公银行账号',
      dataIndex: 'bankAccount',
    },
    // {
    //   title: '营业执照编号',
    //   dataIndex: 'bankAccount',
    // },
    {
      title: '法人姓名',
      dataIndex: 'legalName',
    },
    {
      title: '法人手机号',
      dataIndex: 'legalMobile',
    },
    {
      title: '企业地址',
      dataIndex: 'address',
    },
    {
      title: '认证状态',
      dataIndex: 'auditStatus',
      enumSchemas: getReferenceItems('auditStatusEnum')
    },
    {
      title: '提交时间',
      dataIndex: 'updatedAt',
    },
    {
      title: '审核时间',
      dataIndex: 'createdAt',
    }
  ],
  searchSchemas: [
    {
      label: '客户名称',
      field: 'name'
    },
    {
      label: '营业执照编号',
      field: 'businessLicense'
    }
  ]
}))

// 预览合同
function handlePreviewFile() {
  previewFromUrl(templateDetail.value.filePath)
}

// 添加签署方
function handleAddUserSign() {
  isSignVisible.value = true
  nextTick(() => {
    addSignObjectEl.value?.setSelectedKeys(unref(signObjectList).map(item => item?.id))
    addSignObjectEl.value?.setSelectedRows(unref(signObjectList))
  })
}

// 已添加的签署方
const signObjectAttr = computed((): IGridTable.Props => ({
  showTools: false,
  deleteable: true,
  dataSource: signObjectList.value,
  api: {
    del: async id => {
      await remove(signObjectList.value, (item:Recordable) => item.id == id)
    }
  },
  columnSchemas: [
    {
      title: '客户名称',
      dataIndex: 'name',
    },
    {
      title: '营业执照编号',
      dataIndex: 'businessLicense',
    },
    {
      title: '企业开户银行',
      dataIndex: 'bankName',

    },
    {
      title: '企业对公银行账号',
      dataIndex: 'bankAccount',
    },
    // {
    //   title: '营业执照编号',
    //   dataIndex: 'bankAccount',
    // },
    {
      title: '法人姓名',
      dataIndex: 'legalName',
    },
    {
      title: '法人手机号',
      dataIndex: 'legalMobile',
    },
    {
      title: '企业地址',
      dataIndex: 'address',
    },
    {
      title: '认证状态',
      dataIndex: 'auditStatus',
      enumSchemas: getReferenceItems('auditStatusEnum')
    },
    {
      title: '提交时间',
      dataIndex: 'updatedAt',
    },
    {
      title: '审核时间',
      dataIndex: 'createdAt',
    }
  ]

}))


function handleCancelSign() {
  signObjectList.value = []
  nextTick(() => signObjectEl.value.reload())
}

// 发起签署
async function handleSubmitSign() {
  await templateDetailEl.value?.validate()
  if (unref(signObjectList).length == 0) {
    return useMessage.error('请添加签署方')
  }
  let { name, signEndTime } = templateDetailEl.value.formModel
  let obj = {
    name,
    signEndTime: `${signEndTime} 23:59:59`,
    // ...pick(templateDetailEl.value.formModel, ['name', 'signEndTime']),
    templateId: templateDetail.value.id,
    companyIds: unref(signObjectList).map((item:Recordable) => item.id)
  }
  await contractApi.addContracts(obj)
  useMessage.success('成功')
  router.go(-1)
}

// 获取合同模板基本信息
async function getTemplateDetail() {
  templateDetail.value = await contractApi.getContractTemplateDetail({ id: templateId })
}
getTemplateDetail()
</script>
