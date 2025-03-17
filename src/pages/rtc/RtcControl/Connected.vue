<template>
  <div class="z-10 mb-[48px] flex flex-row justify-around px-2">
    <div class="flex flex-col items-center" @click.stop="changeMic">
      <img
        class="h-[62px] w-[62px]"
        :src="isMicrophoneEnabled ? mic_open : mic_close"
        alt="mic"
      />
      <span class="mt-2 text-sm text-white">{{
        isMicrophoneEnabled ? $t('rtc.micOpen') : $t('rtc.micClose')
      }}</span>
    </div>
    <div class="flex flex-col items-center" @click.stop="disconnect">
      <img class="h-[62px] w-[62px]" :src="hungup" alt="hungup" />
      <span class="mt-2 text-sm text-white">{{ $t('rtc.hungup') }}</span>
    </div>
    <div class="flex flex-col items-center">
      <img
        class="h-[62px] w-[62px]"
        :src="soundStatus ? sound_open : sound_close"
        alt="sound"
      />
      <span class="mt-2 text-sm text-white">{{ $t('rtc.soundOpen') }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import sound_open from '@/assets/images/rtc/sound_open.png'
import sound_close from '@/assets/images/rtc/sound_close.png'
import mic_open from '@/assets/images/rtc/mic_open.png'
import mic_close from '@/assets/images/rtc/mic_close.png'
import hungup from '@/assets/images/rtc/hungup.png'
import { useLocalParticipant } from '@/utils/open-im-rtc'
import { Room } from 'livekit-client'

type IRtcConnectedEmits = {
  (event: 'disconnect'): void
}
type IRtcConnectedProps = {
  room: Room
}
const emit = defineEmits<IRtcConnectedEmits>()
const props = defineProps<IRtcConnectedProps>()

const soundStatus = ref(true)
const { localParticipant, isMicrophoneEnabled } = useLocalParticipant(props.room)

const changeMic = async () =>
  localParticipant.value.setMicrophoneEnabled(!isMicrophoneEnabled.value)

const disconnect = () => emit('disconnect')

onMounted(() => {
  const loudspeaker = props.room.getActiveDevice('audiooutput')
  if (loudspeaker) {
    props.room.switchActiveDevice('audiooutput', loudspeaker)
  }
})
</script>
