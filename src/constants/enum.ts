import { MessageType, SessionType } from "@/utils/open-im-sdk-wasm/types/enum";

export enum CustomType {
  VideoCall = "c100",
  VoiceCall = "c101",
  Call = 901,
  MassMsg = 903,
  InsertLoading = 999,
}

export const TipTypes = [
  MessageType.RevokeMessage,
  MessageType.FriendAdded,
  MessageType.FriendAdded,
  MessageType.GroupCreated,
  MessageType.GroupInfoUpdated,
  MessageType.MemberQuit,
  MessageType.GroupOwnerTransferred,
  MessageType.MemberKicked,
  MessageType.MemberInvited,
  MessageType.MemberEnter,
  MessageType.GroupDismissed,
  MessageType.GroupMemberMuted,
  MessageType.GroupMemberCancelMuted,
  MessageType.GroupMemberInfoUpdated,
  MessageType.GroupMuted,
  MessageType.GroupAnnouncementUpdated,
  MessageType.GroupCancelMuted,
  MessageType.BurnMessageChange,
  MessageType.GroupMemberToAdmin,
  MessageType.GroupAdminToNomal,
  MessageType.GroupNameUpdated,
];

export const FileMessageTypes = [
  MessageType.PictureMessage,
  MessageType.VideoMessage,
  MessageType.VoiceMessage,
  MessageType.FileMessage,
];