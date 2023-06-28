import useConversationStore from "@/store/modules/conversation";
import useMessageStore, { ExMessageItem } from "@/store/modules/message";
import { IMSDK } from "@/utils/imCommon";
import { CbEvents } from "open-im-sdk-wasm/lib/constant";
import { WSEvent } from "open-im-sdk-wasm/lib/types/entity";

const messageStore = useMessageStore();
const conversationStore = useConversationStore();

export function useMessageReceipt() {
  const setIMListener = () => {
    IMSDK.on(CbEvents.ONRECVC2CREADRECEIPT, singleMessageHasReadedHander);
  };

  const disposeIMListener = () => {
    IMSDK.off(CbEvents.ONRECVC2CREADRECEIPT, singleMessageHasReadedHander);
  };

  const singleMessageHasReadedHander = ({ data }: any) => {
    JSON.parse(data as string).map((receipt: any) => {
      receipt.msgIDList.map((clientMsgID: string) => {
        messageStore.updateOneMessage({
          clientMsgID,
          isRead: true,
        } as ExMessageItem);
      });
    });
  };

  onMounted(() => {
    setIMListener();
  });

  onUnmounted(() => {
    disposeIMListener();
  });
}
