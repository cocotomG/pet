

import { request } from '@/utils/request'

// 钱包
const paymentApi = {

  /** 【】获取钱包列表 */
  getRechargeList: params => request.get('wallet/wallets/index', params),

  /** 【】钱包充值 */
  addRecharge: params => request.post('wallet/wallets/recharge', params),

  /** 【】钱包流水 */
  getRechargeLog: params => request.get('wallet/walletMoneyLogs/index', params),

}

export { paymentApi }


