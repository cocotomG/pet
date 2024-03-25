import { useEnv } from './env'
// import logoSrc from '@/assets/logo.png';

export const useSiteConfig = {
  logo: '',
  siteName: useEnv.siteName, // 项目名称
  slogan: '蓝领找工作就找蓝薪，工价高，发薪快！',
  backendPrefix: '/', // 后台路由前缀
  copyright: '欢创集团 ©2022 Created by 技术中心', // 版权文字
  table: {
    rowKey: 'id', // 行标志字段
    defaultColumnWidth: 120, // 默认列宽
    defaultPageSize: 15, // 默认单页显示记录数
    pageSizes: ['10', '50', '100'], // 单页显示记录数
    pageField: 'page', // 列表接口当前页的入参
    pageSizeField: 'pageSize', // 列表接口单页显示记录数的入参
    resListField: 'items', // 响应列表数据的路径
    resTotalField: 'pagination.totalCount', // 响应列表总数数据的路径
    exportMaxNum: 5000, // 导出最大值
  },
}
