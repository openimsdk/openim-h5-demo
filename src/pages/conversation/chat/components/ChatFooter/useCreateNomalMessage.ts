import useConversationStore from '@/store/modules/conversation'
import { feedbackToast } from '@/utils/common'
import { IMSDK, getCleanText } from '@/utils/imCommon'
import type { MessageItem } from '@openim/wasm-client-sdk/lib/types/entity'
import { FaceMessageParams } from '@openim/wasm-client-sdk/lib/types/params'
import { Ref } from 'vue'

type CreateNomalMessageProps = {
  messageContent: Ref<string>
}

const conversationStore = useConversationStore()

export default function useCreateNomalMessage({
  messageContent,
}: CreateNomalMessageProps) {
  const getCleanTextWithBr = () => {
    let text = messageContent.value
    text = text.replace(/<div>/g, '\n').replace(/<\/div>/g, '')
    return getCleanText(text)
  }

  const getAtList = () => {
    const atels = Array.from(document.getElementsByClassName('at_el'))
    return atels.map((at) => ({
      userID: at.attributes.getNamedItem('data_id')?.value,
      nickname: at.attributes.getNamedItem('data_name')?.value,
      tag: at.outerHTML,
    }))
  }

  const parseAtUser = (text: string) => {
    const atUserList = getAtList()
    atUserList.forEach((user) => {
      text = text.replace(user.nickname as string, `${user.userID} `)
    })
    return text
  }

  const getTextMessage = async () => {
    const formattedText = getCleanTextWithBr()
    console.log(formattedText)

    return (await IMSDK.createTextMessage(formattedText)).data
  }

  type AtTextMessageOptions = {
    text: string
    atUserIDList: string[]
    atUsersInfo: { groupNickname: string; atUserID: string }[]
    message?: MessageItem
  }

  const getAtTextMessage = async () => {
    const formattedText = parseAtUser(getCleanTextWithBr())
    const atList = getAtList()

    const options: AtTextMessageOptions = {
      text: formattedText,
      atUserIDList: atList.map((item) => item.userID!),
      atUsersInfo: atList.map((item) => ({
        groupNickname: item.nickname!,
        atUserID: item.userID!,
      })),
    }

    if (conversationStore.storeQuoteMessage) {
      options.message = conversationStore.storeQuoteMessage
    }

    return (await IMSDK.createTextAtMessage(options)).data
  }

  const getFaceMessage = async (params: FaceMessageParams) => {
    return (await IMSDK.createFaceMessage(params)).data
  }

  const getReplyMessage = async () => {
    const formattedText = parseAtUser(getCleanTextWithBr())
    const options = {
      text: formattedText,
      message: JSON.stringify(conversationStore.storeQuoteMessage),
    }
    return (await IMSDK.createQuoteMessage(options)).data
  }

  const switchNomalMessage = async () => {
    let message
    if (getAtList().length > 0) {
      message = (await getAtTextMessage()) as MessageItem
    } else if (conversationStore.storeQuoteMessage) {
      message = (await getReplyMessage()) as MessageItem
    } else {
      message = (await getTextMessage()) as MessageItem
    }
    if (!message) {
      feedbackToast({
        error: 'create message failed',
        message: 'create message failed',
      })
      return
    }
    return message
  }

  return {
    getAtList,
    switchNomalMessage,
    getCleanText,
  }
}
