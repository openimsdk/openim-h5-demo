<template>
  <div @click="clickMediaItem" class="media_message_container">
    <van-image class="max-w-[32vw] need_preload_message" :class="{ 'w-8 h-8': isError }" fit="contain" radius="6"
      :src="imageUrl" @error="isError = true">
      <template v-slot:loading>
        <van-loading type="spinner" size="20" />
      </template>
      <template v-slot:error>{{ $t('failLoad') }}</template>
    </van-image>
    <img v-if="isVideo" class="play_icon" :src="play_icon" alt="" />
    <text v-if="isVideo" class="video_duration">{{ duration }}</text>
  </div>
</template>

<script setup lang='ts'>
import play_icon from '@/assets/images/chating_message_video_play.png'
import useMessageStore from '@/store/modules/message';
import { secFormat } from '@/utils/common';
import { MessageType } from '@/utils/open-im-sdk-wasm/types/enum';
import { showImagePreview } from 'vant';
import { ExedMessageItem } from './data';


type MediaMessageRendererProps = {
  message: ExedMessageItem;
  disabled: boolean;
}

const props = defineProps<MediaMessageRendererProps>();
const messageStore = useMessageStore();
const router = useRouter()

const isError = ref(false)

const isVideo = props.message.contentType === MessageType.VideoMessage
const imageUrl = isVideo ? props.message.videoElem.snapshotUrl : props.message.pictureElem.snapshotPicture.url;
const duration = isVideo ? secFormat(props.message.videoElem.duration) : 0

const clickMediaItem = () => {
  if (props.disabled) {
    return;
  }
  if (isVideo) {
    router.push({
      path: '/previewVideo',
      query: {
        url: props.message.videoElem.videoUrl,
        poster: props.message.videoElem.snapshotUrl
      }
    })
  } else {
    const idx = messageStore.storePreviewImgList.findIndex(item => item === props.message.pictureElem.sourcePicture.url)
    showImagePreview({
      images: messageStore.storePreviewImgList,
      startPosition: idx > -1 ? idx : 0,
      closeable: true,
    })
  }
}

</script>

<style lang='scss' scoped>
.media_message_container {
  position: relative;
  overflow: hidden;

  .play_icon {
    width: 36px;
    height: 36px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .video_duration {
    position: absolute;
    bottom: 6px;
    right: 12px;
    color: #fff;
  }
}
</style>