<template>
  <div class="page_container !bg-white">
    <NavBar :title="$t('email')">
      <span @click="saveChange">{{ t('buttons.save') }}</span>
    </NavBar>

    <div class="mx-6 mt-10">
      <div class="rounded-lg border border-gap-text">
        <van-field
          class="!py-1"
          v-model="value"
          :maxlength="16"
          label=""
          :placeholder="$t('placeholder.pleaseInput')"
        ></van-field>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar/index.vue'
import { updateBusinessInfo } from '@/api/user'
import useUserStore from '@/store/modules/user'
import { feedbackToast } from '@/utils/common'

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()

const value = ref(userStore.storeSelfInfo.email)

const saveChange = () => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  if (!value.value || !emailRegex.test(value.value)) {
    feedbackToast({ message: t('messageTip.emailTip'), error: 'emailRegex' })
    return
  }
  updateBusinessInfo({
    userID: userStore.storeSelfInfo.userID,
    email: value.value,
  })
    .then(() => {
      userStore.getSelfInfoFromReq()
      feedbackToast({ message: t('messageTip.nomalSuccess'), onClose: router.back })
    })
    .catch((error) => feedbackToast({ message: t('messageTip.nomalFailed'), error }))
}
</script>

<style lang="scss" scoped></style>
