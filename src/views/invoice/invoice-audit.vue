<template>
  <div>
    <grid-table
      v-bind="gridProps"
      ref="gridTableEl"
    />
    <div v-if="invoiceDetail">
      <basic-drawer
        v-bind="invoiceDrawerAttr"
        v-model:visible="invoiceDrawerVisible"
      >
        <div>
          <div class="g-title">
            发票信息
          </div>
          <div class="text-base font-semibold">
            共
            <span class="text-red-600">{{ invoiceDetail.recordDetail.orderCount }}
            </span>笔订单，开票金额￥
            <span class="text-red-600">{{ invoiceDetail.recordDetail.invoiceAmount }}</span>
          </div>
          <div class="mt-3">
            <basic-description
              :schemas="invoiceInfoColumnSchemas"
              :model="invoiceDetail.recordDetail"
              :column="2"
            />
          </div>
        </div>
        <div>
          <div class="g-title mt-9">
            订单信息
          </div>
          <grid-table
            v-bind="orderDetailTable"
            ref="invoiceDetailEl"
          />
        </div>
      </basic-drawer>
    </div>
  </div>
</template>
<script lang="tsx" setup>
import { invoiceApi } from '@/api/invoice'
import { useAppStore } from '@/store'
import globalModelForm from '@/hooks/global-model-form'
import { useMessage } from '@/hooks/message'
import { Popover } from 'ant-design-vue/es'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { BasicDrawerProps } from '@/components/drawer/props'
const { getReferenceItems, getReferenceConstantMap } = useAppStore()
const orderInvoiceTypeEnum = getReferenceConstantMap('orderInvoiceTypeEnum')
const gridTableEl = ref<IGridTable.Expose>()
const selectRows = ref()
const idList = ref<any>([]) // 发票id
const invoiceDrawerVisible = ref(false)
const invoiceDetailEl = ref<IGridTable.Expose>()
const invoiceDetail = reactive<any>({
  orders: [],
  recordDetail: []
})
const gridProps = ref<IGridTable.Props>({
  title: '开票申请',
  api: {
    getList: invoiceApi.getInvoiceList
  },
  getCheckboxProps: record => ({
    disabled: record.auditStatus !== orderInvoiceTypeEnum.ORDER_INVOICE_WAITING.value
  }),
  // rowKey: 'goodsId',
  selectable: true,
  columnSchemas: [
    {
      title: '订单编号',
      dataIndex: 'sn',
      customRender: ({ record }) => {
        let snList = record.sn.split(',')
        snList = [...new Set(snList)]
        let slots = {
          title: () => <div class="text-white">订单编号</div>,
          content: () => snList.map(item => <div class="text-white">{item}</div>)
        }
        return (<div>
          {`${snList[0]} `}
          <Popover placement="right" color="#00204a" v-slots={slots} >
            <InfoCircleOutlined class="text-[#00204a]" v-show={snList.length > 1} />
          </Popover>
        </div>)
      }
    },
    {
      title: '下单方',
      dataIndex: 'companies.name'
    },
    {
      title: '开票类型',
      dataIndex: 'invoiceType',
      enumSchemas: getReferenceItems('invoiceStatusEnum')
    },
    {
      title: '发票内容',
      dataIndex: 'invoiceContent',
      enumSchemas: getReferenceItems('invoiceContentEnum')
    },
    {
      title: '发票抬头',
      dataIndex: 'headerName',
    },
    {
      title: '发票形式',
      dataIndex: 'invoiceCatogory',
      enumSchemas: getReferenceItems('invoiceCategoryEnum')
    },
    {
      title: '发票邮箱',
      dataIndex: 'toEmail',
    },
    {
      title: '单位税号',
      dataIndex: 'companyTaxNumber',
    },
    {
      title: '收票人姓名',
      dataIndex: 'receiver',
    },
    {
      title: '收票人手机',
      dataIndex: 'receiverPhone',
    },
    {
      title: '状态',
      dataIndex: 'auditStatus',
      enumSchemas: getReferenceItems('orderInvoiceTypeEnum')
    },
  ],
  rowActions: [
    {
      label: '查看',
      click: async record => {
        invoiceDrawerVisible.value = true
        invoiceDetail.recordDetail = await invoiceApi.invoiceDetail(record.id)
        invoiceDetail.recordDetail.companyInfo = JSON.parse(invoiceDetail.recordDetail?.companyInfo)
        invoiceDetail.orders = invoiceDetail.recordDetail.orders
        nextTick(() => {
          invoiceDetailEl.value?.reload()
        })
      }
    },
    {
      label: '通过',
      needReload: true,
      isShow: record => record.auditStatus === orderInvoiceTypeEnum.ORDER_INVOICE_WAITING.value,
      click: async record => {
        await globalModelForm.init({
          destroyOnClose: true,
          title: '通过申请',
          schemas: [
            {
              label: '上传发票',
              field: 'attachment',
              component: 'Upload',
              required: true,
              componentProps: {
                acceptType: 'img',
                multiple: false,
                maxNum: 1,
                maxSize: 2,
                remindInfo: '图片格式:JPG/JPEG/PNG, 大小不超过2M'
              }
            } as IForm.Schema<'Upload'>,
            {
              label: '备注',
              field: 'remark',
              component: 'InputTextArea',
            } as IForm.Schema<'InputTextArea'>
          ],
          api: async params => {
            await invoiceApi.auditPass({
              id: record.id,
              remark: params.remark,
              attachment: params.attachment[0],
            })
            gridTableEl.value?.reload()
          }
        })
      }
    },
    {
      label: '拒绝',
      needReload: true,
      isShow: record => record.auditStatus === orderInvoiceTypeEnum.ORDER_INVOICE_WAITING.value,
      click: async record => {
        await globalModelForm.init({
          destroyOnClose: true,
          title: '拒绝申请',
          schemas: [
            {
              required: true,
              label: '拒绝原因',
              field: 'remark',
              component: 'InputTextArea',
              componentProps: {
                placeholder: '请不要超过100个字（含标点符号）',
                maxlength: 100,
                showCount: true,
              }
            } as IForm.Schema<'InputTextArea'>,
          ],
          api: async params => {
            await invoiceApi.auditRefuse({
              id: record.id,
              remark: params.remark,
            })
            gridTableEl.value?.reload()
          }
        })
      }
    }
  ],
  searchSchemas: [
    {
      label: '订单编号',
      field: 'sn',
      component: 'Input'
    } as IForm.Schema<'Input'>,
    {
      label: '发票状态',
      field: 'auditStatus',
      component: 'ReferenceSelect',
      componentProps: {
        referenceKey: 'orderInvoiceTypeEnum'
      }
    } as IForm.Schema<'ReferenceSelect'>,
    {
      label: '下单方',
      field: 'companyID',
      component: 'CompanyApiSelect'
    } as IForm.Schema<'CompanyApiSelect'>,
    // {
    //   label: '背调套餐',
    //   field: 'name',
    //   component: 'CommonApiSelect',
    //   componentProps: {
    //     commonApiSelectType: 'goods',
    //     valueField: 'label'
    //   }
    // } as IForm.Schema<'CommonApiSelect'>,
    // {
    //   label: '订单类型',
    //   field: 'type',
    //   component: 'ReferenceSelect',
    //   componentProps: {
    //     referenceKey: 'orderTypeEnum'
    //   }
    // } as IForm.Schema<'ReferenceSelect'>,
  ],
  tableActions: [
    {
      label: '批量操作',
      type: 'primary',
      needReload: true,
      click: async () => {
        selectRows.value = gridTableEl.value?.getSelectionRows()
        if (selectRows.value.length === 0) {
          return useMessage.error('请选择开票订单')
        }
        let isSame = selectRows.value.every(val => val.companyId === selectRows.value[0].companyId)
        if (!isSame) {
          return useMessage.error('请选择同一家公司进行开票')
        }
        selectRows.value.forEach(item => {
          idList.value.push(item.id)
        })
        idList.value = idList.value.toString()
        await globalModelForm.init({
          title: '批量操作',
          destroyOnClose: true,
          schemas: [
            {
              field: 'status',
              label: '发票状态',
              component: 'RadioGroup',
              defaultValue: 1,
              componentProps: ({ actions }) => ({
                options: [
                  {
                    label: '通过',
                    value: 1
                  },
                  {
                    label: '不通过',
                    value: 0
                  }
                ],
                onChange: async status => {
                  if (status.target?.value) {
                    await actions?.insertSchema({
                      label: '上传发票',
                      field: 'attachment',
                      component: 'Upload',
                      required: true,
                      componentProps: {
                        acceptType: 'img',
                        multiple: false,
                        maxNum: 1,
                        maxSize: 2,
                        remindInfo: '图片格式:JPG/JPEG/PNG, 大小不超过2M'
                      }
                    } as IForm.Schema<'Upload'>, 'remark')
                  } else {
                    await actions?.deleteSchema('attachment')
                  }
                }
              })
            } as IForm.Schema<'RadioGroup'>,
            {
              label: '上传发票',
              field: 'attachment',
              component: 'Upload',
              required: true,
              componentProps: {
                acceptType: 'img',
                multiple: false,
                maxNum: 1,
                maxSize: 2,
                remindInfo: '图片格式:JPG/JPEG/PNG, 大小不超过2M'
              }
            } as IForm.Schema<'Upload'>,
            {
              label: '备注',
              field: 'remark',
              // required: true,
              component: 'InputTextArea',
            } as IForm.Schema<'InputTextArea'>
          ],
          onCancel: () => {
            idList.value = []
          },
          successCallback: async params => {
            // 通过
            if (params.status) {
              await invoiceApi.auditPass(Object.assign({}, {
                remark: params.remark,
                attachment: params.attachment[0],
              }, { id: idList.value }))
            // 拒绝
            } else {
              await invoiceApi.auditRefuse(Object.assign({}, {
                remark: params.remark,
              }, { id: idList.value }))
            }
            await gridTableEl.value?.reload()
            idList.value = []
          }
        })
      },
    }
  ]
})
const invoiceInfoColumnSchemas: IGridTable.ColumnProps[] = [
  {
    title: '开票类型',
    dataIndex: 'invoiceType',
    enumSchemas: getReferenceItems('invoiceStatusEnum')
  },
  {
    title: '发票内容',
    dataIndex: 'invoiceContent',
    enumSchemas: getReferenceItems('invoiceContentEnum')
  },
  {
    title: '发票抬头',
    dataIndex: 'headerName',
  },
  {
    title: '发票形式',
    dataIndex: 'invoiceCatogory',
    enumSchemas: getReferenceItems('invoiceCategoryEnum')
  },
  {
    title: '发票邮箱',
    dataIndex: 'toEmail',
  },
  {
    title: '单位税号',
    dataIndex: 'companyTaxNumber',
  },
  {
    title: '注册地址',
    dataIndex: 'companyInfo.address',
  },
  {
    title: '注册电话',
    dataIndex: 'companyInfo.phone',
  },
  {
    title: '开户银行',
    dataIndex: 'companyInfo.bankName',
  },
  {
    title: '银行账号',
    dataIndex: 'companyInfo.bankAccount',
  },
  {
    title: '收票人姓名',
    dataIndex: 'receiver',
  },
  {
    title: '收票人手机',
    dataIndex: 'receiverPhone',
  },
  {
    title: '收票人地址',
    dataIndex: 'receiverAddress',
  },
  {
    title: '发票',
    dataIndex: 'invoiceLogs',
    customRender: ({ record }) => (
      <div class="flex w-15 h-10">
        {record.invoiceLogs[0].attachment.length > 0 ? <a-image src={record.invoiceLogs[0].attachment[0]} /> : '--'}
      </div>)
  }
]

const invoiceDrawerAttr = ref<BasicDrawerProps>({
  title: '发票详情',
  width: 1000
})

const orderDetailTable = computed(():IGridTable.Props => ({
  showTools: false,
  columnSchemas: [
    {
      title: '订单编号',
      dataIndex: 'sn'
    },
    {
      title: '背调套餐',
      dataIndex: 'name'
    },
    {
      title: '订单类型',
      dataIndex: 'type',
      enumSchemas: getReferenceItems('orderTypeEnum')
    },
    {
      title: '下单部门',
      dataIndex: 'team.name'
    },
    {
      title: '下单方',
      dataIndex: 'companies.name'
    },
    {
      title: '背调方式',
      dataIndex: 'backWay',
      enumSchemas: getReferenceItems('orderBackWayEnum')
    },
    {
      title: '订单总金额',
      dataIndex: 'amount'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt'
    },
    {
      title: '创建日期',
      dataIndex: 'createdAt'
    },
  ],
  dataSource: invoiceDetail.orders,
  pagination: false,
}))

</script>