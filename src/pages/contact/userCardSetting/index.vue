<template>
  <div class="page_container">
    <NavBar :title="$t('friendSettings')" />

    <div class="my-2 mx-2 overflow-hidden rounded-md">
      <CardDescItem
        :lable="$t('setNickname')"
        arrow
        @click="toChangeName"
        v-if="isFriendUser"
      />
    </div>

    <div class="mx-2 mb-2 overflow-hidden rounded-md">
      <CardDescItem :lable="$t('checks.addToBlack')" arrow>
        <van-switch
          size="20"
          :loading="toggleBlackLoading"
          :model-value="comptIsBlack"
          @update:model-value="toggleBlack"
        />
      </CardDescItem>
    </div>

    <div v-if="isFriendUser" class="mx-2 rounded-md">
      <van-button
        class="w-full !border-0 !text-base !text-error-text"
        plain
        type="default"
        :text="$t('unfriend')"
        @click="tryRemoveFriend"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar/index.vue'
import CardDescItem from '@/components/CardDescItem/index.vue'
import useContactStore from '@/store/modules/contact'
import { IMSDK } from '@/utils/imCommon'
import { feedbackToast } from '@/utils/common'
import { showConfirmDialog } from 'vant'
import { ContactChooseEnum } from '../chooseUser/data'

const { t } = useI18n()
const router = useRouter()
const contactStore = useContactStore()

const isFriendUser = computed(
  () =>
    contactStore.friendList.findIndex(
      (item) => item.userID === contactStore.storeUserCardData.baseInfo?.userID,
    ) !== -1,
)

const comptIsBlack = computed(
  () =>
    contactStore.storeBlackList.findIndex(
      (user) => user.userID === contactStore.storeUserCardData.baseInfo?.userID,
    ) > -1,
)
const toggleBlackLoading = ref(false)
const toggleBlack = (newValue: boolean) => {
  toggleBlackLoading.value = true
  if (newValue) {
    IMSDK.addBlack({
      toUserID: contactStore.storeUserCardData.baseInfo?.userID!,
      ex: '',
    })
      .catch((error) => feedbackToast({ error }))
      .finally(() => (toggleBlackLoading.value = false))
    return
  }
  IMSDK.removeBlack(contactStore.storeUserCardData.baseInfo?.userID!)
    .catch((error) => feedbackToast({ error }))
    .finally(() => (toggleBlackLoading.value = false))
}

const toChangeName = () => {
  router.push({
    path: 'changeNameOrRemark',
    query: {
      friendInfo: JSON.stringify(contactStore.storeUserCardData.baseInfo),
    },
  })
}

const tryRemoveFriend = () => {
  showConfirmDialog({
    message: t('messageTip.unfriend'),
    beforeClose: (action) =>
      new Promise((resolve) => {
        if (action === 'confirm') {
          IMSDK.deleteFriend(contactStore.storeUserCardData.baseInfo?.userID!)
            .then(() => router.back())
            .catch((error) => feedbackToast({ error }))
            .finally(() => resolve(true))
        } else {
          resolve(true)
        }
      }),
  })
}
</script>

<style lang="scss" scoped></style>
