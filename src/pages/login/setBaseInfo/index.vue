<template>
  <div class="page_container relative px-10">
    <img class="mt-[5vh] h-6 w-6" :src="login_back" alt="" @click="$router.back" />

    <div class="mt-12 text-2xl font-semibold text-primary">{{ $t('setInfo') }}</div>

    <div class="mt-20">
      <div class="mb-1 text-sm text-sub-text">{{ $t('name') }}</div>
      <div class="rounded-lg border border-gap-text">
        <van-field
          class="!py-1"
          clearable
          v-model="baseInfo.nickname"
          name="nickname"
          type="text"
          :placeholder="$t('placeholder.inputNickname')"
        >
        </van-field>
      </div>
    </div>

    <div class="mt-5">
      <div class="mb-1 text-sm text-sub-text">{{ $t('password') }}</div>
      <div class="rounded-lg border border-gap-text">
        <van-field
          class="!py-1"
          clearable
          v-model="baseInfo.password"
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
          v-model="baseInfo.confirmPassword"
          name="confirmPassword"
          type="password"
          :placeholder="$t('reConfirmPassword')"
        >
        </van-field>
      </div>
    </div>

    <div class="mt-28">
      <van-button
        block
        type="primary"
        native-type="submit"
        :loading="loading"
        @click="login"
      >
        {{ $t('nowRegister') }}
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import md5 from 'md5'
import login_back from '@assets/images/login_back.png'
import { register } from '@/api/login'
import { setIMProfile } from '@/utils/storage'
import { feedbackToast } from '@/utils/common'
import { BaseData } from '../verifyCode/index.vue'

const props = defineProps<{
  baseData: BaseData & { verificationCode: string }
}>()
const router = useRouter()
const { t } = useI18n()

const passwordRegExp = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,20}$/
const loading = ref(false)
const baseInfo = reactive({
  faceURL: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  gender: 0,
  birth: 0,
})

const login = async () => {
  if (!passwordRegExp.test(baseInfo.password)) {
    feedbackToast({
      message: t('messageTip.correctPassword'),
      error: t('messageTip.correctPassword'),
    })
    return
  }
  if (baseInfo.password !== baseInfo.confirmPassword) {
    feedbackToast({
      message: t('messageTip.rePassword'),
      error: t('messageTip.rePassword'),
    })
    return
  }
  localStorage.setItem('IMAccount', props.baseData.phoneNumber)
  loading.value = true
  try {
    const {
      data: { userID },
    } = await register({
      verifyCode: props.baseData.verificationCode,
      deviceID: '',
      user: {
        ...baseInfo,
        phoneNumber: props.baseData.phoneNumber,
        areaCode: props.baseData.areaCode,
        password: md5(baseInfo.password),
        email: props.baseData.email,
      },
    })
    setIMProfile({ userID })
    router.push('login')
  } catch (error) {
    loading.value = false
    console.log(error)
    // feedbackToast({ error, message: t('messageTip.registerFailed') })
  }
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
