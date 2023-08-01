<template>
  <div class="page_container !bg-white px-10 text-[#171A1D] relative">
    <img class="w-9 h-[34px] my-[5vh]" :src="registe_back" alt="">

    <div class="text-3xl font-semibold">请完善个人信息</div>

    <BaseInfoRow class="mt-12" title="头像" @click="chooseAvatar">
      <Avatar v-if="baseInfo.faceURL" :src="baseInfo.faceURL" />
      <van-icon v-else color="#b2b2b2" size="20" name="photograph" />
    </BaseInfoRow>
    <BaseInfoRow title="昵称" @click="editNickname">
      <div class="max-w-[200px] truncate">{{ baseInfo.nickname }}</div>
    </BaseInfoRow>
    <BaseInfoRow title="性别" @click="showGenderPicker = true">
      <span>{{ comptGenderStr }}</span>
    </BaseInfoRow>
    <BaseInfoRow title="生日" @click="showBirthPicker = true">
      <span>{{ comptBirthStr }}</span>
    </BaseInfoRow>

    <div class="mt-[20vh]">
      <van-button block type="primary" native-type="submit" :loading="loading" @click="login">
        立即注册
      </van-button>
    </div>

    <van-dialog v-model:show="nicknameData.show" title="昵称" show-cancel-button @confirm="confirmNickname"
      @closed="nicknameData.content = ''">
      <van-field maxlength="20" v-model="nicknameData.content" />
    </van-dialog>

    <van-action-sheet v-model:show="showGenderPicker" :actions="genderActions" cancel-text="取消" close-on-click-action
      @cancel="showGenderPicker = false" @select="genderSelect" />

    <van-action-sheet v-model:show="showBirthPicker" cancel-text="取消" @cancel="showBirthPicker = false">
      <van-date-picker v-model="currentDate" title="选择日期" :min-date="new Date(1970, 0, 1)" :max-date="new Date()"
        @confirm="confirmDate" @cancel="showBirthPicker = false" />
    </van-action-sheet>
  </div>
</template>

<script setup lang='ts'>
import registe_back from '@assets/images/registe_back.png'
import BaseInfoRow from './BaseInfoRow.vue';
import dayjs from 'dayjs';
import Avatar from '@/components/Avatar/index.vue';
import { BaseData } from '../verifyCode/index.vue';
import { register } from '@/api/login';
import { IMSDK, initStore } from '@/utils/imCommon';
import { setIMProfile } from '@/utils/storage';
import { feedbackToast } from '@/utils/common';
import { onBeforeRouteUpdate } from 'vue-router';
import md5 from 'md5';

const props = defineProps<{
  baseData: BaseData & { verificationCode: string; password: string }
}>()
const router = useRouter();
const genderActions = [
  {
    name: '保密'
  },
  {
    name: '男'
  },
  {
    name: '女'
  },
]


const nicknameData = reactive({
  show: false,
  content: ''
})
const showGenderPicker = ref(false)
const showBirthPicker = ref(false)
const loading = ref(false)

const baseInfo = reactive({
  faceURL: history.state.avatar || '',
  nickname: '',
  gender: 0,
  birth: 0
})

const comptGenderStr = computed(() => {
  if (baseInfo.gender === 1) {
    return '男'
  }
  if (baseInfo.gender === 2) {
    return '女'
  }
  return '保密'
})
const comptBirthStr = computed(() => baseInfo.birth ? dayjs(baseInfo.birth).format("YYYY-MM-DD") : '-')
const currentDate = computed(() => dayjs(baseInfo.birth).format("YYYY-MM-DD").split('-'))

const chooseAvatar = () => {
  router.push({
    path: 'chooseAvatar',
    state: {
      baseData: JSON.stringify(props.baseData)
    }
  })
}

const editNickname = () => {
  nicknameData.show = true
  nicknameData.content = baseInfo.nickname
}
const confirmNickname = () => {
  baseInfo.nickname = nicknameData.content
}

const genderSelect = (_: unknown, gender: number) => {
  baseInfo.gender = gender
}

const confirmDate = ({ selectedValues }: any) => {
  baseInfo.birth = new Date(selectedValues[0], selectedValues[1], selectedValues[2]).getTime()
  showBirthPicker.value = false
}

const login = async () => {
  localStorage.setItem("IMAccount",props.baseData.phoneNumber)
  try {
    const { data: { chatToken, imToken, userID } } = await register({
      verifyCode: props.baseData.verificationCode,
      deviceID:'',
      user:{
        ...baseInfo,
        birth: baseInfo.birth / 1000,
        phoneNumber: props.baseData.phoneNumber,
        areaCode: props.baseData.areaCode,
        password: md5(props.baseData.password),
      },
    })
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
    feedbackToast({ error, message: '注册失败！' })
  }
}

</script>

<style lang='scss' scoped></style>