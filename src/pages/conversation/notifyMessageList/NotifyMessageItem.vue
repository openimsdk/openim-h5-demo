<template>
  <div class="flex w-full px-[22px] py-3">
    <Avatar :src="source.senderFaceUrl" :desc="source.senderNickname" :size="42" />
    <div class="ml-3 flex-1 overflow-hidden">
      <div class="text-[var(--sub-text)]">
        {{ source.senderNickname }} {{ formatMessageTime(source.sendTime) }}
      </div>
      <div class="mt-2 w-fit rounded bg-white p-2">
        <div
          v-if="getMediaSource"
          class="relative border-b pb-1"
          @click="clickMediaItem"
        >
          <van-image
            class="need_preload_message max-w-[32vw]"
            fit="contain"
            radius="6"
            :src="getMediaSource"
          >
          </van-image>
          <img v-if="isVideo" class="play_icon" :src="play_icon" alt="" />
          <text v-if="isVideo" class="video_duration">{{ getDuration }}</text>
        </div>
        <text class="break-all">{{ notifyContent.text }}</text>
        <div v-if="hasExternalUrl" className="mt-0.5 text-xs text-[#0289FAFF]">
          <a :href="notifyContent.externalUrl" target="_blank" rel="noreferrer">
            {{ $t('clickToView') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import play_icon from '@/assets/images/chating_message_video_play.png'
import Avatar from '@/components/Avatar/index.vue'
import { secFormat } from '@/utils/common'
import { formatMessageTime } from '@/utils/imCommon'
import type {
  FileElem,
  MessageItem,
  PictureElem,
  SoundElem,
  VideoElem,
} from '@openim/wasm-client-sdk/lib/types/entity'
import { showImagePreview } from 'vant'

type SystemNotificationElem = {
  notificationName: string
  notificationFaceURL: string
  notificationType: number
  text: string
  externalUrl?: string
  mixType: NotificationMixType
  pictureElem?: PictureElem
  soundElem?: SoundElem
  videoElem?: VideoElem
  fileElem?: FileElem
  ex: string
}

enum NotificationMixType {
  Text,
  TextWithImage,
  TextWithVideo,
  TextWithFile,
  TextWithVoice,
  TextWithVoiceAndImage,
}

const emit = defineEmits([])
const router = useRouter()
const props = defineProps<{ source: MessageItem }>()

const notifyContent = computed<SystemNotificationElem>(() => {
  try {
    return JSON.parse(props.source.notificationElem?.detail!)
  } catch (error) {
    return {}
  }
})

const hasExternalUrl = computed(() => notifyContent.value.externalUrl)
const isVideo = computed(
  () => notifyContent.value.mixType === NotificationMixType.TextWithVideo,
)
const getMediaSource = computed(() => {
  if (notifyContent.value.mixType === NotificationMixType.TextWithImage) {
    const picEl = notifyContent.value.pictureElem
    return picEl?.snapshotPicture?.url ?? picEl?.sourcePicture?.url ?? ''
  }
  if (notifyContent.value.mixType === NotificationMixType.TextWithVideo) {
    const videoEl = notifyContent.value.videoElem
    return videoEl?.snapshotUrl ?? ''
  }
  return ''
})
const getDuration = computed(() => {
  if (!isVideo.value) return 0
  return secFormat(notifyContent.value.videoElem?.duration)
})

const clickMediaItem = () => {
  if (isVideo.value) {
    router.push({
      path: '/previewVideo',
      query: {
        url: notifyContent.value.videoElem?.videoUrl,
        poster: notifyContent.value.videoElem?.snapshotUrl,
      },
    })
  } else {
    showImagePreview({
      images: [notifyContent.value.pictureElem?.sourcePicture?.url!],
      loop: false,
    })
  }
}
</script>

<style lang="scss" scoped>
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
  bottom: 12px;
  right: 6px;
  color: #fff;
}
</style>
