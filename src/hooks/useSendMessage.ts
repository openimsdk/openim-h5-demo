import { FileMessageTypes } from "@/constants/enum";
import useConversationStore from "@/store/modules/conversation";
import useMessageStore, { ExMessageItem } from "@/store/modules/message";
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
    // fileArrayBuffer,
    // snpFileArrayBuffer,
    needOpreateMessage,
  }: SendMessageParams) => {
    needOpreateMessage =
      needOpreateMessage ?? inCurrentConversation(recvID || groupID);

    if (needOpreateMessage) {
      messageStore.pushNewMessage(message);
      emitter.emit("CHAT_MAIN_SCROLL_TO_BOTTOM", false);
      updateFrequentContacts();
    }

    // let funcName = "sendMessage";
    // if (FileMessageTypes.includes(message.contentType)) {
    //   funcName = fileArrayBuffer ? "sendMessageByBuffer" : "sendMessageNotOss";
    // }
    const options = {
      recvID: recvID ?? conversationStore.storeCurrentConversation.userID ?? "",
      groupID:
        groupID ?? conversationStore.storeCurrentConversation.groupID ?? "",
      message,
      // fileArrayBuffer,
      // snpFileArrayBuffer,
    };
    try {
      // @ts-ignore
      const { data: successMessage } = await IMSDK.sendMessage(options);
      messageStore.updateOneMessage(successMessage as ExMessageItem, true);
    } catch (error) {
      console.error(error);

      messageStore.updateOneMessage({
        ...message,
        status: MessageStatus.Failed,
      });
    }
  };

  const updateFrequentContacts = () => {
    if (!conversationStore.storeCurrentConversation.userID) {
      return;
    }
    let myFrequentContacts = [];
    let totalFrequentContacts = {} as any;
    const item = {
      userID: conversationStore.storeCurrentConversation.userID,
      nickname: conversationStore.storeCurrentConversation.showName,
      faceURL: conversationStore.storeCurrentConversation.faceURL,
    };
    try {
      totalFrequentContacts = JSON.parse(
        localStorage.getItem("IMFrequentContacts_H5") || "{}"
      );
      myFrequentContacts =
        totalFrequentContacts[userStore.storeSelfInfo.userID] ?? [];
    } catch (error) {}
    const user = myFrequentContacts.find(
      (contact: PublicUserItem) => contact.userID === item.userID
    );
    if (user) return;
    myFrequentContacts.unshift({ ...item });
    totalFrequentContacts[userStore.storeSelfInfo.userID] = myFrequentContacts;
    localStorage.setItem(
      "IMFrequentContacts_H5",
      JSON.stringify(totalFrequentContacts)
    );
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
