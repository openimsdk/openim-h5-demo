import { ExedMessageItem } from "./data";
import useConversationStore from "@/store/modules/conversation";
import useMessageStore from "@/store/modules/message";
import { IMSDK } from "@/utils/imCommon";
import { useIntersectionObserver } from "@vueuse/core";
import { SessionType } from "open-im-sdk-wasm/lib/types/enum";
import { ComputedRef, Ref } from "vue";

type UseMessageIsReadProps = {
  messageContainerRef: Ref<any>;
  clientMsgID: string;
  isSelfMsg: ComputedRef<boolean>;
  isRead: boolean;
  isPreView: boolean;
};

const conversationStore = useConversationStore();
const messageStore = useMessageStore();

export function useMessageIsRead({
  messageContainerRef,
  isSelfMsg,
  isRead,
  isPreView,
  clientMsgID,
}: UseMessageIsReadProps) {
  const markC2CAsRead = () => {
    const isSingle =
      conversationStore.storeCurrentConversation.conversationType ===
      SessionType.Single;
    const funcName = isSingle
      ? "markC2CMessageAsRead"
      : "markGroupMessageAsRead";
    IMSDK[funcName]({
      userID: conversationStore.storeCurrentConversation.userID,
      groupID: conversationStore.storeCurrentConversation.groupID,
      msgIDList: [clientMsgID],
    });
    messageStore.updateOneMessage({
      clientMsgID,
      isRead: true,
    } as ExedMessageItem);
  };

  const getMessageVisible = () => {
    if (isSelfMsg.value || isRead || isPreView) {
      return;
    }

    const { stop } = useIntersectionObserver(
      messageContainerRef,
      ([{ isIntersecting }], observerElement) => {
        if (isIntersecting) {
          markC2CAsRead();
          stop();
        }
      }
    );
  };

  onMounted(() => {
    getMessageVisible();
  });
}
