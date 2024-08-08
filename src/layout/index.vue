<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 overflow-hidden">
      <router-view v-slot="{ Component }">
        <transition>
          <keep-alive include="profile,contact,conversation">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
    <tabbar></tabbar>
  </div>
</template>

<script setup lang='ts' name="tabbar">
import Tabbar from './Tabbar.vue'
import useConversationStore from "@/store/modules/conversation";
import { AllowType, LoginStatus } from "@openim/wasm-client-sdk";
import useContactStore from "@/store/modules/contact";
import { useGlobalEvent } from './useGlobalEvent';
import { getIMToken, getIMUserID } from "@/utils/storage";
import { IMSDK, initStore } from "@/utils/imCommon";

useGlobalEvent()
const router = useRouter();

onMounted(() => {
  loginCheck();
})

router.beforeEach(async (to, from, next) => {
  if (from.path === '/login') {
    const { data } = await IMSDK.getLoginStatus()
    if (data === LoginStatus.Logout) {
      loginCheck();
    }
  }
  next();
});

const loginCheck = () => {
  const IMToken = getIMToken()
  const IMUserID = getIMUserID()
  if (!IMToken || !IMUserID) {
    router.push('/login');
    return;
  }
  tryLogin();
};

const tryLogin = async () => {
  const IMToken = getIMToken();
  const IMUserID = getIMUserID();
  try {
    await IMSDK.login({
      userID: IMUserID!,
      token: IMToken!,
      apiAddr: process.env.API_URL!,
      wsAddr: process.env.WS_URL!,
      platformID: 5,
    })
    initStore();
  } catch (error) {
    router.push('/login');
  }
}

window.userClick = (userID?: string, groupID?: string) => {
  const conversationStore = useConversationStore();
  const contactStore = useContactStore()
  if (!userID || userID === "AtAllTag") return;

  const currentGroupInfo = conversationStore.currentGroupInfo;

  if (groupID && currentGroupInfo?.lookMemberInfo === AllowType.NotAllowed) {
    return;
  }

  contactStore.getUserCardData(userID, groupID)
};
</script>

<style lang='scss' scoped></style>