<template>
  <div class="page_container px-10 relative">
    <img class="w-6 h-6 mt-[5vh]" :src="login_back" alt="" @click="$router.back">

    <div class="text-2xl text-primary font-semibold mt-12">{{ $t('placeholder.inputVerificationCode') }}</div>
    <div class="text-sub-text text-xs mt-2">
      <span class="mr-1">{{ baseData.areaCode }}</span>
      <span>{{ baseData.phoneNumber }}</span>
    </div>

    <div class="mt-10">
      <van-password-input class="!m-0" :value="verificationCode" :mask="false" :focused="showKeyboard"
        @focus="showKeyboard = true" />
    </div>

    <div class="text-sub-text text-xs mt-4">
      <span v-if="count > 0">{{ count }}S</span>
      <span @click="reSend">{{ $t('reAcquire') }}</span>
    </div>

    <van-number-keyboard v-model="verificationCode" :show="showKeyboard" @blur="showKeyboard = false" />
  </div>
</template>

<script setup lang='ts'>
import { UsedFor } from '@/api/data'
import { sendSms, verifyCode } from '@/api/login'
import { feedbackToast } from '@/utils/common'
import login_back from '@assets/images/login_back.png'

export interface BaseData {
  areaCode: string
  phoneNumber: string
  invitationCode: string
  isRegiste: boolean
}

const props = defineProps<{
  baseData: BaseData
}>()
const { t } = useI18n()
const router = useRouter();
const verificationCode = ref()
const showKeyboard = ref(true)
const count = ref(60)
let timer: NodeJS.Timer

const onSubmit = () => {
  const { phoneNumber, areaCode, isRegiste } = props.baseData
  verifyCode({
    phoneNumber,
    areaCode,
    verifyCode: verificationCode.value,
    usedFor: isRegiste ? UsedFor.Register : UsedFor.Modify
  })
    .then(() => router.push({
      path: 'setBaseInfo',
      query: {
        baseData: JSON.stringify({
          ...props.baseData,
          verificationCode: verificationCode.value,
        })
      }
    }))
    .catch(error => feedbackToast({ message: t('messageTip.codeInvalidOrExpired'), error }))
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

const reSend = () => {
  if (count.value > 0) return
  sendSms({
    phoneNumber: props.baseData.phoneNumber,
    areaCode: props.baseData.areaCode,
    usedFor: props.baseData.isRegiste ? UsedFor.Register : UsedFor.Modify
  })
    .then(startTimer)
    .catch(error => feedbackToast({ message: t('messageTip.sendCodeFailed'), error }))
}

watch(verificationCode, (newVal) => {
  if (newVal.length === 6) {
    onSubmit()
  }
})

onMounted(() => startTimer())

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

</script>

<style lang='scss' scoped>
.page_container {
  background: linear-gradient(180deg, rgba(0, 137, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
}

:deep(.van-password-input__item) {
  border: 1px solid #E8EAEF;
  border-radius: 8px;
  margin: 0 4px;

  &::after {
    border-color: transparent !important;
  }
}


:deep(.van-password-input__security) {
  &::after {
    border-color: transparent !important;
  }
}

:deep(.van-password-input__security li) {
  height: 42px;
  width: 42px;
  background: none;
}
</style>