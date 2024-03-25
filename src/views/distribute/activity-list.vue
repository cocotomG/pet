<template>
  <div>
    <grid-table
      v-bind="bindGridTableAttr"
      ref="tableRef"
    />

    <basic-modal
      v-bind="bindModalAttrs"
      v-model:visible="visible"
    >
      <basic-form
        v-bind="bindModalFormAttrs"
        ref="modalBasicFormRef"
      />
    </basic-modal>
  </div>
</template>
<script lang="tsx" setup>
import { distributeApi } from '@/api/distribute'
import { useAppStore } from '@/store'
import { useMessage } from '@/hooks/message'
import { BasicModalProps } from '@/components/modal/prop'
import dayjs from 'dayjs'
import moment from 'moment'
const { getReferenceItems } = useAppStore()
const visible = ref(false)
const isLook = ref(false)
const recordId = ref<number | undefined>()
const tableRef = ref<IGridTable.Expose>()
const modalBasicFormRef = ref<IForm.Expose>()
const bindModalAttrs = computed((): BasicModalProps => ({
  title: recordId.value ? `${(isLook.value ? '查看活动' : '编辑活动')}` : '新建活动',
  width: 500,
  okText: '确定',
  destroyOnClose: true,
  onOk: async () => {
    await modalBasicFormRef.value?.validate()
    isLook.value = false
    visible.value = false
    if (recordId.value) {
      await distributeApi.updateActivity(Object.assign({ ...modalBasicFormRef.value?.formModel }, {
        startAt: modalBasicFormRef.value?.formModel?.time[0],
        endAt: modalBasicFormRef.value?.formModel?.time[1],
      }), recordId.value)
    } else {
      await distributeApi.addActivity(Object.assign({ ...modalBasicFormRef.value?.formModel }, {
        startAt: modalBasicFormRef.value?.formModel?.time[0],
        endAt: modalBasicFormRef.value?.formModel?.time[1],
      }))
    }
    nextTick(() => {
      tableRef.value?.reload()
    })
    useMessage.success(recordId.value ? '编辑成功' : '新建成功')
  },
  onCancel: () => {
    isLook.value = false
    visible.value = false
    recordId.value = undefined
  }
}))
const bindModalFormAttrs = computed((): IForm.Props => ({
  layout: 'vertical',
  baseItemCol: { span: 24 },
  actionable: false,
  isReadOnly: unref(isLook),
  schemas: [
    {
      label: '活动名称',
      field: 'name',
      required: true,
      component: 'Input',
      componentProps: {
        maxlength: 30
      }
    } as IForm.Schema<'Input'>,
    {
      label: '活动时间',
      field: 'time',
      component: 'DateRangePicker',
      required: true,
      componentProps: {
        showTime: {
          defaultValue: [moment('00:00:00', 'HH:mm:ss')]
        },
        // showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        disabledDate: current =>
          // current && current < dayjs().endOf('day'), 当前日期不可选
          current && current < moment().add(-1, 'd') // 当前日期可选
      }
    } as IForm.Schema<'DateRangePicker'>,
    {
      label: '活动用途',
      field: 'purpose',
      component: 'ReferenceSelect',
      required: true,
      componentProps: {
        referenceKey: 'purposeEnum'
      }
    } as IForm.Schema<'ReferenceSelect'>,
    {
      label: '好友每成交1单，提成',
      field: 'commissionRate',
      required: true,
      component: 'InputNumber',
      componentProps: {
        addonAfter: '%',
        precision: 2,
        max: 100,
        min: 0
      }
    } as IForm.Schema<'InputNumber'>,
    {
      label: '每天奖励上限',
      // label: '每人每天奖励上限',
      field: 'dailyRewardUpperLimit',
      required: true,
      component: 'Input',
      componentProps: {
        addonAfter: '单'
      }
    } as IForm.Schema<'Input'>,
    {
      label: '活动备注',
      field: 'remark',
      component: 'InputTextArea',
    } as IForm.Schema<'InputTextArea'>,
    {
      label: '规则内容',
      field: 'ruleContent',
      required: true,
      component: 'Input',
      componentProps: {
        maxlength: 100
      }
    } as IForm.Schema<'Input'>,
    {
      label: '状态',
      field: 'isAvailable',
      component: 'RadioGroup',
      span: 12,
      defaultValue: 1,
      componentProps: {
        options: getReferenceItems('enableEnum'),
      }
    } as IForm.Schema<'RadioGroup'>,
  ]
}))
const bindGridTableAttr = ref<IGridTable.Props>({
  title: '活动列表',
  api: {
    getList: distributeApi.getActivityList,
  },
  columnSchemas: [
    {
      title: '活动名称',
      dataIndex: 'name'
    },
    {
      title: '活动备注',
      dataIndex: 'remark'
    },
    {
      title: '活动用途',
      dataIndex: 'purpose',
      enumSchemas: getReferenceItems('purposeEnum')
    },
    {
      title: '状态',
      dataIndex: 'isAvailable',
      enumSchemas: getReferenceItems('enableEnum')
    },
    {
      title: '活动有效时间',
      dataIndex: 'endAt'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt'
    }
  ],
  rowActions: [
    {
      label: '查看',
      click: async record => {
        isLook.value = true
        recordId.value = record.id
        console.log(record)
        visible.value = true
        let activityDetail = await distributeApi.getActivityDetail(record?.id)
        nextTick(() => {
          modalBasicFormRef.value?.setFormModel({
            ...activityDetail,
            time: [activityDetail.startAt, activityDetail.endAt]
          })
        })
      }
    },
    {
      label: '编辑',
      click: async record => {
        recordId.value = record.id
        visible.value = true
        console.log(record)
        let activityDetail = await distributeApi.getActivityDetail(record?.id)
        nextTick(() => {
          modalBasicFormRef.value?.setFormModel({
            // ...activityDetail,
            ...activityDetail,
            time: [activityDetail.startAt, activityDetail.endAt]
          })
        })
      },
    }
  ],
  tableActions: [
    {
      label: '新建活动',
      type: 'primary',
      click: () => {
        visible.value = true
      }
    },
  ],
  searchSchemas: [
    {
      label: '活动名称',
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
</script>