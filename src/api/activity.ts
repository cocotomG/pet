

import { request } from '@/utils/request'

// 充值活动
const rechargeActivityApi = {

  /** 【】获取充值活动列表 */
  getRechargeActivityList: params => request.get('activity/recharge_activities/index', params),

  /** 【】获取充值活动详情 */
  getRechargeActivityDetail: params => request.get('activity/recharge_activities/show', params),

  /** 【】新增充值活动 */
  addRechargeActivity: params => request.post('activity/recharge_activities/store', params),

  /** 【】删除充值活动 */
  deleteRechargeActivity: params => request.delete('activity/recharge_activities/store', params),

  /** 【】更新充值活动 */
  updateRechargeActivity: (params: Recordable<any>) => request.put('aactivity/recharge_activities/store', params),

}

export { rechargeActivityApi }


