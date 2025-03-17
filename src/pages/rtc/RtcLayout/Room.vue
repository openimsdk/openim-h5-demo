<template>
  <VideoTrack
    v-if="isVideo"
    v-for="track in CameraTracks"
    :key="getTrackReferenceId(track)"
    :class="isLocal(track.participant) ? 'rtc-video-myself' : 'rtc-video-other'"
    :track-ref="track"
  />
  <AudioTrack
    v-for="track in MicrophoneTracks"
    :key="getTrackReferenceId(track) + 1"
    :track-ref="track"
  />
</template>

<script lang="ts" setup>
import useUserStore from '@/store/modules/user'
import { getTrackReferenceId } from '@livekit/components-core'
import { Participant, Room, Track } from 'livekit-client'
import { VideoTrack, AudioTrack, useTracks } from '@/utils/open-im-rtc'

type RoomProps = {
  room: Room
  isVideo: boolean
}
const props = defineProps<RoomProps>()

const room = computed(() => props.room)

const userStore = useUserStore()
const CameraTracks = useTracks({ room: room.value }, [Track.Source.Camera])
const MicrophoneTracks = useTracks({ room: room.value }, [Track.Source.Microphone])

const isLocal = (participant: Participant) =>
  participant.identity == userStore.selfInfo.userID
</script>

<style lang="scss">
.rtc-video-myself {
  position: absolute;
  top: 60px;
  right: 16px;
  width: 120px;
  z-index: 10;
}

.rtc-video-other {
  position: absolute;
  object-fit: cover;
  height: 100vh;
}
</style>
