import useUserStore from '@/store/modules/user'
import useConversationStore from '@/store/modules/conversation'
import { v4 as uuidV4 } from 'uuid'
import { SessionType } from '@openim/wasm-client-sdk'
import emitter from '@/utils/events'

export const useInviteRtc = () => {
  const userStore = useUserStore()
  const conversationStore = useConversationStore()

  enum ChatFooterActionType {
    Album,
    RtcCall,
    VoiceCall,
    VideoCall,
  }

  const inviteRtc = async (type: ChatFooterActionType, userIDList: string[]) => {
    const mediaType = type === ChatFooterActionType.VoiceCall ? 'audio' : 'video'

    emitter.emit('OPEN_RTC_MODAL', {
      invitation: {
        inviterUserID: userStore.selfInfo.userID,
        inviteeUserIDList: userIDList,
        groupID: '',
        roomID: uuidV4(),
        timeout: 60,
        mediaType,
        sessionType: SessionType.Single,
        platformID: 5,
      },
      participant: {
        userInfo: {
          nickname: conversationStore.currentConversation.showName,
          userID: conversationStore.currentConversation.userID,
          faceURL: conversationStore.currentConversation.faceURL,
          ex: '',
        },
      },
    })
  }

  return {
    inviteRtc,
  }
}
