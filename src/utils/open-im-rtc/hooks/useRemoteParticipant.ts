import { connectedParticipantObserver } from '@livekit/components-core'
import { ParticipantEvent, RemoteParticipant, Room } from 'livekit-client'
import { Ref, computed, watch } from 'vue'
import { useObservableState } from './useObservableState'

export interface UseRemoteParticipantOptions {
  room: Room
  updateOnlyOn?: ParticipantEvent[]
}

export function useRemoteParticipant(
  identity: string,
  options: UseRemoteParticipantOptions,
) {
  const { room, updateOnlyOn } = options

  const observable = computed(() =>
    connectedParticipantObserver(room, identity, {
      additionalEvents: updateOnlyOn,
    }),
  )

  const participant = useObservableState(
    observable.value,
    room.getParticipantByIdentity(identity) as RemoteParticipant | undefined,
  )

  return participant as Ref<RemoteParticipant | undefined>
}
