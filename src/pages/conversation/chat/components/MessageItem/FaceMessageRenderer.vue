<template>
  <div @click="clickMediaItem" class="media_message_container">
    <van-image class="need_preload_message max-w-[32vw]" :class="{ 'h-8 w-8': isError }" fit="contain" radius="6"
      :src="faceEl.url" @error="isError = true">
      <template v-slot:loading>
        <van-loading type="spinner" size="20" />
      </template>
      <template v-slot:error>{{ $t('failLoad') }}</template>
    </van-image>
  </div>
</template>


<script setup lang="ts">
import { showImagePreview } from 'vant'
import { ExedMessageItem } from './data';

type MediaMessageRendererProps = {
  message: ExedMessageItem
  disabled: boolean
}

type CustomEmojiItem = {
  url: string;
  path?: string;
  width: number;
  height: number;
};

const props = defineProps<MediaMessageRendererProps>()

const isError = ref(false)
const faceEl: CustomEmojiItem = JSON.parse(props.message.faceElem!.data);

const clickMediaItem = () => {
  if (props.disabled) {
    return
  }
  showImagePreview({
    images: [faceEl.url],
    startPosition: 0,
    loop: false,
  })
}
</script>
