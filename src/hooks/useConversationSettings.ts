import useConversationStore from '@/store/modules/conversation'

export default function useConversationSettings() {
  const conversationStore = useConversationStore()

  return {
    conversationStore,
  }
}
