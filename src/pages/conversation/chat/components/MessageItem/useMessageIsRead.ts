import { ExedMessageItem } from "./data";
import useConversationStore from "@/store/modules/conversation";
import useMessageStore from "@/store/modules/message";
import { IMSDK } from "@/utils/imCommon";
import { useIntersectionObserver } from "@vueuse/core";
import { ComputedRef, Ref } from "vue";

type UseMessageIsReadProps = {
  messageContainerRef: Ref<any>;
  clientMsgID: string;
  isSelfMsg: ComputedRef<boolean>;
  isRead: boolean;
  isPreView: boolean;
  isGroupAnnounce: boolean;
};

const conversationStore = useConversationStore();
const messageStore = useMessageStore();

export function useMessageIsRead({
  messageContainerRef,
  isSelfMsg,
  isRead,
  isPreView,
  isGroupAnnounce,
  clientMsgID,
}: UseMessageIsReadProps) {
  const markC2CAsRead = () => {
    IMSDK.markMessagesAsReadByMsgID({
      conversationID: conversationStore.storeCurrentConversation.conversationID,
      clientMsgIDList: [clientMsgID],
    });
    messageStore.updateOneMessage({
      clientMsgID,
      isRead: true,
      isAppend: false,
    } as ExedMessageItem);
  };

  const getMessageVisible = () => {
    if (isSelfMsg.value || isRead || isPreView || isGroupAnnounce) {
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
