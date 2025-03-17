import {
  type TrackReferenceOrPlaceholder,
  getTrackReferenceId,
  mutedObserver,
} from '@livekit/components-core'
import { onUnmounted, ref, watch } from 'vue'

export function useIsMuted(sourceOrTrackRef: TrackReferenceOrPlaceholder) {
  const p = sourceOrTrackRef.participant
  const isMuted = ref(
    !!(
      sourceOrTrackRef.publication?.isMuted ||
      p.getTrack(sourceOrTrackRef.source)?.isMuted
    ),
  )

  let listener: any

  watch(
    () => getTrackReferenceId(sourceOrTrackRef),
    () => {
      if (listener) listener.unsubscribe()
      listener = mutedObserver(sourceOrTrackRef).subscribe((muted) => {
        isMuted.value = muted
      })
    },
    { immediate: true },
  )

  onUnmounted(() => {
    if (listener) {
      listener?.unsubscribe()
    }
  })

  return isMuted
}
