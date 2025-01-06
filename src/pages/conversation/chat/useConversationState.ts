import { GroupSessionTypes } from '@/constants/enum'
import useConversationStore from '@/store/modules/conversation'
import useMessageStore from '@/store/modules/message'
import { IMSDK } from '@/utils/imCommon'
import type { ConversationItem } from '@openim/wasm-client-sdk/lib/types/entity'
import { GroupAtType } from '@openim/wasm-client-sdk'
import { onBeforeRouteLeave } from 'vue-router'
import { useThrottleFn } from '@vueuse/core'

export default function useConversationState() {
  const conversationStore = useConversationStore()
  const messageStore = useMessageStore()

  const multipleCheckVisible = ref(false)

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
    if (
      conversationStore.storeCurrentConversation.groupAtType !== GroupAtType.AtNormal &&
      conversationStore.storeCurrentConversation.groupAtType !==
        GroupAtType.AtGroupNotice
    ) {
      IMSDK.resetConversationGroupAtType(
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
        multipleCheckVisible.value = false
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
    if (multipleCheckVisible.value && to.name !== 'ChooseUser') {
      multipleCheckVisible.value = false
      messageStore.resetCheckState()
      next(false)
      return
    }
    if (to.name === 'Conversation') {
      checkConversationState()
      conversationStore.updateCurrentConversation({} as ConversationItem)
      conversationStore.updateQuoteMessage()
    }
    next()
  })

  return {
    multipleCheckVisible,
  }
}
