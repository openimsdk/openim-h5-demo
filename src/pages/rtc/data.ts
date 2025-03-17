import type {
  GroupItem,
  GroupMemberItem,
  PublicUserItem,
  RtcInvite,
} from '@openim/wasm-client-sdk/lib/types/entity'

export interface InviteData {
  invitation?: RtcInvite
  participant?: ParticipantInfo
  isJoin?: boolean
}

export interface ParticipantInfo {
  userInfo: PublicUserItem
  groupMemberInfo?: GroupMemberItem
  groupInfo?: GroupItem
}

export interface RtcInviteResults {
  liveURL: string
  roomID: string
  token: string
  busyLineUserIDList?: string[]
}

export interface AuthData {
  liveURL: string
  token: string
}

export interface CallingRoomData {
  participant?: ParticipantInfo[];
  invitation?: RtcInvite;
  roomID: string;
}
