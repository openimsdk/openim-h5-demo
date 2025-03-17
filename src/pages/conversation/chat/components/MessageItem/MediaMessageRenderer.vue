<template>
  <div @click="clickMediaItem" class="media_message_container">
    <van-image
      class="need_preload_message max-w-[32vw]"
      :class="{ 'h-8 w-8': isError }"
      fit="contain"
      radius="6"
      :src="imageUrl"
      @error="isError = true"
    >
      <template v-slot:loading>
        <van-loading type="spinner" size="20" />
      </template>
      <template v-slot:error>{{ $t('failLoad') }}</template>
    </van-image>
  </div>
</template>

<script setup lang="ts">
import { showImagePreview } from 'vant'
import { ExedMessageItem } from './data'

type MediaMessageRendererProps = {
  message: ExedMessageItem
}

const props = defineProps<MediaMessageRendererProps>()

const isError = ref(false)

const imageUrl = props.message.pictureElem?.snapshotPicture.url

const clickMediaItem = () => {
  showImagePreview({
    images: [props.message.pictureElem?.sourcePicture.url!],
    startPosition: 0,
    loop: false,
  })
}
</script>

<style lang="scss" scoped>
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
