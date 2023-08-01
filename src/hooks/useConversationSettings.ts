import { feedbackToast } from "@utils/common";
import useConversationStore from "@/store/modules/conversation";
import useMessageStore from "@/store/modules/message";
import { IMSDK } from "@/utils/imCommon";
import { showConfirmDialog } from "vant";

export default function useConversationSettings() {
  const conversationStore = useConversationStore();
  const messageStore = useMessageStore();

  const switchLoading = reactive({
    pinLoading: false,
    recvMsgLoading: false,
    privateLoading: false,
  });

  const updateConversationPinState = async () => {
    switchLoading.pinLoading = true;
    try {
      await IMSDK.pinConversation({
        conversationID:
          conversationStore.storeCurrentConversation.conversationID,
        isPinned: !conversationStore.storeCurrentConversation.isPinned,
      });
    } catch (error) {}
    switchLoading.pinLoading = false;
  };


  const clearLogs = () => {
    showConfirmDialog({
      message: "是否清空聊天记录？",
      beforeClose: (action: string) => {
        return new Promise((resolve) => {
          if (action !== "confirm") {
            resolve(true);
            return;
          }
          IMSDK.clearConversationAndDeleteAllMsg(
            conversationStore.storeCurrentConversation.groupID ||
              conversationStore.storeCurrentConversation.userID
          )
            .then(() => {
              messageStore.clearHistoryMessage();
              feedbackToast();
            })
            .catch((error:unknown) => feedbackToast({ error }))
            .finally(() => resolve(true));
        });
      },
    }).catch(() => {});
  };

  return {
    conversationStore,
    switchLoading,
    updateConversationPinState,
    clearLogs,
  };
}
