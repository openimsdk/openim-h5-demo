import { feedbackToast } from '@utils/common'
import { IMSDK } from '@/utils/imCommon'
import type { MessageItem } from '@openim/wasm-client-sdk/lib/types/entity'
import { GetAdvancedHistoryMsgParams } from '@openim/wasm-client-sdk/lib/types/params'
import { defineStore } from 'pinia'
import store from '../index'

interface StateType {
  historyMessageList: ExMessageItem[]
  hasMore: boolean
}

type ExType = {
  checked?: boolean
  isAppend?: boolean
  jump?: boolean
}

type GetHistoryMessageListFromReqResp = {
  messageIDList: string[]
}

export type ExMessageItem = MessageItem & ExType

const useStore = defineStore('message', {
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
      params: GetAdvancedHistoryMsgParams,
    ): Promise<GetHistoryMessageListFromReqResp> {
      const isFirstPage = params.startClientMsgID === ''
      try {
        const { data: tmpData } = await IMSDK.getAdvancedHistoryMessageList(params)
        this.historyMessageList = [
          ...tmpData.messageList,
          ...(isFirstPage ? [] : this.historyMessageList),
        ]
        this.hasMore = tmpData.messageList.length !== 0
        // console.log(this.historyMessageList);
        return {
          messageIDList: tmpData.messageList.map(
            (message: MessageItem) => message.clientMsgID,
          ),
        }
      } catch (error) {
        feedbackToast({ message: 'Get history message failed', error })
        this.hasMore = false
        return {
          messageIDList: [],
        }
      }
    },
    pushNewMessage(message: MessageItem) {
      this.historyMessageList.push(message)
    },
    updateOneMessage(message: ExMessageItem, isSuccessCallBack = false) {
      const idx = this.historyMessageList.findIndex(
        (msg) => msg.clientMsgID === message.clientMsgID,
      )
      if (idx !== -1) {
        this.historyMessageList[idx] = {
          ...this.historyMessageList[idx],
          ...message,
        }
      }
    },
    resetHistoryMessageList() {
      this.historyMessageList = []
      this.hasMore = true
    },
    updateMessageNicknameAndFaceUrl({
      sendID,
      senderFaceUrl,
      senderNickname,
    }: {
      sendID: string
      senderFaceUrl: string
      senderNickname: string
    }) {
      const tmpList = [...this.historyMessageList].map((message) => {
        if (message.sendID === sendID) {
          message.senderFaceUrl = senderFaceUrl
          message.senderNickname = senderNickname
        }
        return message
      })
      this.historyMessageList = tmpList
    },
  },
})

export default function useMessageStore() {
  return useStore(store)
}
