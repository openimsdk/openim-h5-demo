<template>
  <div class="page_container relative px-10">
    <img class="mt-[5vh] h-6 w-6" :src="login_back" alt="" @click="$router.back" />

    <div class="mt-12 text-2xl font-semibold text-primary">
      {{ $t('forgetPasswordTitle') }}
    </div>

    <van-form @submit="onSubmit">
      <div class="mt-5">
        <div class="mb-1 text-sm text-sub-text">{{ $t('password') }}</div>
        <div class="rounded-lg border border-gap-text">
          <van-field
            class="!py-1"
            clearable
            v-model="password"
            name="password"
            type="password"
            :placeholder="$t('placeholder.inputPassword')"
          >
          </van-field>
        </div>
        <div class="mt-0.5 text-xs text-sub-text">{{ $t('passwordRequired') }}</div>
      </div>

      <div class="mt-5">
        <div class="mb-1 text-sm text-sub-text">{{ $t('confirmPassword') }}</div>
        <div class="rounded-lg border border-gap-text">
          <van-field
            class="!py-1"
            clearable
            v-model="confirmPassword"
            name="confirmPassword"
            type="password"
            :placeholder="$t('reConfirmPassword')"
          >
          </van-field>
        </div>
      </div>

      <div class="mt-28">
        <van-button :disabled="!password" block type="primary" native-type="submit">
          {{ $t('buttons.confirm') }}
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { modify } from '@/api/login'
import login_back from '@assets/images/login_back.png'
import { BaseData } from '../verifyCode/index.vue'
import { feedbackToast } from '@/utils/common'
import md5 from 'md5'

const { t } = useI18n()
const router = useRouter()
const props = defineProps<{
  baseData: BaseData & { verificationCode: string }
  isByEmail: boolean
}>()

const passwordRegExp = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,20}$/
const password = ref()
const confirmPassword = ref()

const onSubmit = () => {
  if (!passwordRegExp.test(password.value)) {
    feedbackToast({
      message: t('messageTip.correctPassword'),
      error: t('messageTip.correctPassword'),
    })
    return
  }
  if (password.value !== confirmPassword.value) {
    feedbackToast({
      message: t('messageTip.rePassword'),
      error: t('messageTip.rePassword'),
    })
    return
  }
  modify({
    password: md5(password.value),
    verifyCode: props.baseData.verificationCode,
    areaCode: props.baseData.areaCode,
    phoneNumber: props.baseData.phoneNumber,
    email: props.baseData.email,
  }).then(() =>
    feedbackToast({
      message: t('messageTip.changePasswordSuccess'),
      onClose: () => router.push('login'),
    }),
  )
  // .catch(error => feedbackToast({ error }))
}
</script>

<style lang="scss" scoped>
.page_container {
  background: linear-gradient(
    180deg,
    rgba(0, 137, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
}
</style>
