<template>
  <div class="text_content need_bg" v-html="content"></div>
</template>

<script setup lang="ts">
import { formatLink, parseBr } from '@/utils/imCommon'
import { MessageType } from '@openim/wasm-client-sdk'
import { ExedMessageItem } from './data'

type TextMsgRendererProps = {
  message: ExedMessageItem
}

const props = defineProps<TextMsgRendererProps>()

const content = computed(() => {
  let msgStr = ''
  if (props.message.contentType === MessageType.TextMessage) {
    msgStr = props.message.textElem?.content!
  }
  return parseBr(formatLink(msgStr))
})
</script>

<style lang="scss" scoped>
.text_content {
  word-break: break-all;
  word-wrap: break-word;

  :deep(.emoji_el) {
    padding-right: 2px;
    vertical-align: sub;
    width: 24px;
  }
}
</style>
