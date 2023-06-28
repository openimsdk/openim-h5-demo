<template>
  <div class="text_content need_bg" v-html="content"></div>
</template>

<script setup lang="ts">
import { formatEmoji, parseAt, parseBr } from "@/utils/imCommon";
import { MessageType } from "open-im-sdk-wasm/lib/types/enum";
import { ExedMessageItem } from "./data";

type TextMsgRendererProps = {
  message: ExedMessageItem;
}

const props = defineProps<TextMsgRendererProps>();

const content = computed(() => {
  let msgStr = props.message.content;
  if (props.message.contentType === MessageType.QUOTEMESSAGE) {
    msgStr = props.message.quoteElem.text;
  }
  if (props.message.contentType === MessageType.ATTEXTMESSAGE) {
    msgStr = parseAt(props.message.atElem);
  }
  return formatEmoji(parseBr(msgStr));
});
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
