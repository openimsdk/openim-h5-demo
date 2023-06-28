<template>
    <div class="page_container !bg-white px-10 text-[#171A1D] relative">
        <img class="w-9 h-[34px] mt-[5vh]" :src="registe_back" alt="" @click="$router.back">

        <div class="text-3xl font-semibold my-12">{{ isRegiste ? '新用户注册' : '忘记密码' }}</div>

        <van-form @submit="onSubmit">
            <div>
                <div class="text-sm mb-1">手机号</div>
                <div class="border-b border-[rgba(126,134,142,0.16)] flex items-center">
                    <div class="flex items-center">
                        <span class="mr-2">+86</span>
                        <van-icon name="arrow-down" />
                    </div>
                    <van-field class="!py-1" clearable v-model="formData.phoneNumber" name="phoneNumber"
                        :rules="[{ pattern: phonePattern, message: '请输入正确手机号' }]" type="tel" placeholder="请输入手机号码" />
                </div>
            </div>

            <div class="mt-3" v-if="isRegiste">
                <div class="text-sm mb-1">验证码</div>
                <div class="border-b border-[rgba(126,134,142,0.16)]">
                    <van-field class="!py-1 !pl-0" clearable v-model="formData.invitationCode" name="invitationCode"
                        :rules="[{ required: needInvitationCode, message: '请输入邀请码' }]" type="text"
                        :placeholder="`请输入邀请码${needInvitationCode ? '' : '（选填）'}`">
                    </van-field>
                </div>
            </div>

            <div class="mt-28">
                <van-button block type="primary" native-type="submit">
                    {{ isRegiste ? '立即注册' : '获取验证码' }}
                </van-button>
            </div>

            <div class="flex items-center mt-2" v-if="isRegiste">
                <van-field name="accept" class="!p-0 !w-auto">
                    <template #input>
                        <van-checkbox icon-size="16px" v-model="formData.accept" />
                    </template>
                </van-field>
                <div class="text-xs text-[#b9babd] ml-1">
                    我已阅读并同意：<span class="text-[#0089FF]">《服务协议》</span>，<span class="text-[#0089FF]">《隐私政策协议》</span>
                </div>
            </div>

        </van-form>
    </div>
</template>

<script setup lang='ts'>
import { UsedFor } from '@/api/data';
import { sendSms, verifyCode } from '@/api/login';
import useUserStore from '@/store/modules/user'
import { feedbackToast } from '@/utils/common';
import registe_back from '@assets/images/registe_back.png'

const phonePattern = /^1[3-9]\d{9}$/

const userStore = useUserStore();
const router = useRouter();

const props = defineProps<{ isRegiste: boolean }>()
const formData = reactive({
    phoneNumber: '',
    areaCode: '+86',
    invitationCode: '',
    accept: true
})

const needInvitationCode = computed(() => !!userStore.storeAppConfig.needInvitationCodeRegister)

const onSubmit = () => {
    sendSms({
        phoneNumber: formData.phoneNumber,
        areaCode: formData.areaCode,
        usedFor: props.isRegiste ? UsedFor.Register : UsedFor.Modify
    }).then(()=>router.push({
        path: 'verifyCode',
        query: {
            baseData: JSON.stringify({
                ...formData,
                isRegiste: props.isRegiste
            })
        }
    })).catch(error=>feedbackToast({ message: '发送验证码失败！', error }))
}

</script>

<style lang='scss' scoped></style>