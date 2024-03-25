<template>
  <grid-table v-bind="bindTableAttr" />
</template>
<script lang="tsx" setup>
import { companyApi } from '@/api/company'
import globalModelForm from '@/hooks/global-model-form'
import { useAppStore } from '@/store'
import { PropType } from 'vue'
const props = defineProps({
  status: Array as PropType<number[]>,
  default: []
})
const { getReferenceItems, getReferenceConstantMap } = useAppStore()
const bindTableAttr = computed(() => ({
  title: '客户',
  api: {
    getList: companyApi.getCompanyList,
    store: companyApi.addCompany,
    update: companyApi.updateCompany,
  },
  getListApiParams: {
    auditStatuses: props.status
  },
  editable: true,
  // creatable: true,
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
      title: '申请人手机号',
      dataIndex: 'applyUser.mobile'
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
    },
    {
      title: '审核备注',
      dataIndex: 'auditRemark',
    }
  ],
  formSchemas: [
    {
      label: '客户名称',
      field: 'name',
    },
    {
      label: '营业执照编号',
      field: 'businessLicense',
    },
    {
      label: '企业开户银行',
      field: 'bankName',
    },
    {
      label: '企业对公银行账号',
      field: 'bankAccount',
    },
    {
      label: '法人姓名',
      field: 'legalName',
    },
    {
      label: '法人手机号',
      field: 'legalMobile',
    },
    {
      label: '企业地址',
      field: 'address',
    },
  ],
  searchSchemas: [
    {
      label: '企业名称',
      field: 'name'
    },
    {
      label: '营业执照编号',
      field: 'businessLicense'
    }
  ],
  rowActions: [
    {
      label: '创建账户',
      isShow: record => props.status?.join() === '1' && record.canCreatePaymentAccount === 1,
      click: async v => {
        await companyApi.creatAccount({ id: v.id })
      }
    },
    {
      label: '通过',
      isShow: v => v.auditStatus == getReferenceConstantMap('auditStatusEnum').WAIT.value || v.auditStatus == getReferenceConstantMap('auditStatusEnum').REJECT.value,
      needReload: true,
      click: v => new Promise(resolve => {
        console.log(v)
        globalModelForm.init({
          title: '通过',
          schemas: [
            {
              label: '备注',
              field: 'auditRemark',
              component: 'InputTextArea',
            } as IForm.Schema<'InputTextArea'>,
          ],
          successCallback: async s => {
            await companyApi.pass({
              id: v.id,
              ...s
            })
            resolve('')
          }
        })
      })
    },
    {
      label: '拒绝',
      isShow: v => v.auditStatus === getReferenceConstantMap('auditStatusEnum').WAIT.value,
      needReload: true,
      click: v => new Promise(resolve => {
        globalModelForm.init({
          title: '拒绝',
          schemas: [
            {
              label: '拒绝备注',
              field: 'auditRemark',
              component: 'InputTextArea',
              required: true
            } as IForm.Schema<'InputTextArea'>,
          ],
          successCallback: async s => {
            await companyApi.reject({
              id: v.id,
              ...s
            })
            resolve('')
          }
        })
      })
    }
  ]
}))
</script>