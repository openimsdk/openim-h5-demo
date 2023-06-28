import {
    FriendApplicationItem,
    GroupApplicationItem,
  } from "open-im-sdk-wasm/lib/types/entity";
import { GroupJoinSource } from "open-im-sdk-wasm/lib/types/enum";

export enum ApplicationTypeEnum {
    RecivedFriendApplication,
    SentFriendApplication,
    RecivedGroupApplication,
    SentGroupApplication,
}

export type ApplicationItemSource = FriendApplicationItem & GroupApplicationItem & {joinSource:GroupJoinSource};