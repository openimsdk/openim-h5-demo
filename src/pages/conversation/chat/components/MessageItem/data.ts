import { MessageItem } from "open-im-sdk-wasm/lib/types/entity";

type ExMessageFields = {
  checked: boolean;
  disabled: boolean;
  jump: boolean;
  isAppend?: boolean;
};

export type ExedMessageItem = MessageItem & ExMessageFields;

export enum MessageMenuType {
  Copy,
  Delete,
  ForWard,
  Replay,
  Revoke,
  Multiple,
}
