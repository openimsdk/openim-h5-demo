<template>
  <div class="page_container !bg-white px-10 text-[#171A1D] relative">
    <div class="text-3xl font-semibold mt-[15vh]">请设置账号密码</div>
    <div class="text-[#0089FF] mt-2 mb-4">
      登录密码用于登录IM账号
    </div>

    <van-form @submit="onSubmit">

      <div class="mt-3">
        <div class="text-sm mb-1">密码</div>
        <div class="border-b border-[rgba(126,134,142,0.16)]">
          <van-field class="!py-1 !pl-0" clearable v-model="password" name="password"
            :rules="[{ required: true, message: '请输入密码' }]" type="password" placeholder="请输入密码" />
        </div>
      </div>

      <div class="text-xs text-[#0089FF] mt-2">{{ `需6~20位字符` }}</div>

      <div class="mt-[20vh]">
        <van-button :disabled="!password" block type="primary" native-type="submit">
          {{ baseData.isRegiste ? '下一步' : '确认修改' }}
        </van-button>
      </div>

    </van-form>
  </div>
</template>

<script setup lang='ts'>
import { modify } from '@/api/login';
import { BaseData } from '../verifyCode/index.vue';
import { feedbackToast } from '@/utils/common';
import md5 from 'md5';

const router = useRouter();
const props = defineProps<{
  baseData: BaseData & { verificationCode: string }
}>()

const password = ref()

const onSubmit = () => {
  if (props.baseData.isRegiste) {
    router.push({
      path: 'setBaseInfo',
      query: {
        baseData: JSON.stringify({
          ...props.baseData,
          password: password.value
        })
      }
    })
    return;
  }

  modify({
    password: md5(password.value),
    verificationCode: props.baseData.verificationCode,
    areaCode: props.baseData.areaCode,
    phoneNumber: props.baseData.phoneNumber
  }).then(() => feedbackToast({ message: '修改成功，请重新登陆！', onClose: () => router.push('login') }))
    .catch(error => feedbackToast({ error }))
}

</script>

<style lang='scss' scoped></style>