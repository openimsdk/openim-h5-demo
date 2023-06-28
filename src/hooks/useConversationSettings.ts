import { feedbackToast } from '@utils/common';
import useConversationStore from "@/store/modules/conversation";
import useMessageStore from "@/store/modules/message";
import { IMSDK } from "@/utils/imCommon";
import { OptType } from "open-im-sdk-wasm/lib/types/enum";
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

  const updateConversationRecvMsgState = async (
    flag: boolean,
    opt: OptType
  ) => {
    switchLoading.recvMsgLoading = true;
    try {
      await IMSDK.setConversationRecvMessageOpt({
        conversationIDList: [
          conversationStore.storeCurrentConversation.conversationID,
        ],
        opt: flag ? opt : OptType.Nomal,
      });
    } catch (error) {}
    switchLoading.recvMsgLoading = false;
  };

  const updateConversationPrivateState = async () => {
    switchLoading.privateLoading = true;
    try {
      await IMSDK.setOneConversationPrivateChat({
        conversationID:
          conversationStore.storeCurrentConversation.conversationID,
        isPrivate: !conversationStore.storeCurrentConversation.isPrivateChat,
      });
    } catch (error) {}
    switchLoading.privateLoading = false;
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
          const funcName = conversationStore.storeCurrentConversation.groupID
            ? "clearGroupHistoryMessageFromLocalAndSvr"
            : "clearC2CHistoryMessageFromLocalAndSvr";
          IMSDK[funcName](
            conversationStore.storeCurrentConversation.groupID ||
              conversationStore.storeCurrentConversation.userID
          )
            .then(() => {
                messageStore.clearHistoryMessage();
                feedbackToast()
            })
            .catch((error) => feedbackToast({error}))
            .finally(() => resolve(true));
        });
      },
    }).catch(() => {});
  };

  return {
    conversationStore,
    switchLoading,
    updateConversationPinState,
    updateConversationRecvMsgState,
    updateConversationPrivateState,
    clearLogs
  };
}
