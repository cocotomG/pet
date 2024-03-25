<!-- 页面 -->
<template>
  <div>
    <Upload
      :value="value"
      button-type="primary"
      :ghost="true"
      :accept="['doc', 'docx', 'pdf']"
      @update:value="emits('update:value', $event)"
    />
    <div class="leading-8 text-primaryColor-default">
      支持格式：DOC、DOCX、PDF；大小限制：不能超过2M
    </div>
  </div>
</template>

<script lang="ts" setup>
import Upload from '@/components/form/components/business-components/upload/upload.vue'

/* data 数据 */
const emits = defineEmits(['update:value'])
defineProps({
  value: {
    type: [Array, String],
    default: () => []
  }
})
</script>