import {
    FriendApplicationItem,
    GroupApplicationItem,
  } from "@/utils/open-im-sdk-wasm/types/entity";
import { GroupJoinSource } from "@/utils/open-im-sdk-wasm/types/enum";

export enum ApplicationTypeEnum {
    RecivedFriendApplication,
    SentFriendApplication,
    RecivedGroupApplication,
    SentGroupApplication,
}

export type ApplicationItemSource = FriendApplicationItem & GroupApplicationItem & {joinSource:GroupJoinSource};