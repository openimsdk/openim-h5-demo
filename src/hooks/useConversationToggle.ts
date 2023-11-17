import useConversationStore from "@/store/modules/conversation";
import { feedbackToast } from "@/utils/common";
import { IMSDK } from "@/utils/imCommon";
import { ConversationItem } from "@/utils/open-im-sdk-wasm/types/entity";
import { SessionType } from "@/utils/open-im-sdk-wasm/types/enum";

export default function useConversationToggle() {
  const router = useRouter();
  const conversationStore = useConversationStore();

  const getConversation = async ({
    sourceID,
    sessionType,
  }: {
    sourceID: string;
    sessionType: SessionType;
  }): Promise<ConversationItem | undefined> => {
    let conversation = conversationStore.conversationList.find(
      (item) => item.userID === sourceID || item.groupID === sourceID
    );
    if (!conversation) {
      try {
        conversation = (
          await IMSDK.getOneConversation<ConversationItem>({
            sourceID,
            sessionType,
          })
        ).data;
      } catch (error) {
        feedbackToast({ error });
      }
    }
    return conversation;
  };

  const toSpecifiedConversation = async (data: {
    sourceID: string;
    sessionType: SessionType;
  }) => {
    const conversation = await getConversation(data);
    if (
      !conversation ||
      conversationStore.currentConversation.conversationID ===
        conversation.conversationID
    )
      return;
    conversationStore.updateCurrentConversation({ ...conversation });
    router.push("chat");
  };

  return {
    toSpecifiedConversation,
  };
}
