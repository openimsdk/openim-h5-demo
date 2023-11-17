import { MessageType, SessionType } from "@/utils/open-im-sdk-wasm/types/enum";

export const CustomMessageType = {
  Call: 100,
  MassMsg: 903,
  MeetingInvitation: 905,
};

export const GroupSessionTypes = [SessionType.Group, SessionType.WorkingGroup];

export const GroupSystemMessageTypes = [
  MessageType.GroupCreated,
  MessageType.GroupInfoUpdated,
  MessageType.MemberQuit,
  MessageType.GroupOwnerTransferred,
  MessageType.MemberKicked,
  MessageType.MemberInvited,
  MessageType.MemberEnter,
  MessageType.GroupDismissed,
  MessageType.GroupMemberMuted,
  MessageType.GroupMuted,
  MessageType.GroupCancelMuted,
  MessageType.GroupMemberCancelMuted,
  MessageType.GroupMemberInfoUpdated,
  MessageType.GroupMemberToAdmin,
  MessageType.GroupAdminToNomal,
  MessageType.GroupNameUpdated
];

export const TipTypes = [
  MessageType.RevokeMessage,
  MessageType.FriendAdded,
  MessageType.BurnMessageChange,
  ...GroupSystemMessageTypes
];

export const FileMessageTypes = [
  MessageType.PictureMessage,
  MessageType.VideoMessage,
  MessageType.VoiceMessage,
  MessageType.FileMessage,
];
