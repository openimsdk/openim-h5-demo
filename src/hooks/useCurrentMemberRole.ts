import useConversationStore from '@/store/modules/conversation'
import { GroupMemberRole } from '@openim/wasm-client-sdk'

export default function useCurrentMemberRole(groupID?: string) {
  const conversationStore = useConversationStore()

  const currentRole = computed(
    () => conversationStore.storeCurrentMemberInGroup?.roleLevel,
  )

  const isOwner = computed(
    () => inSameGroup.value && currentRole.value === GroupMemberRole.Owner,
  )

  const isAdmin = computed(
    () => inSameGroup.value && currentRole.value === GroupMemberRole.Admin,
  )

  const isNomal = computed(
    () => inSameGroup.value && currentRole.value === GroupMemberRole.Normal,
  )

  const inSameGroup = computed(() => {
    const isCurrentGroup =
      conversationStore.storeCurrentMemberInGroup?.groupID ===
      (groupID ?? conversationStore.storeCurrentGroupInfo.groupID)

    return Boolean(isCurrentGroup && currentRole.value)
  })

  return {
    isOwner,
    isAdmin,
    isNomal,
    inSameGroup,
    currentRole,
  }
}
