import { GroupSessionTypes } from '@/constants/enum'
import useConversationStore from '@/store/modules/conversation'
import { IMSDK } from '@/utils/imCommon'
import type { ConversationItem } from '@openim/wasm-client-sdk/lib/types/entity'
import { onBeforeRouteLeave } from 'vue-router'
import { useThrottleFn } from '@vueuse/core'

export default function useConversationState() {
  const conversationStore = useConversationStore()

  // group info
  const getCurrentGroupInfo = () => {
    if (
      GroupSessionTypes.includes(
        conversationStore.storeCurrentConversation.conversationType,
      )
    ) {
      conversationStore.getCurrentGroupInfoFromReq()
      conversationStore.getCurrentMemberInGroupFromReq()
    }
  }

  // conversation state
  const checkConversationState = useThrottleFn(() => {
    if (!conversationStore.storeCurrentConversation.conversationID) return
    if (conversationStore.storeCurrentConversation.unreadCount > 0) {
      IMSDK.markConversationMessageAsRead(
        conversationStore.storeCurrentConversation.conversationID,
      )
    }
  }, 1000)

  watch(
    () => conversationStore.storeCurrentConversation.conversationID,
    async (newVal) => {
      if (newVal) {
        getCurrentGroupInfo()
        checkConversationState()
      }
    },
    {
      immediate: true,
    },
  )

  watch(
    () => conversationStore.storeCurrentConversation.unreadCount,
    async (newVal) => {
      if (newVal) {
        checkConversationState()
      }
    },
    {
      immediate: true,
    },
  )

  onBeforeRouteLeave((to, from, next) => {
    if (to.name === 'Conversation') {
      checkConversationState()
      conversationStore.updateCurrentConversation({} as ConversationItem)
    }
    next()
  })

  return {}
}
