<style lang='less' scoped>
</style>

<template>
  <div>
    <grid-table v-bind="gridTableProps" />
  </div>
</template>
<script lang='tsx' setup>
import { intendedCustomerApi } from '@/api/intended-customer'
import { useAppStore } from '@/store'
import { ref } from 'vue'
const { getReferenceItems } = useAppStore()

const gridTableProps = ref<IGridTable.Props>({
  title: '意向客户跟进状态',
  editable: true,
  api: {
    getList: intendedCustomerApi.getCustomerList,
    update: intendedCustomerApi.updateStatus
  },

  columnSchemas: [
    {
      title: '姓名',
      dataIndex: 'name'
    },
    {
      title: '手机号',
      dataIndex: 'mobile'
    },
    {
      title: '所属企业',
      dataIndex: 'companyName'
    },
    {
      title: '跟进状态',
      dataIndex: 'followStatus',
      enumSchemas: getReferenceItems('intendedCustomerFollowStatusEnum'),
    },
    {
      title: '联系人',
      dataIndex: 'contactAdmin.name'
    },

  ],
  formSchemas: [
    {
      label: '跟进状态',
      field: 'followStatus',
      component: 'ReferenceSelect',
      componentProps: {
        referenceKey: 'intendedCustomerFollowStatusEnum'
      }
    } as IForm.Schema<'ReferenceSelect'>
  ],
  searchSchemas: [
{
  label: '姓名',
  field: 'name',
  component: 'Input'
} as IForm.Schema<'Input'>,
{
  label: '手机号',
  field: 'mobile',
  component: 'Input'
} as IForm.Schema<'Input'>,
{
  label: '跟进状态',
  field: 'followStatus',
  component: 'ReferenceSelect',
  componentProps: {
    referenceKey: 'intendedCustomerFollowStatusEnum'
  }
} as IForm.Schema<'ReferenceSelect'>,
{
  label: '所属企业',
  field: 'companyName',
  component: 'Input',

} as IForm.Schema<'Input'>,
    // {
    //   label: '联系人',
    //   field: 'contactAdminId',
    //   component: 'CustomApiSelect',
    //   componentProps: {
    //     api: intendedCustomerApi.getCustomerList,
    //     immediate: true,
    //     valueField: 'contactAdminId',
    //     labelField: 'contactAdmin.name'
    //   }
    // } as IForm.Schema<'CustomApiSelect'>,
  ]

})
</script>