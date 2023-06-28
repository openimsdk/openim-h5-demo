<template>
  <div class="px-6 py-3 text-xs text-[#999] text-center line-clamp-2">
    {{ messageContent }}
  </div>
</template>

<script setup lang='ts'>
import { tipMessaggeFormat } from '@/utils/imCommon';
import { MessageItem } from 'open-im-sdk-wasm/lib/types/entity';

type MessageItemProps = {
  source: MessageItem;
}

const props = defineProps<MessageItemProps>();

const messageContent = tipMessaggeFormat(props.source)

</script>

<style lang='scss' scoped></style>