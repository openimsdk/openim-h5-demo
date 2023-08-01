import { BusinessUserInfo } from "@/api/data";
import {
  ConversationItem,
  FriendUserItem,
  FullUserItem,
  GroupItem,
  GroupMemberItem,
} from "open-im-sdk-wasm/lib/types/entity";

export type GenericListItemSource = FullUserItem &
  FriendUserItem &
  GroupItem &
  GroupMemberItem &
  BusinessUserInfo &
  ConversationItem;
