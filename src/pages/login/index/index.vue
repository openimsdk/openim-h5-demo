<template>
  <div class="page_container !bg-white px-10 text-[#171A1D] relative">
    <div class="text-3xl font-semibold my-[10vh]">欢迎使用OpenIM</div>

    <van-form @submit="onSubmit">
      <div>
        <div class="text-sm mb-1">手机号</div>
        <div class="border-b border-[rgba(126,134,142,0.16)] flex items-center">
          <div class="flex items-center">
            <span class="mr-2">+86</span>
            <van-icon name="arrow-down" />
          </div>
          <van-field class="!py-1" clearable v-model="formData.phoneNumber" name="phoneNumber"
            :rules="[{ pattern:phonePattern, message: '请输入正确手机号' }]" type="number" placeholder="请输入手机号码" />
        </div>
      </div>

      <div class="mt-3">
        <div class="text-sm mb-1">密码</div>
        <div class="border-b border-[rgba(126,134,142,0.16)]">
          <van-field class="!py-1 !pl-0" clearable v-model="formData.password" name="password"
            :rules="[{ required:true, message: '请输入密码' }]" type="password" placeholder="请输入密码" />
        </div>
      </div>

      <div class="mt-20">
        <van-button :loading="loading" :disabled="!(formData.phoneNumber && formData.password)" block type="primary"
          native-type="submit">
          登录
        </van-button>
      </div>

      <div class="flex items-center mt-2">
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


    <div class="text-[#0089FF] text-xs absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center">
      <div @click="getCode(true)">立即注册</div>
    </div>

  </div>
</template>

<script setup lang='ts'>
import { login } from '@/api/login';
import { feedbackToast } from '@/utils/common';
import { IMSDK, initStore } from '@/utils/imCommon';
import { setIMProfile } from '@/utils/storage';
import md5 from 'md5';

// const phonePattern = /^1[3-9]\d{9}$/
const phonePattern = /^1[1-9]\d{9}$/
const router = useRouter();

const formData = reactive({
  phoneNumber: localStorage.getItem("IMAccount") ?? '',
  areaCode: '+86',
  password: '',
  verificationCode: '',
  accept: true
})
const loading = ref(false)

const onSubmit = async () => {
  loading.value = true
  localStorage.setItem("IMAccount",formData.phoneNumber)
  try {
    const { data: { chatToken, imToken, userID } } = await login({
      phoneNumber: formData.phoneNumber,
      password: md5(formData.password),
      areaCode: formData.areaCode
    })
    console.log(imToken);

    setIMProfile({ chatToken, imToken, userID })
    await IMSDK.login({
      userID,
      token: imToken,
      apiAddr: process.env.API_URL!,
      wsAddr: process.env.WS_URL!,
      platformID: 5,
    });
    initStore();
    router.push('conversation')
  } catch (error) {
    feedbackToast({ message: '登录失败！', error })
  }
  loading.value = false
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

</style>