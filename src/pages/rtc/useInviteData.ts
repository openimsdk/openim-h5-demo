import { SessionType } from '@openim/wasm-client-sdk'
import { InviteData } from './data'
import type { GroupMemberItem } from '@openim/wasm-client-sdk/lib/types/entity'
import useUserStore from '@/store/modules/user'

export default function useInviteData(inviteData: InviteData) {
  const userStore = useUserStore()

  const groupID = computed(() => inviteData?.invitation?.groupID ?? '')
  const isVideo = computed(() => inviteData?.invitation?.mediaType === 'video')
  const isGroup = computed(
    () => inviteData.invitation?.sessionType !== SessionType.Single,
  )
  const inviteeUserIDList = computed(
    () => inviteData?.invitation?.inviteeUserIDList ?? [],
  )
  const isRecv = computed(
    () => userStore.selfInfo.userID !== inviteData.invitation?.inviterUserID,
  )
  const memberInfo = computed(
    () => inviteData?.participant?.groupMemberInfo ?? ({} as GroupMemberItem),
  )

  return {
    isRecv,
    groupID,
    isVideo,
    isGroup,
    inviteeUserIDList,
    memberInfo,
  }
}
