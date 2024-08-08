<template>
  <div v-if="isWaiting || !isVideo" class="mt-[80px] flex w-full flex-col items-center">
    <Avatar :size="70" :src="userInfo?.faceURL" :desc="userInfo?.nickname" />
    <span class="mt-2 text-xl text-white">{{ userInfo?.nickname }}</span>
    <span v-if="isWaiting" class="mt-2 text-white opacity-70">{{ title }}</span>
  </div>
</template>

<script lang="ts" setup>
import type { PublicUserItem } from '@openim/wasm-client-sdk/lib/types/entity'

type SingleContentProps = {
  userInfo?: PublicUserItem
  isVideo: boolean
  isWaiting: boolean
  isRecv: boolean
}
const props = defineProps<SingleContentProps>()

const { t } = useI18n()

const title = computed(() => {
  if (props.isRecv && !props.isVideo) return t('rtc.inviteYouVoice')
  if (props.isRecv && props.isVideo) return t('rtc.inviteYouVideo')
  return t('rtc.onCall')
})
</script>
