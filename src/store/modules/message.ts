import { feedbackToast } from "@utils/common";
import { IMSDK } from "@/utils/imCommon";
import { MessageItem } from "open-im-sdk-wasm/lib/types/entity";
import { GetAdvancedHistoryMsgParams } from "open-im-sdk-wasm/lib/types/params";
import { defineStore } from "pinia";
import store from "../index";

interface StateType {
  historyMessageList: ExMessageItem[];
  hasMore: boolean;
}

type ExType = {
  checked?: boolean;
  isAppend?: boolean;
  jump?: boolean;
};

type GetHistoryMessageListFromReqResp = {
  messageIDList: string[];
  lastMinSeq: number;
};

export type ExMessageItem = MessageItem & ExType;

const useStore = defineStore("message", {
  state: (): StateType => ({
    historyMessageList: [],
    hasMore: true,
  }),
  getters: {
    storeHistoryMessageList: (state) => state.historyMessageList,
    storeHistoryMessageHasMore: (state) => state.hasMore,
  },
  actions: {
    async getHistoryMessageListFromReq(
      params: GetAdvancedHistoryMsgParams
    ): Promise<GetHistoryMessageListFromReqResp> {
      const isFirstPage =
        params.startClientMsgID === "" || params.lastMinSeq === 0;
      try {
        const { data: tmpData } = await IMSDK.getAdvancedHistoryMessageList(
          params
        );
        this.historyMessageList = [
          ...tmpData.messageList,
          ...(isFirstPage ? [] : this.historyMessageList),
        ];
        this.hasMore = !tmpData.isEnd && tmpData.messageList.length === 20;
        return {
          messageIDList: tmpData.messageList.map(
            (message: MessageItem) => message.clientMsgID
          ),
          lastMinSeq: tmpData.lastMinSeq,
        };
      } catch (error) {
        feedbackToast({ message: "Get history message failed", error });
        this.hasMore = false;
        return {
          messageIDList: [],
          lastMinSeq: 0,
        };
      }
    },
    pushNewMessage(message: MessageItem) {
      this.historyMessageList.push(message);
    },
    updateOneMessage(message: ExMessageItem, isSuccessCallBack = false) {
      const idx = this.historyMessageList.findIndex(
        (msg) => msg.clientMsgID === message.clientMsgID
      );
      if (idx !== -1) {
        this.historyMessageList[idx] = {
          ...this.historyMessageList[idx],
          ...message,
        };
      }
    },
    deleteOneMessage(message: ExMessageItem) {
      const idx = this.historyMessageList.findIndex(
        (msg) => msg.clientMsgID === message.clientMsgID
      );
      if (idx !== -1) {
        this.historyMessageList.splice(idx, 1);
      }
    },
    clearHistoryMessage() {
      this.historyMessageList = [];
    },
    resetCheckState() {
      this.historyMessageList.forEach((message) => (message.checked = false));
    },
    resetHistoryMessageList() {
      this.historyMessageList = [];
      this.hasMore = true;
    },
  },
});

export default function useMessageStore() {
  return useStore(store);
}
