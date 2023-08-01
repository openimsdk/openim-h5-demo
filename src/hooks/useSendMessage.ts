import { FileMessageTypes } from "@/constants/enum";
import useConversationStore from "@/store/modules/conversation";
import useMessageStore from "@/store/modules/message";
import useUserStore from "@/store/modules/user";
import emitter from "@/utils/events";
import { IMSDK } from "@/utils/imCommon";
import {
  MessageItem,
  PublicUserItem,
} from "@/utils/open-im-sdk-wasm/types/entity";
import {
  MessageStatus,
  SessionType,
} from "@/utils/open-im-sdk-wasm/types/enum";
import { SendMsgParams } from "@/utils/open-im-sdk-wasm/types/params";

const messageStore = useMessageStore();
const conversationStore = useConversationStore();
const userStore = useUserStore();

type SendMessageParams = Partial<Omit<SendMsgParams, "message">> & {
  message: MessageItem;
  needOpreateMessage?: boolean;
};

export default function useSendMessage() {
  const sendMessage = async ({
    recvID,
    groupID,
    message,
    needOpreateMessage,
  }: SendMessageParams) => {
    needOpreateMessage =
      needOpreateMessage ?? inCurrentConversation(recvID || groupID);

    if (needOpreateMessage) {
      messageStore.pushNewMessage(message);
      emitter.emit("CHAT_MAIN_SCROLL_TO_BOTTOM", false);
    }

    const options = {
      recvID: recvID ?? conversationStore.storeCurrentConversation.userID ?? "",
      groupID:
        groupID ?? conversationStore.storeCurrentConversation.groupID ?? "",
      message,
    };
    try {
      // @ts-ignore
      const { data: successMessage } = await IMSDK.sendMessage(options);
      messageStore.updateOneMessage(successMessage, true);
    } catch (error) {
      console.error(error);

      messageStore.updateOneMessage({
        ...message,
        status: MessageStatus.Failed,
      });
    }
  };

  const inCurrentConversation = (sourceID?: string) =>
    sourceID
      ? conversationStore.storeCurrentConversation.userID === sourceID ||
        conversationStore.storeCurrentConversation.groupID === sourceID
      : true;

  return {
    sendMessage,
  };
}
