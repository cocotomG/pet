import { request } from '@/utils/request'

// 后台管理系统账号
const adminApi = {

  /** 【】获取账号列表 */
  getAdmins: params => request.get('/admin_users/index', params),

  /** 【】 编辑 新增账号 */
  addAdmin: params => request.post('/admin_users/store', params),

  /** 【】更新账号 */
  updateAdmin: (id, params) => request.post(`/admin_users/update/${id}`, params),
}
// 角色管理
const roleApi = {

  /* 获取角色列表 */
  getRoleList: params => request.get('admin_role/index', params),

  /*  添加角色 */
  addRole: params => request.post('admin_role/store', params),

  /* 修改角色 */

  updateRole: (id, params) => {
    params.id = id
    return request.post('admin_role/store', params)
  },

  /* 删除角色 */

  deleteRole: id => request.post('admin_role/delete', { id })

}


// 字典配置
const dictionaryApi = {

  /* 获取字典列表 */
  getDictionaryList: params => request.get('dictionary_code/index', params),

  /* 新增字典配置 */
  addDictionaryConfig: params => request.post('dictionary_code/store', params),

  /* 修改字典配置 */
  updateDictionary: (id, params) => request.post(`dictionary_code/update/${id}`, params),

  /* 删除字典 */
  deleteDictionary: id => request.get(`dictionary_code/destroy/${id}`)
}

// 帮助中心Article/HelpArticle/list
const helpApi = {

  /* 文章列表 */
  getHelpArticleList: params => request.post('Article/HelpArticle/lists', params),

  /* 添加文章 */
  addHelpArticleList: params => request.post('Article/HelpArticle/store', params),

  /* 修改文章 */
  updataHelpArticleList: (id, params) => request.post(`Article/HelpArticle/update/${id}`, params),

  /* 删除文章 */
  deleteHelpArticleList: id => request.post('Article/HelpArticle/delete', { id }),

  /* 查看文章 */
  showHelpArticleList: (params, id) => request.post(`Article/HelpArticle/show/${id}`, params)
}

/** 【】组织 */
const clientApi = {

  /** 【】获取组织列表 */
  getClientList: params => request.get('admin_group/index', params),

  addClient: params => request.post('admin_group/store', params),

  updateClient: (id, params) => request.post('admin_group/store', {
    id,
    ...params
  }),

  /** 【】获取切换组织列表 */
  getClientSelectList: () => request.get('admin_group/temp'),

  /** 【】切换组织列表 */
  changeUserGroup: params => request.post('admin_users/temp_group', params),

}

// 客户端权限管理
const menuApi = {

  // 菜单列表
  getMenuList: () => request.get('site/siteRoutes/userRoutes'),

  // 新增/编辑菜单
  addMenu: params => request.post('site/siteRoutes/store', params),

  // 删除菜单
  removeMenu: id => request.post(`site/siteRoutes/destroy/${id}`),

}


const permissionApi = {

  /** 【】获取权限列表 */
  getPermissionList: params => request.get('site/siteMenu/tree', params),

  // 权限配置
  setPermission: params => request.post('site/siteRoutes/power', params)

}


export { adminApi, roleApi, dictionaryApi, helpApi, clientApi, menuApi, permissionApi }


