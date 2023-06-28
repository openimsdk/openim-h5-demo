<template>
  <div class="message_quote_wrap">
    <div v-if="!isImageMessage && !isVideoMessage" class="message_quote_text line-clamp-3" v-html="replyContent"></div>
    <div v-else class="message_quote_media" @click="clickMediaItem">
      <van-image class="max-w-[96px]" height="auto" fit="contain" radius="4" :src="replyContent" />
      <img v-if="isVideoMessage" class="play_icon" :src="play_icon" alt="" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import play_icon from '@/assets/images/chating_message_video_play.png'
import { formatEmoji, formatMessageByType, parseBr } from '@/utils/imCommon';
import { MessageType } from 'open-im-sdk-wasm/lib/types/enum';
import { showImagePreview } from 'vant';
import { ExedMessageItem } from './data';
import emitter from "@/utils/events";

type QuoteMessageRendererProps = {
  message: ExedMessageItem;
}
const emit = defineEmits([]);
const props = defineProps<QuoteMessageRendererProps>();

const router = useRouter()

const isAtMessage = props.message.contentType === MessageType.ATTEXTMESSAGE
const messageData = isAtMessage ? props.message.atElem.quoteMessage as unknown as ExedMessageItem : props.message.quoteElem.quoteMessage
const isImageMessage = messageData.contentType === MessageType.PICTUREMESSAGE
const isVideoMessage = messageData.contentType === MessageType.VIDEOMESSAGE

const replyContent = computed(() => {
  if (isVideoMessage) {
    return messageData.videoElem.snapshotUrl
  }
  if (isImageMessage) {
    return messageData.pictureElem.sourcePicture.url
  }
  let content = formatEmoji(parseBr(formatMessageByType(messageData)))
  return `${messageData.senderNickname}: ${content}`;
})

const clickMediaItem = () => {
  if (isVideoMessage) {
    router.push({
      path: 'previewVideo',
      query: {
        url: messageData.videoElem.videoUrl
      }
    })
  } else {
    showImagePreview({
      images: [replyContent.value],
      startPosition: 0,
      closeable: true,
    })
  }
}
</script>

<style lang='scss' scoped>
.message_quote_wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;

  .message_quote_text {
    width: fit-content;
    padding: 3px 8px;
    border-radius: 3px;
    color: #666;
    font-size: 12px;
    background-color: #f0f0f0;
    word-break: break-all;
    word-wrap: break-word;

    :deep(.emoji_el) {
      padding-right: 2px;
      vertical-align: sub;
      width: 24px;
    }
  }

  .message_quote_media {
    position: relative;

    .play_icon {
      width: 24px;
      height: 24px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>