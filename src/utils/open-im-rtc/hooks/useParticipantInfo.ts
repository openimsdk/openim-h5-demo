import { participantInfoObserver } from '@livekit/components-core'
import { Participant } from 'livekit-client'
import { useObservableState } from './useObservableState'
import { computed } from 'vue'

export function useParticipantInfo(participant: Participant) {
  const infoObserver = participantInfoObserver(participant)
  const participantInfo = useObservableState(infoObserver, {
    name: participant.name,
    identity: participant.identity,
    metadata: participant.metadata,
  })

  return participantInfo
}
