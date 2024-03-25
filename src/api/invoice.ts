import { request } from '@/utils/request'

// 后台管理系统账号
const invoiceApi = {

  // 发票申请列表
  getInvoiceList: params => request.get('invoice/invoices/index', params),

  // 查看发票
  invoiceDetail: id => request.get(`invoice/invoices/getDetailByID?id=${id}`),

  // 发票审批通过
  auditPass: parmas => request.post('invoice/invoices/auditPass', parmas),

  // 发票审批驳回
  auditRefuse: parmas => request.post('invoice/invoices/auditRefuse', parmas),

  // 判断是否同家公司
  checkSameCompany: params => request.get('invoice/invoices/checkSameCompany', params)

}

export {
  invoiceApi
}