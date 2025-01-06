import { feedbackToast } from '@utils/common'
import { IMSDK } from '@/utils/imCommon'
import type { MessageItem } from '@openim/wasm-client-sdk/lib/types/entity'
import { MessageType } from '@openim/wasm-client-sdk'
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
  lastMinSeq: number
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
      const isFirstPage = params.startClientMsgID === '' || params.lastMinSeq === 0
      try {
        const { data: tmpData } = await IMSDK.getAdvancedHistoryMessageList(params)
        this.historyMessageList = [
          ...tmpData.messageList,
          ...(isFirstPage ? [] : this.historyMessageList),
        ]
        const imageUrls = filterPreviewImage(tmpData.messageList) as string[]
        this.hasMore = tmpData.messageList.length !== 0
        // console.log(this.historyMessageList);
        return {
          messageIDList: tmpData.messageList.map(
            (message: MessageItem) => message.clientMsgID,
          ),
          lastMinSeq: tmpData.lastMinSeq,
        }
      } catch (error) {
        feedbackToast({ message: 'Get history message failed', error })
        this.hasMore = false
        return {
          messageIDList: [],
          lastMinSeq: 0,
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
    deleteOneMessage(message: ExMessageItem) {
      const idx = this.historyMessageList.findIndex(
        (msg) => msg.clientMsgID === message.clientMsgID,
      )
      if (idx !== -1) {
        this.historyMessageList.splice(idx, 1)
      }
    },
    clearHistoryMessage() {
      this.historyMessageList = []
    },
    resetCheckState() {
      this.historyMessageList.forEach((message) => (message.checked = false))
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
    updateQuoteMessageRevoke(clientMsgID: string) {
      this.historyMessageList.map((message) => {
        if (
          message.contentType === MessageType.QuoteMessage &&
          clientMsgID === message.quoteElem?.quoteMessage.clientMsgID
        ) {
          const newMessage = {
            ...message,
            quoteElem: {
              ...message.quoteElem,
              quoteMessage: {
                ...message.quoteElem?.quoteMessage,
                contentType: 2101,
              },
            },
          }
          this.updateOneMessage(newMessage)
        }
      })
    },
  },
})

function filterPreviewImage(messages: MessageItem[]) {
  return messages
    .filter((message) => {
      if (message.contentType === MessageType.PictureMessage) {
        return true
      }
      if (message.contentType === MessageType.OANotification) {
        let notificationData = {} as any
        try {
          notificationData = JSON.parse(message.notificationElem?.detail!)
        } catch (error) {}
        return false
      }
      return false
    })
    .map((item) => item.pictureElem?.sourcePicture.url)
}

export default function useMessageStore() {
  return useStore(store)
}
