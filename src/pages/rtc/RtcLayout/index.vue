<template>
  <van-overlay :show="show && !isMini" z-index="100">
    <div class="relative flex h-full flex-col" v-if="!isClose">
      <div class="z-10 mt-5 flex flex-row justify-between px-3">
        <img class="h-[30px] w-[30px]" :src="mini" alt="mini" @click="changeMini" />
        <Camera v-if="!isWaiting" :room="room" :isVideo="isVideo" />
      </div>

      <div class="relative z-10 mt-1 flex flex-1 flex-col overflow-hidden">
        <RtcProfile :room="room" :inviteData="inviteData" :isWaiting="isWaiting" />
        <div
          v-if="!isWaiting"
          class="mb-2 flex flex-row items-center justify-center"
          :style="{ marginTop: isVideo ? 'auto' : '' }"
        >
          <Counter ref="counterRef" :isConnected="isConnected" />
        </div>
      </div>

      <van-loading
        vertical
        v-if="!isRecv && !(connect || isConnected)"
        class="flex flex-1 items-center justify-center"
        >{{ $t('rtc.connecting') }}</van-loading
      >
      <template v-else>
        <RtcControl
          :isWaiting="isWaiting"
          :isConnected="isConnected"
          :invitation="inviteData.invitation!"
          :inviteData="inviteData"
          :duration="duration"
          @connectRtc="connectRtc"
          :room="room"
          :sendCustomSignal="sendCustomSignal"
        />
        <RtcRoom v-if="isConnected" :room="room" :isVideo="isVideo" />
      </template>
    </div>
  </van-overlay>
  <div
    v-if="isMini"
    class="fixed flex h-[110px] w-[86px] flex-col items-center justify-center rounded-md bg-black bg-opacity-80 transition"
    :style="style"
    @click="changeMini"
    ref="el"
  >
    <Avatar
      :size="48"
      :src="inviteData?.participant?.userInfo.faceURL"
      :desc="inviteData?.participant?.userInfo.nickname"
    />
    <span class="mt-3 text-xs text-white">{{
      isWaiting ? $t('rtc.waitConnected') : $t('rtc.inConnect')
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import mini from '@/assets/images/rtc/mini.png'
import RtcControl from '../RtcControl/index.vue'
import Counter from '../Counter/index.vue'
import RtcRoom from './Room.vue'
import RtcProfile from '../RtcProfile/index.vue'

import { AuthData, InviteData } from '../data'
import { useDraggable } from '@vueuse/core'
import { Room } from 'livekit-client'
import useInviteData from '../useInviteData'
import Camera from './Camera.vue'
import { CustomType } from '@/constants/enum'

type IRtcLayoutEmits = {
  (event: 'connectRtc', data?: AuthData): void
}
type IRtcLayoutProps = {
  connect: boolean
  isConnected: boolean
  inviteData: InviteData
  room: Room
  sendCustomSignal: (recvID: string, customType: CustomType) => Promise<void>;
}
const emit = defineEmits<IRtcLayoutEmits>()
const props = defineProps<IRtcLayoutProps>()

const show = ref(true)
const isClose = ref(false)
const isMini = ref(false)
const counterRef = ref()
const el = ref<HTMLElement | null>(null)

const duration = computed(() => counterRef.value?.getTime() ?? '')
const isWaiting = computed(() => !(props.connect && props.isConnected))
const initialValueX = computed(
  () =>
    (window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth) -
    86 -
    16,
)

const { isVideo, isGroup, isRecv } = useInviteData(props.inviteData)
const { style } = useDraggable(el, {
  initialValue: { x: initialValueX.value, y: 100 },
})

const connectRtc = (data?: AuthData) => {
  if (data) {
    emit('connectRtc', {
      liveURL: data.liveURL,
      token: data.token,
    })
  } else {
    emit('connectRtc', undefined)
  }
}

const changeMini = () => {
  show.value = !show.value
  isMini.value = !isMini.value
}
</script>

<style lang="scss" scoped>
.van-overlay {
  backdrop-filter: blur(30px);
  transition: 0.3s ease;
}
</style>
