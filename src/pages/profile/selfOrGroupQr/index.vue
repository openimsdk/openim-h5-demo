<template>
  <div class="page_container">
    <NavBar class="shadow-md" :title="title" />

    <div class="mx-6 mt-14 px-9 pt-9 pb-20 shadow-md rounded-md bg-white flex flex-col items-center">
      <div class="flex items-center w-full">
        <Avatar :src="faceURL" :desc="showName" :is-group="isGroup" :size="48" />
        <div class="ml-4 max-w-[200px] truncate text-[#333]">{{ showName }}</div>
      </div>

      <div class="mt-12 mb-8 text-sm text-[#999]">{{ tip }}</div>

      <div class="w-[180px] h-[180px] flex justify-center items-center border-4 border-solid border-[#E8EAEF]">
        <canvas ref="canvas" width="140" height="140"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
// @ts-ignore
import UQRCode from 'uqrcodejs';
import Avatar from '@/components/Avatar/index.vue';
import { AddFriendQrCodePrefix, AddGroupQrCodePrefix } from '@/utils/imCommon';
import useUserStore from '@/store/modules/user';
import useConversationStore from '@/store/modules/conversation';

const emit = defineEmits([]);
const props = defineProps<{ isGroup?: boolean }>();

const {t} = useI18n()
const userStore = useUserStore()
const conversationStore = useConversationStore();

const canvas = ref()
const showName = computed(() => props.isGroup ? conversationStore.storeCurrentGroupInfo.groupName : userStore.storeSelfInfo.nickname)
const faceURL = computed(() => props.isGroup ? conversationStore.storeCurrentGroupInfo.faceURL : userStore.storeSelfInfo.faceURL)

const title = props.isGroup ? t("groupQrCode") : t("qrCode")
const tip = props.isGroup ? t("messageTip.scanGroupQrCodeTip") : t("messageTip.scanQrCodeTip")

onMounted(() => {
  let qrData = AddFriendQrCodePrefix + userStore.storeSelfInfo.userID
  if (props.isGroup) {
    qrData = AddGroupQrCodePrefix + conversationStore.storeCurrentGroupInfo.groupID
  }
  const qr = new UQRCode();
  qr.data = qrData;
  qr.size = 140;
  qr.make();
  const canvasContext = canvas.value.getContext("2d");
  qr.canvasContext = canvasContext;
  qr.drawCanvas();
})

</script>

<style lang='scss' scoped></style>