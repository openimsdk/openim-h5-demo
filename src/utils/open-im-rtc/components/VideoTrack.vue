<template>
  <video
    ref="mediaEl"
    v-bind="elementProps"
    :class="mergedClass"
    muted
    @click="clickHandler"
  ></video>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMediaTrackBySourceOrName } from '../hooks/useMediaTrackBySourceOrName'
import { TrackPublication } from 'livekit-client'
import { TrackReference, ParticipantClickEvent } from '@livekit/components-core'

interface VideoTrackProps {
  trackRef: TrackReference
  publication?: TrackPublication
  manageSubscription?: boolean
  class?: string
}

type VideoTrackEmits = {
  (event: 'subscriptionStatusChanged', subscribed: boolean): void
  (event: 'click', evt: MouseEvent): void
  (event: 'trackClick', evt: ParticipantClickEvent): void
}

const props = defineProps<VideoTrackProps>()
const emit = defineEmits<VideoTrackEmits>()

const _name = props.trackRef?.publication?.trackName
const _source = props.trackRef?.source
const _publication = props.trackRef?.publication
const participant = props.trackRef?.participant

if (_source === undefined) {
  throw new Error('VideoTrack: You must provide a trackRef or source property.')
}

const mediaEl = ref<HTMLVideoElement | null>(null)

const {
  elementProps,
  publication: pub,
  isSubscribed,
} = useMediaTrackBySourceOrName(
  { participant, name: _name, source: _source, publication: _publication },
  {
    element: mediaEl,
  },
)

const mergedClass = computed(
  () => `${elementProps.value.className} ${props.class ?? ''}`,
)

watch(
  isSubscribed,
  (newIsSubscribed) => {
    emit('subscriptionStatusChanged', !!newIsSubscribed)
  },
  { immediate: true },
)

const clickHandler = (evt: MouseEvent) => {
  emit('click', evt)
  emit('trackClick', { participant, track: pub.value } as ParticipantClickEvent)
}
</script>
