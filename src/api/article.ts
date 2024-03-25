

import { request } from '@/utils/request'

// 充值活动
const articleApi = {

  /** 【】获取充值活动列表 */
  getArticleList: params => request.get('article/article/index', params),

  addArticle: params => request.post('article/article/store', params),

  updateArticle: (id, params) => request.post('article/article/store', {
    id,
    ...params
  }),

  deleteArticle: id => request.post(`article/article/destroy/${id}`),

}

export { articleApi }


