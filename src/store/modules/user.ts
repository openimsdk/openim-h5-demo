import { IMSDK } from "@/utils/imCommon";
import { FullUserItem } from "@/utils/open-im-sdk-wasm/types/entity";
import { MessageReceiveOptType } from "@/utils/open-im-sdk-wasm/types/enum";
import { defineStore } from "pinia";
import store from "../index";
import { BusinessUserInfo } from "@/api/data";
import { getAppConfig, getBusinessInfo } from "@/api/user";
import { feedbackToast, filterEmptyValue } from "@/utils/common";
import { clearIMProfile } from "@/utils/storage";
import useContactStore from "./contact";
import useConversationStore from "./conversation";
import { i18nt } from "@/i18n";

export type FullSelfInfo = FullUserItem & {
  globalRecvMsgOpt?: MessageReceiveOptType;
} & BusinessUserInfo;

interface StateType {
  selfInfo: BusinessUserInfo;
  isSyncing: boolean;
  appConfig: AppConfig;
}

export interface AppConfig {
  discoverPageURL: string;
  ordinaryUserAddFriend: number;
  bossUserID: string;
  adminURL: string;
  allowSendMsgNotFriend: string;
  needInvitationCodeRegister: string;
}

const useStore = defineStore("user", {
  state: (): StateType => ({
    selfInfo: {} as BusinessUserInfo,
    isSyncing: false,
    appConfig: {} as AppConfig,
  }),
  getters: {
    storeSelfInfo: (state) => state.selfInfo,
    storeIsSyncing: (state) => state.isSyncing,
    storeAppConfig: (state) => state.appConfig,
  },
  actions: {
    async getSelfInfoFromReq() {
      try {
        const { data } = await IMSDK.getSelfUserInfo<BusinessUserInfo>();
        const res = await getBusinessInfo(data.userID);
        const businessData = res.data.users[0] ?? {};
        filterEmptyValue(businessData as any);
        this.selfInfo = {
          ...data,
          ...businessData,
        };
      } catch (error) {
        feedbackToast({ error, message: i18nt("messageTip.getUserInfoFailed") });
        this.userLogout();
      }
    },
    updateSelfInfo(info: Partial<BusinessUserInfo>) {
      this.selfInfo = { ...this.selfInfo, ...info };
    },
    async getAppConfigFromReq() {
      try {
        const { data } = await getAppConfig();
        this.appConfig = data.config;
      } catch (error) {}
    },
    async userLogout(force?: boolean) {
      const useConversatione = useConversationStore();
      const useContact = useContactStore();

      if (!force) await IMSDK.logout();
      clearIMProfile();
      this.selfInfo = {} as BusinessUserInfo;
      useConversatione.clearConversationStore();
      useContact.clearContactStore();
    },
  },
});

export default function useUserStore() {
  return useStore(store);
}
