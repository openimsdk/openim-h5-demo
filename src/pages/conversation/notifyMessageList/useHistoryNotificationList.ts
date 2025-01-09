import useConversationStore from '@/store/modules/conversation'
import useMessageStore from '@/store/modules/message'
import { ViewType } from '@openim/wasm-client-sdk'

const messageStore = useMessageStore()
const conversationStore = useConversationStore()

export default function useHistoryNotificationList() {
  const vsl = ref()
  const isFirstPage = ref(true)
  const historyNotificationInitLoading = ref(false)
  const loadState = reactive({
    loading: false,
  })

  const onToBottom = async () => {
    if (messageStore.storeHistoryMessageHasMore && !loadState.loading) {
      await getMessageData()
      loadState.loading = false
    }
  }

  const getMessageData = async () => {
    loadState.loading = true
    return await messageStore.getHistoryMessageListFromReq({
      conversationID: conversationStore.storeCurrentConversation.conversationID,
      count: 20,
      startClientMsgID: messageStore.storeHistoryMessageList[0]?.clientMsgID ?? '',
      viewType: ViewType.History
    })
  }

  const onItemRendered = () => {
    if (!vsl.value || !isFirstPage.value) {
      return
    }
    isFirstPage.value = false
  }

  const setVirtualListToTop = () => {
    if (vsl.value) {
      vsl.value.scrollToTop()
    }
  }

  watch(
    () => conversationStore.storeCurrentConversation.conversationID,
    async () => {
      isFirstPage.value = true
      messageStore.resetHistoryMessageList()
      historyNotificationInitLoading.value = true
      await getMessageData()
      historyNotificationInitLoading.value = false
    },
    {
      immediate: true,
    },
  )

  return {
    vsl,
    historyNotificationInitLoading,
    onToBottom,
    onItemRendered,
  }
}
