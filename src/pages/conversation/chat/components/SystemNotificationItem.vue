<template>
  <div class="px-6 py-3 text-center text-xs text-[#999] line-clamp-2" v-html="messageContent"></div>
</template>

<script setup lang="ts">
import useMessageStore from '@/store/modules/message'
import { tipMessaggeFormat } from '@/utils/imCommon'
import { useIntersectionObserver } from '@vueuse/core'
import type { MessageItem } from '@openim/wasm-client-sdk/lib/types/entity'
import { ExedMessageItem } from './MessageItem/data'

type MessageItemProps = {
  source: MessageItem
}

const props = defineProps<MessageItemProps>()

const messageStore = useMessageStore()

const messageContent = computed(() => {
  return tipMessaggeFormat(props.source)
})

const messageContainerRef = ref<HTMLDivElement>()

const getMessageVisible = () => {
  const { stop } = useIntersectionObserver(
    messageContainerRef,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        messageStore.updateOneMessage({
          clientMsgID: props.source.clientMsgID,
          isAppend: false,
        } as ExedMessageItem)
        stop()
      }
    },
  )
}

onMounted(() => {
  getMessageVisible()
})
</script>

<style lang="scss" scoped></style>
