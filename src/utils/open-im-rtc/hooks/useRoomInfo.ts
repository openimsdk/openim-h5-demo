import { roomInfoObserver } from '@livekit/components-core'
import { Room } from 'livekit-client'
import { useObservableState } from './useObservableState'

export function useRoomInfo(room: Room) {
  const infoObserver = roomInfoObserver(room)
  const roomInfo = useObservableState(infoObserver, {
    name: room.name,
    metadata: room.metadata,
  })

  return roomInfo
}
