import { BusinessUserInfo } from "@/api/data";
import {
  ConversationItem,
  FriendUserItem,
  FullUserItem,
  GroupItem,
  GroupMemberItem,
} from "@openim/wasm-client-sdk/lib/types/entity";

export type GenericListItemSource = FullUserItem &
  FriendUserItem &
  GroupItem &
  GroupMemberItem &
  BusinessUserInfo &
  ConversationItem;
