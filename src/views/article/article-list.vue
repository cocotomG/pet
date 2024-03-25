<template>
  <div>
    <grid-table v-bind="bindGridTableAttr" />
  </div>
</template>
<script lang="tsx" setup>
import { articleApi } from '@/api/article'


const bindGridTableAttr = ref<IGridTable.Props>({
  title: '文章',
  creatable: true,
  editable: true,
  deleteable: true,
  api: {
    getList: articleApi.getArticleList,
    store: articleApi.addArticle,
    update: articleApi.updateArticle,
    del: articleApi.deleteArticle
  },
  columnSchemas: [
    {
      title: '标题',
      dataIndex: 'title'
    },
    {
      title: '描述',
      dataIndex: 'description'
    },
    {
      title: '排序',
      dataIndex: 'orderby'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt'
    }
  ],
  formSchemas: [
    {
      label: '标题',
      field: 'title',
      required: true,
    },
    {
      label: '封面图片',
      field: 'coverUrl',
      component: 'Upload',
      required: true,
      componentProps: {
        acceptType: 'img',
        maxNum: 1,
      }
    } as IForm.Schema<'Upload'>,
    {
      label: '跳转微信公众号链接',
      field: 'jumpUrl',
      required: true,
    },
    {
      label: '排序',
      field: 'orderby',
      required: true,
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入排序（越小越靠前)'
      }
    } as IForm.Schema<'InputNumber'>,
    {
      label: '内容',
      field: 'content',
      component: 'InputTextArea',
      required: true,
    } as IForm.Schema<'InputTextArea'>,
    {
      label: '描述',
      field: 'description',
      component: 'InputTextArea',
    } as IForm.Schema<'InputTextArea'>,
  ]
})
</script>