import type { MessageItem } from "@openim/wasm-client-sdk/lib/types/entity";

type ExMessageFields = {
  checked: boolean;
  disabled: boolean;
  jump: boolean;
  isAppend?: boolean;
};

export type ExedMessageItem = MessageItem & ExMessageFields;

