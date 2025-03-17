import useConversationStore from '@/store/modules/conversation'
import { feedbackToast } from '@/utils/common'
import { IMSDK, getCleanText } from '@/utils/imCommon'
import type { MessageItem } from '@openim/wasm-client-sdk/lib/types/entity'
import { FaceMessageParams } from '@openim/wasm-client-sdk/lib/types/params'
import { Ref } from 'vue'

type CreateNomalMessageProps = {
  messageContent: Ref<string>
}

export default function useCreateNomalMessage({
  messageContent,
}: CreateNomalMessageProps) {
  const getCleanTextWithBr = () => {
    let text = messageContent.value
    text = text.replace(/<div>/g, '\n').replace(/<\/div>/g, '')
    return getCleanText(text)
  }

  const getTextMessage = async () => {
    const formattedText = getCleanTextWithBr()
    console.log(formattedText)

    return (await IMSDK.createTextMessage(formattedText)).data
  }

  const switchNomalMessage = async () => {
    let message
    message = (await getTextMessage()) as MessageItem
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
    switchNomalMessage,
    getCleanText,
  }
}
