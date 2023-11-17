<template>
  <div class="page_container">
    <NavBar :title="$t('changePassword')">
      <span @click="comfirmReset">{{ t("buttons.save") }}</span>
    </NavBar>

    <div class="m-[10px] overflow-hidden rounded-md">
      <div class="bg-white">
        <van-field v-model="data.oldPassword" :label="`${$t('oldPassword')}：`" />
      </div>
      <div class="bg-white border-t">
        <van-field v-model="data.newPassword" :label="`${$t('newPassword')}：`" />
      </div>
      <div class="bg-white border-t">
        <van-field v-model="data.confirmPassword" :label="`${$t('confirmPassword')}：`" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { businessModify } from '@/api/login';
import NavBar from '@/components/NavBar/index.vue';
import useUserStore from '@/store/modules/user';
import { feedbackToast } from '@/utils/common';
import md5 from 'md5';

const pwdReg = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,20}$/

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const data = reactive({
  oldPassword: '',
  newPassword: "",
  confirmPassword: ""
})

const comfirmReset = () => {
  if (data.oldPassword.length < 0) {
    feedbackToast({ message: t('placeholder.inputPassword'), error: t('placeholder.inputPassword') })
    return
  }
  if (!pwdReg.test(data.newPassword)) {
    feedbackToast({ message: t('passwordRequired'), error: t('passwordRequired') })
    return
  }
  if (data.newPassword !== data.confirmPassword) {
    feedbackToast({ message: t('messageTip.rePassword'), error: t('messageTip.rePassword') })
    return
  }
  const options = {
    userID: userStore.storeSelfInfo.userID,
    currentPassword: md5(data.oldPassword),
    newPassword: md5(data.newPassword)
  }
  businessModify(options)
    .then(() => {
      feedbackToast({ message: t('messageTip.changePasswordSuccess') })
      setTimeout(() => router.back(), 500)
    })
    .catch((error: any) => {
      feedbackToast({ message: error.errDlt, error })
    });
}

</script>