
import useConversationStore from "@/store/modules/conversation";
import { IMSDK } from "@/utils/imCommon";
import { ConversationItem } from "open-im-sdk-wasm/lib/types/entity";
import { GroupAtType, SessionType } from "open-im-sdk-wasm/lib/types/enum";
import { onBeforeRouteLeave } from "vue-router";

export default function useConversationState() {
  const conversationStore = useConversationStore();

  // group info
  const getCurrentGroupInfo = () => {
    if (
      conversationStore.storeCurrentConversation.conversationType === SessionType.WorkingGroup
    ) {
      conversationStore.getCurrentGroupInfoFromReq();
      conversationStore.getCurrentMemberInGroupFromReq();
    }
  };

  // conversation state
  const checkConversationState = () => {
    if (conversationStore.storeCurrentConversation.unreadCount > 0) {
      IMSDK.markConversationMessageAsRead(
        conversationStore.storeCurrentConversation.conversationID
      );
    }
    if (
      conversationStore.storeCurrentConversation.groupAtType !==
      GroupAtType.AtNormal
    ) {
      IMSDK.resetConversationGroupAtType(
        conversationStore.storeCurrentConversation.conversationID
      );
    }
  };

  watch(
    () => conversationStore.storeCurrentConversation.conversationID,
    async (newVal) => {
      if (newVal) {
        getCurrentGroupInfo();
        checkConversationState();
      }
    },
    {
      immediate: true,
    }
  );

  onBeforeRouteLeave((to, from, next) => {
    if (to.name === "Conversation") {
      checkConversationState();
      conversationStore.updateCurrentConversation({} as ConversationItem);
    }
    next();
  });
}
