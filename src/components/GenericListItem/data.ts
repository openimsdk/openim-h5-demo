import { BusinessUserInfo } from "@/api/data";
import {
  ConversationItem,
  FriendUserItem,
  FullUserItem,
  GroupItem,
  GroupMemberItem,
} from "@/utils/open-im-sdk-wasm/types/entity";

export type GenericListItemSource = FullUserItem &
  FriendUserItem &
  GroupItem &
  GroupMemberItem &
  BusinessUserInfo &
  ConversationItem;
