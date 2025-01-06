import useConversationStore from '@/store/modules/conversation'
import { feedbackToast } from '@/utils/common'
import { IMSDK } from '@/utils/imCommon'
import type { ConversationItem } from '@openim/wasm-client-sdk/lib/types/entity'
import { SessionType } from '@openim/wasm-client-sdk'

export default function useConversationToggle() {
  const router = useRouter()
  const conversationStore = useConversationStore()

  const getConversation = async ({
    sourceID,
    sessionType,
  }: {
    sourceID: string
    sessionType: SessionType
  }): Promise<ConversationItem | undefined> => {
    let conversation = conversationStore.conversationList.find(
      (item) => item.userID === sourceID || item.groupID === sourceID,
    )
    if (!conversation) {
      try {
        conversation = (
          await IMSDK.getOneConversation({
            sourceID,
            sessionType,
          })
        ).data
      } catch (error) {
        feedbackToast({ error })
      }
    }
    return conversation
  }

  const toSpecifiedConversation = async (data: {
    sourceID: string
    sessionType: SessionType
  }) => {
    const conversation = await getConversation(data)
    if (!conversation) return
    conversationStore.updateCurrentConversation({ ...conversation })
    router.push('chat')
  }

  return {
    toSpecifiedConversation,
  }
}
