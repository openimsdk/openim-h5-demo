import { BusinessUserInfo } from "@/api/data";
import {
  ConversationItem,
  FriendUserItem,
  GroupItem,
  GroupMemberItem,
} from "@openim/wasm-client-sdk/lib/types/entity";

export type GenericListItemSource = FriendUserItem &
  GroupItem &
  GroupMemberItem &
  BusinessUserInfo &
  ConversationItem;
