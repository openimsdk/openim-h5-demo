import {
  SourcesArray,
  isSourceWitOptions,
  trackReferencesObservable,
  log,
  isSourcesWithOptions,
  TrackReference,
} from '@livekit/components-core'
import { Participant, Room, RoomEvent, Track } from 'livekit-client'
import { ref, computed, watch, onUnmounted, ComputedRef } from 'vue'

export type UseTracksOptions = {
  updateOnlyOn?: RoomEvent[]
  onlySubscribed?: boolean
  room: Room
}

export function useTracks<T extends SourcesArray = Track.Source[]>(
  options: UseTracksOptions,
  sources: T = [
    Track.Source.Camera,
    Track.Source.Microphone,
    Track.Source.ScreenShare,
    Track.Source.ScreenShareAudio,
    Track.Source.Unknown,
  ] as T,
) {
  const trackReferences = ref<TrackReference[]>([])
  const participants = ref<Participant[]>([])

  let subscription: any

  watch(
    [() => options.room, () => options.updateOnlyOn, () => sources],
    ([newRoom, newUpdateOnlyOn, newSources]) => {
      if (subscription) {
        subscription.unsubscribe()
      }

      const sources_ = newSources.map((s) => (isSourceWitOptions(s) ? s.source : s))

      subscription = trackReferencesObservable(newRoom, sources_, {
        additionalRoomEvents: newUpdateOnlyOn,
        onlySubscribed: options.onlySubscribed,
      }).subscribe(
        ({ trackReferences: newTrackReferences, participants: newParticipants }) => {
          log.debug('setting track bundles', newTrackReferences, newParticipants)
          trackReferences.value = newTrackReferences
          participants.value = newParticipants
        },
      )
    },
    { immediate: true },
  )

  onUnmounted(() => {
    if (subscription) {
      subscription.unsubscribe()
    }
  })

  const maybeTrackReferences = computed(() => {
    if (isSourcesWithOptions(sources)) {
      const requirePlaceholder = requiredPlaceholders(
        sources,
        participants.value as Participant[],
      )
      const trackReferencesWithPlaceholders = [...trackReferences.value]
      participants.value.forEach((participant) => {
        if (requirePlaceholder.has(participant.identity)) {
          const sourcesToAddPlaceholder =
            requirePlaceholder.get(participant.identity) ?? []
          sourcesToAddPlaceholder.forEach((placeholderSource) => {
            if (
              trackReferences.value.find(
                ({ participant: p, publication }) =>
                  participant.identity === p.identity &&
                  publication.source === placeholderSource,
              )
            ) {
              return
            }
            log.debug(
              `Add ${placeholderSource} placeholder for participant ${participant.identity}.`,
            )
            const placeholder = { participant, source: placeholderSource }
            trackReferencesWithPlaceholders.push(placeholder as TrackReference)
          })
        }
      })
      return trackReferencesWithPlaceholders
    } else {
      return trackReferences.value
    }
  })

  return maybeTrackReferences as ComputedRef<TrackReference[]>
}

function difference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  const _difference = new Set(setA)
  for (const elem of setB) {
    _difference.delete(elem)
  }
  return _difference
}

export function requiredPlaceholders<T extends SourcesArray>(
  sources: T,
  participants: Participant[],
): Map<Participant['identity'], Track.Source[]> {
  const placeholderMap = new Map<Participant['identity'], Track.Source[]>()
  if (isSourcesWithOptions(sources)) {
    const sourcesThatNeedPlaceholder = sources
      .filter((sourceWithOption) => sourceWithOption.withPlaceholder)
      .map((sourceWithOption) => sourceWithOption.source)

    participants.forEach((participant) => {
      const sourcesOfSubscribedTracks = participant
        .getTracks()
        .map((pub) => pub.track?.source)
        .filter((trackSource): trackSource is Track.Source => trackSource !== undefined)
      const placeholderNeededForThisParticipant = Array.from(
        difference(
          new Set(sourcesThatNeedPlaceholder),
          new Set(sourcesOfSubscribedTracks),
        ),
      )
      // If the participant needs placeholder add it to the placeholder map.
      if (placeholderNeededForThisParticipant.length > 0) {
        placeholderMap.set(participant.identity, placeholderNeededForThisParticipant)
      }
    })
  }
  return placeholderMap
}
