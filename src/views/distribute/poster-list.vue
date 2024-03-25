<template>
  <div>
    <grid-table v-bind="bindGridTableAttr" ref="tableRef" />
    <basic-modal v-bind="bindModalAttrs" v-model:visible="visible">
      <basic-form v-bind="bindModalFormAttrs" ref="modalBasicFormRef" />
    </basic-modal>
  </div>
</template>
<script lang="ts" setup>
import { distributeApi } from '@/api/distribute'
import { useAppStore } from '@/store'
import { BasicModalProps } from '@/components/modal/prop'
import { useMessage } from '@/hooks/message'
const { getReferenceItems } = useAppStore()
const recordId = ref<number>()
const isLook = ref<boolean>()
const visible = ref<boolean>(false)
const tableRef = ref<IGridTable.Expose>()
const modalBasicFormRef = ref<IForm.Expose>()
const bindGridTableAttr = ref<IGridTable.Props>({
  title: '海报列表',
  api: {
    getList: distributeApi.getPosterList,
  },
  columnSchemas: [
    {
      title: '活动名称',
      dataIndex: 'distributeActives.name'
    },
    {
      title: '海报名称',
      dataIndex: 'name'
    },
    {
      title: '海报图片',
      dataIndex: 'fileUrl',
      thumbAble: true,
    },
    {
      title: '海报用途',
      dataIndex: 'purpose',
      enumSchemas: getReferenceItems('purposeEnum')
    },
    {
      title: '状态',
      dataIndex: 'isAvailable',
      enumSchemas: getReferenceItems('enableEnum')
    },
    {
      title: '海报有效时间',
      dataIndex: 'endAt'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt'
    }
  ],
  tableActions: [
    {
      label: '新建海报',
      type: 'primary',
      click: () => {
        visible.value = true
      }
    }
  ],
  rowActions: [
    {
      label: '查看',
      click: async record => {
        // let posterDetail = await distributeApi.getPosterDetail(record.id)
        isLook.value = true
        console.log(record)
        recordId.value = record.id
        visible.value = true
        await nextTick(() => {
          insertInfo(record)
        })
      }
    },
    {
      label: '编辑',
      click: record => {
        // let posterDetail = await distributeApi.getPosterDetail(record.id)
        console.log(record)
        recordId.value = record.id
        isLook.value = false
        visible.value = true
        nextTick(() => {
          insertInfo(record)
        })
      }
    },
  ],
  searchSchemas: [
    {
      label: '模板名称',
      field: 'name',
      component: 'Input'
    } as IForm.Schema<'Input'>,
    {
      label: '创建时间',
      field: 'createdAt',
      component: 'DateRangePicker',
      componentProps: {
        valueFormat: 'YYYY-MM-DD'
      }
    } as IForm.Schema<'DateRangePicker'>,
    {
      label: '模板用途',
      field: 'purpose',
      component: 'ReferenceSelect',
      componentProps: {
        referenceKey: 'purposeEnum'
      }
    } as IForm.Schema<'ReferenceSelect'>,
    {
      label: '活动状态',
      field: 'isAvailable',
      component: 'ReferenceSelect',
      componentProps: {
        referenceKey: 'enableEnum'
      }
    } as IForm.Schema<'ReferenceSelect'>,
  ]
})
const bindModalFormAttrs = computed((): IForm.Props => ({
  layout: 'vertical',
  baseItemCol: { span: 24 },
  actionable: false,
  isReadOnly: unref(isLook),
  schemas: [
    {
      label: '活动名称',
      field: 'distributeActivityId',
      required: true,
      component: 'ActivityApiSelect',
      componentProps: {
        apiParams: { isAvailable: 1 }
      }
    } as IForm.Schema<'ActivityApiSelect'>,
    {
      label: '海报名称',
      field: 'name',
      required: true,
    } as IForm.Schema<'Input'>,
    {
      label: '海报用途',
      field: 'purpose',
      required: true,
      component: 'ReferenceSelect',
      componentProps: {
        referenceKey: 'purposeEnum'
      }
    } as IForm.Schema<'ReferenceSelect'>,
    {
      label: '使用时间',
      field: 'time',
      component: 'DateRangePicker',
      required: true,
      componentProps: {
        valueFormat: 'YYYY-MM-DD'
      }
    } as IForm.Schema<'DateRangePicker'>,
    {
      label: '活动模板海报图片',
      field: 'fileUrl',
      component: 'Upload',
      required: true,
      componentProps: {
        acceptType: 'img',
        multiple: false,
        maxNum: 1,
        maxSize: 2,
        remindInfo: '建议尺寸：750*1334，限2MB，jpg、png格式'
      }
    } as IForm.Schema<'Upload'>,
    {
      label: '状态',
      field: 'isAvailable',
      component: 'RadioGroup',
      span: 12,
      defaultValue: 1,
      required: true,
      componentProps: {
        options: getReferenceItems('enableEnum')
      }
    } as IForm.Schema<'RadioGroup'>,
  ]
}))
const bindModalAttrs = computed((): BasicModalProps => ({
  title: recordId.value ? `${(isLook.value ? '查看海报' : '编辑海报')}` : '新建海报',
  // title: recordId.value &&
  width: 500,
  okText: '确定',
  destroyOnClose: true,
  onOk: async () => {
    await modalBasicFormRef.value?.validate()
    visible.value = false
    isLook.value = false
    if (recordId.value) {
      await distributeApi.updatePoster({
        ...modalBasicFormRef.value?.formModel,
        fileUrl: modalBasicFormRef.value?.formModel.fileUrl[0],
        startAt: modalBasicFormRef.value?.formModel.time[0],
        endAt: modalBasicFormRef.value?.formModel.time[1],
      }, recordId.value)
    } else {
      await distributeApi.addPoster({
        ...modalBasicFormRef.value?.formModel,
        fileUrl: modalBasicFormRef.value?.formModel?.fileUrl[0],
        startAt: modalBasicFormRef.value?.formModel?.time[0],
        endAt: modalBasicFormRef.value?.formModel?.time[1],
      })
    }
    nextTick(() => {
      tableRef.value?.reload()
    })
    useMessage.success(recordId.value ? '编辑成功' : '新建成功')
  },
  onCancel: () => {
    visible.value = false
    isLook.value = false
    recordId.value = undefined
  }
}))
// 回显内容
const insertInfo = record => {
  modalBasicFormRef.value?.setFormModel({
    ...record,
    time: [record?.startAt, record?.endAt],
    fileUrl: [record.fileUrl]
  })
  // 打开编辑查看，回显图片
  modalBasicFormRef.value?.updateSchema([
    {
      field: 'fileUrl',
      defaultValue: [record.fileUrl]
    }
  ])
}
</script>