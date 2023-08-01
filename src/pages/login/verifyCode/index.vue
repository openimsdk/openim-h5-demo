<template>
    <div class="page_container !bg-white px-10 text-[#171A1D] relative">
        <img class="w-9 h-[34px] my-[5vh]" :src="registe_back" alt="">

        <div class="text-3xl font-semibold">验证码已发送至手机</div>
        <div class="text-[#0089FF] mt-2 mb-4">
            <span class="mr-2">{{ baseData.areaCode }}</span>
            <span>{{ baseData.phoneNumber }}</span>
        </div>

        <div class="text-sm text-[#333]">请输入验证码</div>
        <van-password-input class="!m-0" :value="verificationCode" :mask="false" :focused="showKeyboard"
            @focus="showKeyboard = true" />

        <div class="text-[#333] text-xs mt-4">
            <span class="text-[#0089FF]">{{count}}s</span>后<span class="ml-1" @click="reSend">重发验证码</span>
        </div>

        <van-number-keyboard v-model="verificationCode" :show="showKeyboard" @blur="showKeyboard = false" />
    </div>
</template>

<script setup lang='ts'>
import { UsedFor } from '@/api/data'
import { sendSms, verifyCode } from '@/api/login'
import { feedbackToast } from '@/utils/common'
import registe_back from '@assets/images/registe_back.png'

export interface BaseData {
    areaCode: string
    phoneNumber: string
    invitationCode: string
    isRegiste: boolean
}

const props = defineProps<{
    baseData: BaseData
}>()
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
    }).then(() => router.push({
        path: 'setPassword',
        query: {
            baseData: JSON.stringify({
                ...props.baseData,
                verificationCode: verificationCode.value,
            })
        }
    }))
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
    }).then(startTimer).catch(error => feedbackToast({ message: '发送验证码失败！', error }))
}

watch(verificationCode,(newVal)=>{
    if(newVal.length===6){
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
:deep(.van-password-input__item) {
    border-bottom: 1px solid #999;
    margin: 0 8px;

    &::after {
        border-color: transparent !important;

    }
}

:deep(.van-password-input__security) {
    &::after {
        border-color: transparent !important;
    }
}
</style>