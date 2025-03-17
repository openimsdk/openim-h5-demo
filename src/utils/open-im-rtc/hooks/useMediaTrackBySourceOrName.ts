import {
  TrackIdentifier,
  getTrackByIdentifier,
  isLocal,
  log,
  setupMediaTrack,
} from '@livekit/components-core'
import { ComputedRef, Ref, computed, onUnmounted, ref, watch } from 'vue'

export interface UseMediaTrackOptions {
  element?: Ref<HTMLMediaElement | null>
}

interface MediaTrackState {
  publication: Ref<TrackIdentifier | undefined>
  isMuted: Ref<boolean>
  isSubscribed: Ref<boolean>
  track: Ref<MediaStreamTrack | undefined>
  elementProps: ComputedRef<{
    className: string
    'data-lk-local-participant': boolean
    'data-lk-source': string | undefined
    'data-lk-orientation': 'landscape' | 'portrait' | undefined
  }>
}

export function useMediaTrackBySourceOrName(
  observerOptions: TrackIdentifier,
  options: UseMediaTrackOptions = {},
) {
  const publication = ref(getTrackByIdentifier(observerOptions))
  const isMuted = ref(publication.value?.isMuted || false)
  const isSubscribed = ref(publication.value?.isSubscribed || false)
  const track = ref(publication.value?.track)
  const orientation = ref<'landscape' | 'portrait'>('landscape')
  const previousElement = ref<HTMLMediaElement | null>(null)

  const trackObserverInfo = computed(() => setupMediaTrack(observerOptions))

  let subscription: any

  watch(
    () => trackObserverInfo.value.trackObserver,
    (newValue) => {
      if (subscription) subscription.unsubscribe()

      subscription = newValue.subscribe((newPublication) => {
        log.debug('update track', newPublication)
        publication.value = newPublication
        isMuted.value = newPublication?.isMuted || false
        isSubscribed.value = newPublication?.isSubscribed || false
        track.value = newPublication?.track
      })
    },
    { immediate: true },
  )

  onUnmounted(() => {
    subscription.unsubscribe()
  })

  watch(
    [() => track.value, () => options.element?.value],
    ([newTrack, newEl]) => {
      if (!newEl) return

      if (newTrack) {
        if (previousElement.value) {
          newTrack.detach(previousElement.value)
        }

        if (
          options.element?.value &&
          !(isLocal(observerOptions.participant) && newTrack?.kind === 'audio')
        ) {
          console.log('attach')

          newTrack.attach(options.element.value)
        }
      }
      previousElement.value = options.element?.value || null
    },
    { immediate: true },
  )

  watch(
    publication,
    (newPublication) => {
      if (
        typeof newPublication?.dimensions?.width === 'number' &&
        typeof newPublication?.dimensions?.height === 'number'
      ) {
        const newOrientation =
          newPublication.dimensions.width > newPublication.dimensions.height
            ? 'landscape'
            : 'portrait'
        orientation.value = newOrientation
      }
    },
    { immediate: true },
  )

  const elementProps = computed(() => ({
    className: trackObserverInfo.value.className,
    'data-lk-local-participant': observerOptions.participant.isLocal,
    'data-lk-source': publication.value?.source,
    ...(publication.value?.kind === 'video' && {
      'data-lk-orientation': orientation.value,
    }),
  }))

  return {
    publication,
    isMuted,
    isSubscribed,
    track,
    elementProps,
  } as MediaTrackState
}
