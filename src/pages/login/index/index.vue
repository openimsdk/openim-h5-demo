<template>
  <div class="page_container !bg-white px-10 relative">
    <img class="w-16 h-16 mx-auto mt-[88px]" src="@assets/images/logo.png" alt="">
    <div class=" text-lg font-semibold mx-auto text-primary">{{ $t('welcome') }}</div>

    <van-form @submit="onSubmit" class="mt-[76px]">
      <div>
        <div class="text-sm mb-1 text-sub-text">{{ $t('cellphone') }}</div>
        <div class="border border-gap-text rounded-lg flex items-center">
          <div class="flex items-center border-r border-gap-text px-3" @click="showAreaCode = true">
            <span class="mr-1">{{ formData.areaCode }}</span>
            <van-icon name="arrow-down" />
          </div>
          <van-field class="!py-1 !text-base" clearable v-model="formData.phoneNumber" name="phoneNumber" type="number"
            :placeholder="$t('placeholder.inputPhoneNumber')" />
        </div>
      </div>

      <div class="mt-5" v-if="isByPassword">
        <div class="text-sm mb-1 text-sub-text">{{ $t('password') }}</div>
        <div class="border border-gap-text rounded-lg">
          <van-field class="!py-1" clearable v-model="formData.password" name="password" type="password"
            :placeholder="$t('placeholder.inputPassword')" />
        </div>
      </div>

      <div class="mt-5" v-else>
        <div class="text-sm mb-1 text-sub-text">{{ $t('reAcquireDesc') }}</div>
        <div class="border border-gap-text rounded-lg">
          <van-field class="!py-1" clearable v-model="formData.verificationCode" name="verificationCode" type="text"
            :placeholder="$t('placeholder.inputVerificationCode')">
            <template #button>
              <span class="text-primary" @click="reSend" v-if="count <= 0">{{ $t('buttons.verificationCode') }}</span>
              <span class="text-primary" v-else>{{ count }}S</span>
            </template>
          </van-field>
        </div>
      </div>

      <div class="mt-16">
        <van-button :loading="loading" :disabled="!(formData.phoneNumber && formData.password)" block type="primary"
          native-type="submit">
          {{ $t('buttons.login') }}
        </van-button>
      </div>
    </van-form>

    <div class="text-xs absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col w-[300px] items-center">
      <div class="flex flex-row text-primary">
        <div class="text-sub-text">{{ $t('notHaveAccount') }}</div>
        <div @click="getCode(true)">{{ $t('nowRegister') }}</div>
      </div>
      <div class="text-sub-text">{{ version }}</div>
    </div>

    <van-popup v-model:show="showAreaCode" round position="bottom">
      <van-picker :columns="countryCode" @cancel="showAreaCode = false" @confirm="onConfirmAreaCode"
        :columns-field-names="{ text: 'phone_code', value: 'phone_code', children: 'children' }" />
    </van-popup>

  </div>
</template>

<script setup lang='ts'>
import md5 from 'md5';
import type { PickerConfirmEventParams, } from 'vant';
import { login, sendSms } from '@/api/login';
import countryCode from '@/utils/areaCode'
import { feedbackToast } from '@/utils/common';
import { setIMProfile } from '@/utils/storage';
import { UsedFor } from '@/api/data';

const version = process.env.VERSION

const { t } = useI18n()
const router = useRouter();

const formData = reactive({
  phoneNumber: localStorage.getItem("IMAccount") ?? '',
  areaCode: '+86',
  password: '',
  verificationCode: '',
  accept: true
})
const loading = ref(false)
const isByPassword = ref(true)
const showAreaCode = ref(false)
const count = ref(0)
let timer: NodeJS.Timer

const onSubmit = async () => {
  loading.value = true
  localStorage.setItem("IMAccount", formData.phoneNumber)
  try {
    const { data: { chatToken, imToken, userID } } = await login({
      phoneNumber: formData.phoneNumber,
      password: md5(formData.password),
      areaCode: formData.areaCode
    })

    setIMProfile({ chatToken, imToken, userID })
    router.push('/conversation')
  } catch (error) {
    feedbackToast({ message: t('messageTip.loginFailed'), error })
  }
  loading.value = false
}

const onConfirmAreaCode = ({ selectedValues }: PickerConfirmEventParams) => {
  formData.areaCode = String(selectedValues[0])
  showAreaCode.value = false
}

const reSend = () => {
  if (count.value > 0) return
  sendSms({
    phoneNumber: formData.phoneNumber,
    areaCode: formData.areaCode,
    usedFor: UsedFor.Login
  })
    .then(startTimer)
    .catch(error => feedbackToast({ message: t('messageTip.sendCodeFailed'), error }))
}

const startTimer = () => {
  if (timer) {
    clearInterval(timer)
  }
  count.value = 60
  timer = setInterval(() => {
    if (count.value > 0) {
      count.value -= 1
    } else {
      clearInterval(timer)
    }
  }, 1000)
}

const getCode = (flag: boolean) => {
  router.push({
    path: 'getCode',
    query: {
      isRegiste: flag + ''
    }
  })
}
</script>

<style lang='scss' scoped>
.page_container {
  background: linear-gradient(180deg, rgba(0, 137, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
}
</style>
