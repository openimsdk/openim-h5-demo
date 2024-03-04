<template>
  <audio ref="mediaEl" v-bind="elementProps"></audio>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMediaTrackBySourceOrName } from '../hooks/useMediaTrackBySourceOrName'
import {
  RemoteAudioTrack,
  RemoteTrackPublication,
  TrackPublication,
} from 'livekit-client'
import { TrackReference, log } from '@livekit/components-core'

interface AudioTrackProps {
  volume?: number
  trackRef?: TrackReference
  publication?: TrackPublication
  manageSubscription?: boolean
  muted?: boolean
}

type AudioTrackEmits = {
  (event: 'subscriptionStatusChanged', subscribed: boolean): void
}

const props = defineProps<AudioTrackProps>()
const emit = defineEmits<AudioTrackEmits>()

const _name = props.trackRef?.publication?.trackName
const _source = props.trackRef?.source
const _publication = props.trackRef?.publication
const participant = props.trackRef?.participant

if (_source === undefined) {
  throw new Error('AudioTrack: You must provide a trackRef or source property.')
}

const mediaEl = ref<HTMLAudioElement | null>(null)

const {
  elementProps,
  publication: pub,
  track,
  isSubscribed,
} = useMediaTrackBySourceOrName(
  {
    participant: participant!,
    name: _name,
    source: _source,
    publication: _publication,
  },
  {
    element: mediaEl,
  },
)

watch(
  isSubscribed,
  (newIsSubscribed) => {
    emit('subscriptionStatusChanged', !!newIsSubscribed)
  },
  { immediate: true },
)

watch(
  [() => track.value, () => props.volume],
  ([newTrack, newVolume]) => {
    if (newTrack === undefined || newVolume === undefined) {
      return
    }
    if (newTrack instanceof RemoteAudioTrack) {
      newTrack.setVolume(newVolume)
    } else {
      log.warn('Volume can only be set on remote audio tracks.')
    }
  },
  { immediate: true },
)

watch(
  [() => pub.value, () => props.muted],
  ([newPub, newMuted]) => {
    if (newPub === undefined || newMuted === undefined) {
      return
    }
    if (newPub instanceof RemoteTrackPublication) {
      newPub.setEnabled(!props.muted)
    } else {
      log.warn('Can only call setEnabled on remote track publications.')
    }
  },
  { immediate: true },
)
</script>
