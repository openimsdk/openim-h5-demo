import { IMSDK } from '@/utils/imCommon'
import type { FriendUserItem } from '@openim/wasm-client-sdk/lib/types/entity'
import { MessageReceiveOptType } from '@openim/wasm-client-sdk'
import { defineStore } from 'pinia'
import store from '../index'
import { BusinessUserInfo } from '@/api/data'
import { getBusinessInfo } from '@/api/user'
import { feedbackToast, filterEmptyValue } from '@/utils/common'
import { clearIMProfile } from '@/utils/storage'
import useContactStore from './contact'
import useConversationStore from './conversation'
import { i18nt } from '@/i18n'

export type FullSelfInfo = FriendUserItem & {
  globalRecvMsgOpt?: MessageReceiveOptType
} & BusinessUserInfo

interface StateType {
  selfInfo: BusinessUserInfo
  isSyncing: boolean
  reinstall: boolean
  progress: number
}

const useStore = defineStore('user', {
  state: (): StateType => ({
    selfInfo: {} as BusinessUserInfo,
    isSyncing: false,
    reinstall: false,
    progress: 0,
  }),
  getters: {
    storeSelfInfo: (state) => state.selfInfo,
    storeIsSyncing: (state) => state.isSyncing,
    storeReinstall: (state) => state.reinstall,
    storeProgress: (state) => state.progress,
  },
  actions: {
    async getSelfInfoFromReq() {
      try {
        const { data } = await IMSDK.getSelfUserInfo()
        const res = await getBusinessInfo(data.userID)
        const businessData = res.data.users[0] ?? {}
        filterEmptyValue(businessData as any)
        this.selfInfo = {
          ...data,
          ...businessData,
        }
      } catch (error) {
        feedbackToast({ error, message: i18nt('messageTip.getUserInfoFailed') })
        this.userLogout()
      }
    },
    updateSelfInfo(info: Partial<BusinessUserInfo>) {
      this.selfInfo = { ...this.selfInfo, ...info }
    },
    async userLogout(force?: boolean) {
      const useConversatione = useConversationStore()
      const useContact = useContactStore()

      if (!force) await IMSDK.logout()
      clearIMProfile()
      this.selfInfo = {} as BusinessUserInfo
      useConversatione.clearConversationStore()
      useContact.clearContactStore()
    },
  },
})

export default function useUserStore() {
  return useStore(store)
}
