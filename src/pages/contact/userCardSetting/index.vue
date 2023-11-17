<template>
  <div class="page_container">
    <NavBar :title="$t('friendSettings')" />

    <div class="my-2 mx-2 rounded-md overflow-hidden">
      <CardDescItem :lable="$t('setNickname')" arrow @click="toChangeName" />
      <CardDescItem :lable="$t('shareFriend')" arrow @click="toShareCard" />
    </div>

    <div class="mx-2 mb-2 rounded-md overflow-hidden">
      <CardDescItem :lable="$t('checks.addToBlack')" arrow>
        <van-switch size="20" :loading="toggleBlackLoading" :model-value="comptIsBlack"
          @update:model-value="toggleBlack" />
      </CardDescItem>
    </div>

    <div class="mx-2 rounded-md">
      <van-button class="w-full !text-error-text !border-0 !text-base" plain type="default" :text="$t('unfriend')"
        @click="tryRemoveFriend" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import CardDescItem from '@/components/CardDescItem/index.vue';
import useContactStore from '@/store/modules/contact';
import { IMSDK } from '@/utils/imCommon';
import { feedbackToast } from '@/utils/common';
import { showConfirmDialog } from 'vant';
import { ContactChooseEnum } from '../chooseUser/data';

const { t } = useI18n();
const router = useRouter();
const contactStore = useContactStore();

const comptIsBlack = computed(() => contactStore.storeBlackList.findIndex(user => user.userID === contactStore.storeUserCardData.baseInfo?.userID) > -1)
const toggleBlackLoading = ref(false)
const toggleBlack = (newValue: boolean) => {
  toggleBlackLoading.value = true;
  const funcName = newValue ? 'addBlack' : 'removeBlack'
  IMSDK[funcName](contactStore.storeUserCardData.baseInfo?.userID!)
    .catch((error) => feedbackToast({ error }))
    .finally(() => toggleBlackLoading.value = false)
}

const toChangeName = () => {
  router.push({
    path: "changeNameOrRemark",
    query: {
      friendInfo: JSON.stringify(contactStore.storeUserCardData.baseInfo)
    }
  })
}

const toShareCard = () => {
  router.push({
    path: 'chooseUser',
    state: {
      chooseType: ContactChooseEnum.ShareCard,
      extraData: JSON.stringify(contactStore.storeUserCardData.baseInfo)
    }
  })
}

const tryRemoveFriend = () => {
  showConfirmDialog({
    message: t('messageTip.unfriend'),
    beforeClose: (action) =>
      new Promise(resolve => {
        if (action === 'confirm') {
          IMSDK.deleteFriend(contactStore.storeUserCardData.baseInfo?.userID!)
            .then(() => router.back())
            .catch((error) => feedbackToast({ error }))
            .finally(() => resolve(true))
        } else {
          resolve(true)
        }
      })
  })
}

</script>

<style lang='scss' scoped></style>