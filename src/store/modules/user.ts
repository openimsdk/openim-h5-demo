import { IMSDK } from "@/utils/imCommon";
import { FullUserItem } from "open-im-sdk-wasm/lib/types/entity";
import { MessageReceiveOptType } from "open-im-sdk-wasm/lib/types/enum";
import { defineStore } from "pinia";
import store from "../index";
import { BusinessUserInfo } from "@/api/data";
import { getAppConfig, getBusinessInfo } from "@/api/user";
import { feedbackToast, filterEmptyValue } from "@/utils/common";

export type FullSelfInfo = FullUserItem & {
  globalRecvMsgOpt?: MessageReceiveOptType;
} & BusinessUserInfo;

interface StateType {
  selfInfo: FullSelfInfo;
  isSyncing: boolean;
  appConfig: AppConfig;
}

export interface AppConfig {
  discoverPageURL: string;
  ordinaryUserAddFriend: number;
  bossUserID: string;
  adminURL: string;
  allowSendMsgNotFriend: number;
  needInvitationCodeRegister: number;
}

const useStore = defineStore("user", {
  state: (): StateType => ({
    selfInfo: {} as FullSelfInfo,
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
        const { data } = await IMSDK.getSelfUserInfo();
        const res = await getBusinessInfo(data.userID);
        const businessData = res.data.users[0] ?? {};
        filterEmptyValue(businessData);
        this.selfInfo = {
          ...data,
          ...businessData,
        };
      } catch (error) {
        feedbackToast({ error, message: "获取个人信息失败" });
      }
    },
    updateSelfInfo(info: FullSelfInfo) {
      this.selfInfo = { ...info };
    },
    async getAppConfigFromReq() {
      try {
        const { data } = await getAppConfig();
        this.appConfig = data;
      } catch (error) {}
    },
  },
});

export default function useUserStore() {
  return useStore(store);
}
