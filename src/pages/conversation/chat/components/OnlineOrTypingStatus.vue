<template>
  <div class="flex items-center justify-center">
    <i class="w-[6px] h-[6px] mr-1 bg-[#10CC64] rounded-full inline-block"
      :class="{ 'bg-[#999]': onlineState?.status === OnlineState.Offline }" />
    <span class="text-xs text-[#999] font-normal">{{ platformToDetails(onlineState) }}</span>
  </div>
</template>

<script setup lang='ts'>
import useConversationStore from '@/store/modules/conversation';
import emitter from '@/utils/events';
import { IMSDK } from '@/utils/imCommon';
import { CbEvents } from '@/utils/open-im-sdk-wasm/constant';
import { UserOnlineState, WSEvent } from '@/utils/open-im-sdk-wasm/types/entity';
import { OnlineState, Platform } from '@/utils/open-im-sdk-wasm/types/enum';

const platformMap: Record<Platform, string> = {
  1: "iOS",
  2: "Android",
  3: "Windows",
  4: "MacOSX",
  5: "Web",
  7: "Linux",
  8: "AndroidPad",
  9: "iPad",
};

const { t } = useI18n();
const conversationStore = useConversationStore();

const userID = computed(() => conversationStore.storeCurrentConversation.userID)

const timer = ref<NodeJS.Timer | null>(null);
const onlineState = reactive<UserOnlineState>({
  platformIDs: [],
  status: 1,
  userID: userID.value
});

const platformToDetails = (state?: UserOnlineState) => {
  if (!state || state.status === OnlineState.Offline) return t("offline");
  let string = "";
  state.platformIDs?.map((platform) => { string += `${platformMap[platform]}/` });
  return `${string.slice(0, -1)}${t("online")}`;
};

const userStatusChangeHandler = ({ data }: WSEvent<UserOnlineState>) => {
  if (data.userID === userID.value) {
    onlineState.platformIDs = data.platformIDs;
    onlineState.status = data.status
  }
};


onMounted(() => {
  IMSDK.on(CbEvents.OnUserStatusChanged, userStatusChangeHandler);
  IMSDK.subscribeUsersStatus([userID.value])
    .then(({ data }) => {
      onlineState.platformIDs = data[0].platformIDs;
      onlineState.status = data[0].status
    });
})

onBeforeUnmount(() => {
  IMSDK.off(CbEvents.OnUserStatusChanged, userStatusChangeHandler);
  IMSDK.unsubscribeUsersStatus([userID.value]);
  if (timer.value) {
    clearTimeout(timer.value);
  }
})

</script>

<style lang='scss' scoped></style>