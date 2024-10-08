<template>
  <rtc-modal v-if="showRtcModal" :inviteData="inviteData"></rtc-modal>
</template>

<script setup lang="ts">
import { getBusinessInfo } from "@/api/user";
import { CustomType } from "@/constants/enum";
import { InviteData, ParticipantInfo } from "@/pages/rtc/data";
import rtcModal from "@/pages/rtc/index.vue";
import emitter from "@/utils/events";
import { IMSDK } from "@/utils/imCommon";
import { CbEvents, MessageType } from "@openim/wasm-client-sdk";
import type {
  MessageItem,
  RtcInvite,
  WSEvent,
} from "@openim/wasm-client-sdk/lib/types/entity";

const showRtcModal = ref(false);
const inviteData = reactive<InviteData>({});

const openRtcModalHandler = (data: InviteData) => {
  if (showRtcModal.value) return;
  inviteData.invitation = data.invitation;
  inviteData.participant = data.participant;
  inviteData.isJoin = data.isJoin;
  showRtcModal.value = true;
};

const closeRtcModalHandler = () => {
  showRtcModal.value = false;
};

const newMessageHandler = ({ data }: WSEvent<MessageItem[]>) => {
  if (showRtcModal.value) return;
  let rtcInvite = undefined as undefined | RtcInvite;
  data.map((message) => {
    if (message.contentType === MessageType.CustomMessage) {
      const customData = JSON.parse(message.customElem!.data);
      if (customData.customType === CustomType.CallingInvite) {
        rtcInvite = customData.data;
      }
    }
  });
  if (rtcInvite) {
    getBusinessInfo(rtcInvite.inviterUserID).then(({ data: { users } }) => {
      if (users.length === 0) return;
      inviteData.invitation = rtcInvite;
      inviteData.participant = {
        userInfo: {
          nickname: users[0].nickname,
          faceURL: users[0].faceURL,
          userID: users[0].userID,
          ex: "",
        },
      };
      showRtcModal.value = true;
    });
  }
};

onMounted(() => {
  IMSDK.on(CbEvents.OnRecvNewMessages, newMessageHandler);
  emitter.on("OPEN_RTC_MODAL", openRtcModalHandler);
  emitter.on("CLOSE_RTC_MODAL", closeRtcModalHandler);
});

onUnmounted(() => {
  IMSDK.off(CbEvents.OnRecvNewMessages, newMessageHandler);
  emitter.off("OPEN_RTC_MODAL", openRtcModalHandler);
  emitter.off("CLOSE_RTC_MODAL", closeRtcModalHandler);
});
</script>

<style lang="scss" scoped></style>
