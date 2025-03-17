import { connectedParticipantsObserver } from '@livekit/components-core'
import { RoomEvent, Room, RemoteParticipant } from 'livekit-client'
import { Ref, onUnmounted, ref, watch } from 'vue'

export interface UseRemoteParticipantsOptions {
  updateOnlyOn?: RoomEvent[]
  room: Room
}

export function useRemoteParticipants({
  room,
  updateOnlyOn,
}: UseRemoteParticipantsOptions) {
  const participants = ref<RemoteParticipant[]>([])

  let listener: any

  watch([() => room, () => updateOnlyOn], ([newRoom, newUpdateOnlyOn]) => {
    if (listener) listener.unsubscribe()
    listener = connectedParticipantsObserver(newRoom, {
      additionalRoomEvents: newUpdateOnlyOn,
    }).subscribe((value) => (participants.value = value))
  })

  onUnmounted(() => {
    listener.unsubscribe()
  })

  return participants as Ref<RemoteParticipant[]>
}
