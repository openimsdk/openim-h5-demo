import useConversationStore from '@/store/modules/conversation'
import { IMSDK } from '@/utils/imCommon'
import { GroupMemberRole } from '@openim/wasm-client-sdk'

export default function useCurrentMemberRole(groupID?: string) {
  const inSameGroup = ref(false)
  const conversationStore = useConversationStore()

  const id = computed(
    () => groupID || conversationStore.storeCurrentConversation.groupID,
  )

  const currentRole = computed(
    () => conversationStore.storeCurrentMemberInGroup.roleLevel,
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

  const checkGroupMembership = async () => {
    if (!id.value) return

    const { data } = await IMSDK.isJoinGroup<boolean>(id.value)
    inSameGroup.value = data
  }

  watch(
    () => conversationStore.currentConversation.conversationID,
    () => checkGroupMembership(),
    {
      immediate: true,
    },
  )

  onMounted(() => {
    checkGroupMembership()
  })

  return {
    isOwner,
    isAdmin,
    isNomal,
    inSameGroup,
    currentRole,
  }
}
