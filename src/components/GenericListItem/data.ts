import { BusinessUserInfo } from "@/api/data";
import {
  ConversationItem,
  FriendItem,
  FullUserItem,
  GroupItem,
  GroupMemberItem,
} from "open-im-sdk-wasm/lib/types/entity";

export type GenericListItemSource = FullUserItem &
  FriendItem &
  GroupItem &
  GroupMemberItem &
  BusinessUserInfo &
  ConversationItem;
