<template>
  <div
    class="px-6 py-3 text-center text-xs text-[#999] line-clamp-2"
    v-html="messageContent"
  ></div>
</template>

<script setup lang="ts">
import { tipMessaggeFormat } from '@/utils/imCommon'
import type { MessageItem } from '@openim/wasm-client-sdk/lib/types/entity'

type MessageItemProps = {
  source: MessageItem
}

const props = defineProps<MessageItemProps>()

const messageContent = computed(() => tipMessaggeFormat(props.source))

</script>

<style lang="scss" scoped></style>
