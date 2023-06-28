import { MessageType, SessionType } from "open-im-sdk-wasm/lib/types/enum";

export enum CustomType {
  VideoCall = "c100",
  VoiceCall = "c101",
  Call = 901,
  MassMsg = 903,
  InsertLoading = 999,
}

export const GroupSessionTypes = [SessionType.Group, SessionType.SuperGroup];

export const TipTypes = [
  MessageType.REVOKEMESSAGE,
  MessageType.ADVANCEREVOKEMESSAGE,
  MessageType.FRIENDAPPLICATIONAPPROVED,
  MessageType.FRIENDAPPLICATIONREJECTED,
  MessageType.FRIENDAPPLICATIONADDED,
  MessageType.FRIENDADDED,
  MessageType.FRIENDDELETED,
  MessageType.FRIENDREMARKSET,
  MessageType.BLACKADDED,
  MessageType.BLACKDELETED,
  MessageType.SELFINFOUPDATED,
  MessageType.GROUPCREATED,
  MessageType.GROUPINFOUPDATED,
  MessageType.JOINGROUPAPPLICATIONADDED,
  MessageType.MEMBERQUIT,
  MessageType.GROUPAPPLICATIONACCEPTED,
  MessageType.GROUPAPPLICATIONREJECTED,
  MessageType.GROUPOWNERTRANSFERRED,
  MessageType.MEMBERKICKED,
  MessageType.MEMBERINVITED,
  MessageType.MEMBERENTER,
  MessageType.GROUPDISMISSED,
  MessageType.GROUPMEMBERMUTED,
  MessageType.GROUPMEMBERCANCELMUTED,
  MessageType.GROUPMUTED,
  MessageType.GROUPCANCELMUTED,
  MessageType.BURNMESSAGECHANGE,
];

export const FileMessageTypes = [
  MessageType.PICTUREMESSAGE,
  MessageType.VIDEOMESSAGE,
  MessageType.VOICEMESSAGE,
  MessageType.FILEMESSAGE,
];

export enum isAllow {
  Allowed = 1,
  NotAllowed = 2,
}
