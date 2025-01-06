import type {
  FriendApplicationItem,
  GroupApplicationItem,
} from '@openim/wasm-client-sdk/lib/types/entity'
import { GroupJoinSource } from '@openim/wasm-client-sdk'

export enum ApplicationTypeEnum {
  RecivedFriendApplication,
  SentFriendApplication,
  RecivedGroupApplication,
  SentGroupApplication,
}

export type ApplicationItemSource = FriendApplicationItem &
  GroupApplicationItem & { joinSource: GroupJoinSource }
