<template>
  <div class="flex pl-4 pr-1">
    <Avatar
      class="mt-4"
      :src="source.senderFaceUrl"
      :desc="source.senderNickname"
      :size="42"
    />
    <div
      class="content_item mx-3 h-full w-full flex-1 overflow-hidden border-b border-[#DFDFDF] py-4"
      :class="{ '!border-0': noBorder }"
    >
      <div class="flex justify-between">
        <div class="flex-1 truncate break-all text-xs text-[#666]">
          {{ source.senderNickname }}
        </div>
        <div class="text-xs text-[#999]">{{ messageTime }}</div>
      </div>
      <div v-if="isMedia" class="mt-1 flex overflow-hidden">
        <MediaMessageRenderer :message="message" :disabled="false" />
      </div>
      <div v-else class="mt-1 break-all text-sm text-[#333]">
        {{ messageContent }}
      </div>
      <QuoteMessageRenderer
        v-if="source.contentType === MessageType.QuoteMessage"
        :message="data"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExMessageItem } from '@/store/modules/message'
import Avatar from '@/components/Avatar/index.vue'
import { formatMessageByType } from '@/utils/imCommon'
import QuoteMessageRenderer from '../chat/components/MessageItem/QuoteMessageRenderer.vue'
import { MessageType } from '@openim/wasm-client-sdk'
import dayjs from 'dayjs'
import MediaMessageRenderer from '@/pages/conversation/chat/components/MessageItem/MediaMessageRenderer.vue'

type NomalMessageItemProps = {
  source: ExMessageItem
  noBorder: boolean
}
const emit = defineEmits([])
const props = defineProps<NomalMessageItemProps>()

const messageContent = formatMessageByType(props.source)
const messageTime = dayjs(props.source.sendTime).format('M/D HH:mm')
const message = computed(() => ({
  ...props.source,
  disabled: false,
  checked: false,
  jump: false,
}))
const isMedia = computed(
  () =>
    props.source.contentType === MessageType.PictureMessage ||
    props.source.contentType === MessageType.VideoMessage,
)

const data = computed(() => ({
  ...props.source,
  disabled: false,
  checked: false,
  jump: false,
}))
</script>

<style lang="scss" scoped>
.message_quote_wrap {
  display: flex;
  justify-content: flex-start;
}
</style>
