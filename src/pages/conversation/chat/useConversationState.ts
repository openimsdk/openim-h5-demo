import { GroupSessionTypes } from "@/constants/enum";
import useConversationStore from "@/store/modules/conversation";
import useMessageStore from "@/store/modules/message";
import emitter from "@/utils/events";
import { IMSDK } from "@/utils/imCommon";
import { ConversationItem } from "@/utils/open-im-sdk-wasm/types/entity";
import { GroupAtType } from "@/utils/open-im-sdk-wasm/types/enum";
import { onBeforeRouteLeave } from "vue-router";

export default function useConversationState() {
  const conversationStore = useConversationStore();

  // group info
  const getCurrentGroupInfo = () => {
    if (
      GroupSessionTypes.includes(
        conversationStore.storeCurrentConversation.conversationType
      )
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
      conversationStore.updateQuoteMessage();
    }
    next();
  });

}
