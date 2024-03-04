import AudioTrack from './components/AudioTrack.vue'
import VideoTrack from './components/VideoTrack.vue'
import { useIsMuted } from './hooks/useIsMuted'
import { useLocalParticipant } from './hooks/useLocalParticipant'
import { useMediaTrackBySourceOrName } from './hooks/useMediaTrackBySourceOrName'
import { useParticipantInfo } from './hooks/useParticipantInfo'
import { useRemoteParticipant } from './hooks/useRemoteParticipant'
import { useRemoteParticipants } from './hooks/useRemoteParticipants'
import { useRoom } from './hooks/useRoom'
import { useRoomInfo } from './hooks/useRoomInfo'
import { useTracks } from './hooks/useTracks'

export {
  AudioTrack,
  VideoTrack,
  useIsMuted,
  useLocalParticipant,
  useMediaTrackBySourceOrName,
  useParticipantInfo,
  useRemoteParticipant,
  useRemoteParticipants,
  useRoom,
  useRoomInfo,
  useTracks,
}
