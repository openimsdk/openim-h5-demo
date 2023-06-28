import { FileMessageTypes } from "@/constants/enum";
import useConversationStore from "@/store/modules/conversation";
import useMessageStore from "@/store/modules/message";
import emitter from "@/utils/events";
import { IMSDK } from "@/utils/imCommon";
import { MessageItem } from "open-im-sdk-wasm/lib/types/entity";
import { MessageStatus } from "open-im-sdk-wasm/lib/types/enum";
import { SendMsgParams } from "open-im-sdk-wasm/lib/types/params";

const messageStore = useMessageStore();
const conversationStore = useConversationStore();

type SendMessageParams = Partial<Omit<SendMsgParams, "message">> & {
  message: MessageItem;
  needOpreateMessage?: boolean;
};

export default function useSendMessage() {
  const sendMessage = async ({
    recvID,
    groupID,
    message,
    fileArrayBuffer,
    snpFileArrayBuffer,
    needOpreateMessage,
  }: SendMessageParams) => {
    needOpreateMessage =
      needOpreateMessage ?? inCurrentConversation(recvID || groupID);

    if (needOpreateMessage) {
      messageStore.pushNewMessage(message);
      emitter.emit("CHAT_MAIN_SCROLL_TO_BOTTOM", false);
    }

    let funcName = "sendMessage";
    if (FileMessageTypes.includes(message.contentType)) {
      funcName = fileArrayBuffer ? "sendMessageByBuffer" : "sendMessageNotOss";
    }
    const options = {
      recvID: recvID ?? conversationStore.storeCurrentConversation.userID ?? "",
      groupID:
        groupID ?? conversationStore.storeCurrentConversation.groupID ?? "",
      message: JSON.stringify(message),
      fileArrayBuffer,
      snpFileArrayBuffer,
    };
    try {
      // @ts-ignore
      const { data: successMessage } = await IMSDK[funcName](options);
      messageStore.updateOneMessage(successMessage, true);
    } catch (error) {
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
