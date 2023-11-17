<template>
  <div class="page_container">
    <NavBar :title="$t('profileMenu.accountSetting')" />

    <div class="mt-2 mx-3 rounded-md overflow-hidden">
      <DetailInfoItem arrow :lable="$t('profileMenu.blacklist')" @click="$router.push('blackList')" />
      <DetailInfoItem arrow :lable="$t('profileMenu.language')" @click="$router.push('/language')" />
    </div>

    <div class="mt-2 mx-3 rounded-md overflow-hidden">
      <DetailInfoItem arrow :lable="$t('changePassword')" @click="$router.push('/changePassword')" />
      <DetailInfoItem arrow danger :lable="$t('profileMenu.clearChatHistory')" @click="tryClearChatLogs" />
    </div>
  </div>
</template>
  
<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import DetailInfoItem from '@/components/DetailInfoItem/index.vue';
import useMessageStore from '@/store/modules/message';
import { feedbackToast } from '@/utils/common';
import { IMSDK } from '@/utils/imCommon';
import { showConfirmDialog } from 'vant';

const { t } = useI18n()
const messageStore = useMessageStore()

const tryClearChatLogs = () => {
  showConfirmDialog({
    title: t("profileMenu.clearChatHistory"),
    message: t("popover.clearChatHistory"),
    beforeClose: (action: string) => {
      return new Promise((resolve) => {
        if (action !== "confirm") {
          resolve(true);
          return;
        }
        IMSDK.deleteAllMsgFromLocalAndSvr()
          .then(() => {
            messageStore.clearHistoryMessage()
            feedbackToast();
          })
          .catch((error: unknown) => feedbackToast({ error }))
          .finally(() => resolve(true))
      });
    },
  })
};

</script>
  
<style lang='scss' scoped></style>