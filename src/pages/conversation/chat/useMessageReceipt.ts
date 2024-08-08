import useConversationStore from "@/store/modules/conversation";
import useMessageStore, { ExMessageItem } from "@/store/modules/message";
import { IMSDK } from "@/utils/imCommon";
import { CbEvents } from "@openim/wasm-client-sdk";
import type { ReceiptInfo, WSEvent } from "@openim/wasm-client-sdk/lib/types/entity";
import { SessionType } from "@openim/wasm-client-sdk";

const messageStore = useMessageStore();
const conversationStore = useConversationStore();

export function useMessageReceipt() {
  const singleMessageHasReadedHander = ({ data }: WSEvent<ReceiptInfo[]>) => {
    if (
      conversationStore.storeCurrentConversation.conversationType !==
      SessionType.Single
    )
      return;

    data.map((receipt) => {
      (receipt.msgIDList ?? []).map((clientMsgID: string) => {
        messageStore.updateOneMessage({
          clientMsgID,
          isRead: true,
        } as ExMessageItem);
      });
    });
  };
  const setIMListener = () => {
    IMSDK.on(CbEvents.OnRecvC2CReadReceipt, singleMessageHasReadedHander);
  };

  const disposeIMListener = () => {
    IMSDK.off(CbEvents.OnRecvC2CReadReceipt, singleMessageHasReadedHander);
  };

  onMounted(() => {
    setIMListener();
  });

  onUnmounted(() => {
    disposeIMListener();
  });
}
