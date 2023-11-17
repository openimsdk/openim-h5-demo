<template>
  <div class="page_container px-10 relative">
    <img class="w-6 h-6 mt-[5vh]" :src="login_back" alt="" @click="$router.back">

    <div class="text-2xl text-primary font-semibold mt-12">{{ $t('setInfo') }}</div>

    <div class="mt-20">
      <div class="text-sm mb-1 text-sub-text">{{ $t('name') }}</div>
      <div class="border border-gap-text rounded-lg">
        <van-field class="!py-1" clearable v-model="baseInfo.nickname" name="nickname" type="text"
          :placeholder="$t('placeholder.inputNickname')">
        </van-field>
      </div>
    </div>

    <div class="mt-5">
      <div class="text-sm mb-1 text-sub-text">{{ $t('password') }}</div>
      <div class="border border-gap-text rounded-lg">
        <van-field class="!py-1" clearable v-model="baseInfo.password" name="password" type="password"
          :placeholder="$t('placeholder.inputPassword')">
        </van-field>
      </div>
      <div class="text-xs mt-0.5 text-sub-text">{{ $t('passwordRequired') }}</div>
    </div>

    <div class="mt-5">
      <div class="text-sm mb-1 text-sub-text">{{ $t('confirmPassword') }}</div>
      <div class="border border-gap-text rounded-lg">
        <van-field class="!py-1" clearable v-model="baseInfo.confirmPassword" name="confirmPassword" type="password"
          :placeholder="$t('placeholder.reConfirmPassword')">
        </van-field>
      </div>
    </div>

    <div class="mt-28">
      <van-button block type="primary" native-type="submit" :loading="loading" @click="login">
        {{ $t('nowRegister') }}
      </van-button>
    </div>

  </div>
</template>

<script setup lang='ts'>
import md5 from 'md5';
import login_back from '@assets/images/login_back.png'
import { register } from '@/api/login';
import { setIMProfile } from '@/utils/storage';
import { feedbackToast } from '@/utils/common';
import { BaseData } from '../verifyCode/index.vue';

const props = defineProps<{
  baseData: BaseData & { verificationCode: string }
}>()
const router = useRouter();
const { t } = useI18n()

const passwordRegExp = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,20}$/
const loading = ref(false)
const baseInfo = reactive({
  faceURL: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  gender: 0,
  birth: 0
})

const login = async () => {
  if (!passwordRegExp.test(baseInfo.password)) {
    feedbackToast({
      message: t('messageTip.correctPassword'),
      error: t('messageTip.correctPassword')
    })
    return
  }
  if (baseInfo.password !== baseInfo.confirmPassword) {
    feedbackToast({
      message: t('messageTip.rePassword'),
      error: t('messageTip.rePassword')
    })
    return
  }
  localStorage.setItem("IMAccount", props.baseData.phoneNumber)
  loading.value = true
  try {
    const { data: { chatToken, imToken, userID } } = await register({
      verifyCode: props.baseData.verificationCode,
      deviceID: '',
      user: {
        ...baseInfo,
        phoneNumber: props.baseData.phoneNumber,
        areaCode: props.baseData.areaCode,
        password: md5(baseInfo.password),
      },
    })
    setIMProfile({ chatToken, imToken, userID })
    router.push('conversation')
  } catch (error) {
    loading.value = false
    feedbackToast({ error, message: t('messageTip.registerFailed') })
  }
}

</script>

<style lang='scss' scoped>
.page_container {
  background: linear-gradient(180deg, rgba(0, 137, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
}
</style>