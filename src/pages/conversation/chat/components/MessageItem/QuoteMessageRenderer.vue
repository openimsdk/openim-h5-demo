<template>
  <div class="message_quote_wrap">
    <div class="message_quote_text line-clamp-3" @click="jump2Message">
      <span v-html="showContent" class="mr-1.5"></span>
      <span v-if="isCardMessage">{{ messageData.cardElem?.nickname }}</span>
      <div class="message_quote_media" @click="clickMediaItem">
        <img
          v-if="isImageMessage"
          :src="messageData.pictureElem?.snapshotPicture.url"
          class="ml-1.5 max-h-[32px] max-w-[32px] rounded-md"
          alt="img"
        />
        <img
          v-if="isVideoMessage"
          :src="messageData.videoElem?.snapshotUrl"
          class="max-h-[32px] max-w-[32px] rounded-md"
          alt="img"
        />
        <img
          v-if="isFileMessage"
          :src="getFileIcon(message.fileElem?.fileName || '')"
          class="ml-1.5 max-h-[32px] max-w-[32px] rounded-md"
          alt="img"
        />
        <img
          v-if="isLocationMessage"
          :src="location"
          class="ml-1.5 max-h-[32px] max-w-[32px] rounded-md"
          alt="img"
        />
        <img v-if="isVideoMessage" class="play_icon ml-1.5" :src="play_icon" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import play_icon from '@/assets/images/chating_message_video_play.png'
import location from '@/assets/images/messageItem/location.png'
import { formatMessageByType, parseBr } from '@/utils/imCommon'
import { MessageType } from '@openim/wasm-client-sdk'
import { showImagePreview } from 'vant'
import { ExedMessageItem } from './data'
import emitter from '@/utils/events'
import { downloadFile, getFileIcon } from '@/utils/common'

type QuoteMessageRendererProps = {
  message: ExedMessageItem
}

const props = defineProps<QuoteMessageRendererProps>()

const { t } = useI18n()
const router = useRouter()

const isAtMessage = props.message.contentType === MessageType.AtTextMessage
const messageData = isAtMessage
  ? (props.message.atTextElem?.quoteMessage as unknown as ExedMessageItem)
  : (props.message.quoteElem?.quoteMessage as ExedMessageItem)
const isImageMessage = messageData.contentType === MessageType.PictureMessage
const isVideoMessage = messageData.contentType === MessageType.VideoMessage
const isFileMessage = messageData.contentType === MessageType.FileMessage
const isLocationMessage = messageData.contentType === MessageType.LocationMessage
const isCardMessage = messageData.contentType === MessageType.CardMessage

const replyContent = computed(() => {
  if (isVideoMessage || isImageMessage) {
    return ''
  }
  if (
    isAtMessage &&
    props.message.atTextElem?.quoteMessage?.contentType === MessageType.RevokeMessage
  ) {
    return t('messageDesc.quoteRevokeMessage')
  }
  if (
    !isAtMessage &&
    props.message.quoteElem?.quoteMessage?.contentType === MessageType.RevokeMessage
  ) {
    return t('messageDesc.quoteRevokeMessage')
  }
  return parseBr(formatMessageByType(messageData))
})

const showContent = computed(
  () => `${messageData.senderNickname}: ${replyContent.value}`,
)

const clickMediaItem = () => {
  if (isVideoMessage) {
    router.push({
      path: '/previewVideo',
      query: {
        url: messageData.videoElem?.videoUrl,
        poster: messageData.videoElem?.snapshotUrl,
      },
    })
  }
  if (isImageMessage) {
    showImagePreview({
      images: [messageData.pictureElem?.sourcePicture.url as string],
      loop: false,
    })
  }
  if (isFileMessage) {
    downloadFile(
      messageData.fileElem?.sourceUrl as string,
      messageData.fileElem?.fileName as string,
    )
  }
}

const jump2Message = () => {
  emitter.emit(
    'CHAT_MAIN_SCROLL_TO_CLIENTMSGID',
    props.message.quoteElem?.quoteMessage.clientMsgID as string,
  )
}
</script>

<style lang="scss" scoped>
.message_quote_wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;

  .message_quote_text {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6px 10px;
    color: #666;
    font-size: 12px;
    border-radius: 4px;
    background-color: #f4f5f7;

    :deep(.emoji_el) {
      padding-right: 2px;
      vertical-align: sub;
      width: 24px;
    }
  }

  .message_quote_media {
    max-height: 32px;
    position: relative;

    .play_icon {
      width: 12px;
      height: 12px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
