<template>
  <RtcLayout
    :inviteData="inviteData"
    :authData="config"
    :connect="connect"
    :isConnected="isConnected"
    @connectRtc="connectRtc"
    :room="room!"
    :sendCustomSignal="sendCustomSignal"
  />
</template>

<script setup lang="ts">
import { useRoom } from "@/utils/open-im-rtc";
import { IMSDK } from "@/utils/imCommon";
import { InviteData } from "./data";
import useUserStore from "@/store/modules/user";
import RtcLayout from "./RtcLayout/index.vue";
import emitter from "@/utils/events";
import { feedbackToast } from "@/utils/common";
import { CustomType } from "@/constants/enum";
import { getRtcConnectData } from "@/api/im";
import { v4 as uuidV4 } from "uuid";

type RtcProps = {
  inviteData: InviteData;
};
const props = defineProps<RtcProps>();

const { t } = useI18n();
const userStore = useUserStore();

const connect = ref(false);
const isConnected = ref(false);
const config = reactive({
  serverUrl: "",
  token: "",
  connect: false,
  audio: true,
  video: props.inviteData.invitation?.mediaType === "video",
});
const isRecv = computed(
  () => userStore.selfInfo.userID !== props.inviteData.invitation?.inviterUserID
);

const room = useRoom({
  refConfig: config,
  onConnected: () => {
    isConnected.value = true;
  },
  onDisconnected: () => {
    connect.value = false;
    isConnected.value = false;
    config.connect = false;
  },
  onError: (error) => {
    console.error(error);
  },
});

const connectRtc = (data?: any) => {
  if (data) {
    config.serverUrl = data.liveURL;
    config.token = data.token;
    config.connect = true;
  }
  connect.value = true;
};

const timer = ref<NodeJS.Timeout>();
const clearTimer = () => clearTimeout(timer.value!);
const checkTimeout = () => {
  if (timer.value) clearTimer();
  timer.value = setTimeout(() => {
    clearTimer();

    if (!props.inviteData.invitation) return;

    sendCustomSignal(
      props.inviteData.invitation?.inviteeUserIDList[0],
      CustomType.CallingCancel
    );
  }, (props.inviteData.invitation?.timeout ?? 30) * 1000);
};

const tryInvite = async () => {
  if (!isRecv.value) {
    try {
      const { data } = await getRtcConnectData(
        uuidV4(),
        userStore.selfInfo.userID
      );
      config.serverUrl = data.serverUrl;
      config.token = data.token;
      config.connect = true;
      await sendCustomSignal(
        props.inviteData.invitation!.inviteeUserIDList[0],
        CustomType.CallingInvite
      );
      checkTimeout();
    } catch (error) {
      feedbackToast({ message: t("rtc.invitationFailed"), error });
      emitter.emit("CLOSE_RTC_MODAL");
    }
  }
};

const sendCustomSignal = async (recvID: string, customType: CustomType) => {
  const data = {
    customType,
    data: {
      ...props.inviteData.invitation,
    },
  };
  const { data: message } = await IMSDK.createCustomMessage({
    data: JSON.stringify(data),
    extension: "",
    description: "",
  });
  await IMSDK.sendMessage({
    recvID,
    message,
    groupID: "",
    isOnlineOnly: true,
  });
};

onMounted(() => {
  tryInvite();
});
</script>

<style lang="scss" scoped></style>
