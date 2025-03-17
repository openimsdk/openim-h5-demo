import {
  type ParticipantMedia,
  observeParticipantMedia,
} from '@livekit/components-core'
import type {
  LocalParticipant,
  Participant,
  Room,
  TrackPublication,
} from 'livekit-client'
import { ref, onUnmounted, watch, Ref } from 'vue'

interface LocalParticipantState {
  isMicrophoneEnabled: Ref<boolean>
  isScreenShareEnabled: Ref<boolean>
  isCameraEnabled: Ref<boolean>
  microphoneTrack: Ref<TrackPublication | undefined>
  cameraTrack: Ref<TrackPublication | undefined>
  lastMicrophoneError: Ref<Error | undefined>
  lastCameraError: Ref<Error | undefined>
  localParticipant: Ref<LocalParticipant>
}

export function useLocalParticipant(room: Room): LocalParticipantState {
  const localParticipant = ref(room.localParticipant)
  const isMicrophoneEnabled = ref(localParticipant.value.isMicrophoneEnabled)
  const isCameraEnabled = ref(localParticipant.value.isCameraEnabled)
  const lastMicrophoneError = ref(localParticipant.value.lastMicrophoneError)
  const lastCameraError = ref(localParticipant.value.lastCameraError)
  const isScreenShareEnabled = ref(localParticipant.value.isScreenShareEnabled)
  const microphoneTrack = ref<TrackPublication | undefined>(undefined)
  const cameraTrack = ref<TrackPublication | undefined>(undefined)

  const handleUpdate = (media: ParticipantMedia<LocalParticipant>) => {
    isCameraEnabled.value = media.isCameraEnabled
    isMicrophoneEnabled.value = media.isMicrophoneEnabled
    isScreenShareEnabled.value = media.isScreenShareEnabled
    cameraTrack.value = media.cameraTrack
    microphoneTrack.value = media.microphoneTrack
    lastMicrophoneError.value = media.participant.lastMicrophoneError
    lastCameraError.value = media.participant.lastCameraError
    localParticipant.value = media.participant
  }

  let listener: any

  watch(
    localParticipant,
    (lp) => {
      if (listener) listener.unsubscribe()
      listener = observeParticipantMedia(lp as unknown as Participant).subscribe(
        handleUpdate as (media: ParticipantMedia<Participant>) => void,
      )
    },
    { immediate: true },
  )

  onUnmounted(() => {
    listener?.unsubscribe()
  })

  return {
    isMicrophoneEnabled,
    isScreenShareEnabled,
    isCameraEnabled,
    microphoneTrack,
    cameraTrack,
    lastMicrophoneError,
    lastCameraError,
    localParticipant,
  } as LocalParticipantState
}
