<template>
  <div class="page_container">
    <NavBar :title="$t('profileMenu.personalInformation')" />
    <div class="mx-3 mt-2 overflow-hidden rounded-md">
      <DetailInfoItem arrow :lable="$t('avatar')" @click="chooseAvatar">
        <Avatar
          :size="32"
          :src="userStore.storeSelfInfo.faceURL"
          :desc="userStore.storeSelfInfo.nickname"
        />
      </DetailInfoItem>
      <DetailInfoItem
        arrow
        :lable="$t('name')"
        :content="userStore.storeSelfInfo.nickname"
        @click="$router.push('changeNameOrRemark')"
      />
      <DetailInfoItem
        arrow
        :lable="$t('gender')"
        :content="comptGenderStr"
        @click="showGenderPicker = true"
      />
      <DetailInfoItem
        arrow
        :lable="$t('birthday')"
        :content="comptBirthStr"
        @click="showBirthPicker = true"
      />
    </div>

    <div class="mx-3 mt-2 overflow-hidden rounded-md">
      <DetailInfoItem
        :lable="$t('cellphone')"
        :content="userStore.storeSelfInfo.phoneNumber"
      />
      <DetailInfoItem
        arrow
        :lable="$t('email')"
        :content="userStore.storeSelfInfo.email"
      />
    </div>

    <van-uploader
      v-show="false"
      ref="uploaderRef"
      accept="image/*"
      capture="camcorder"
      :preview-image="false"
      :multiple="false"
      :after-read="afterReadFile"
    />

    <van-action-sheet
      v-model:show="showGenderPicker"
      :actions="genderActions"
      :cancel-text="$t('buttons.cancel')"
      close-on-click-action
      @cancel="showGenderPicker = false"
      @select="genderSelect"
    />

    <van-action-sheet
      v-model:show="showBirthPicker"
      :cancel-text="$t('buttons.cancel')"
      @cancel="showBirthPicker = false"
    >
      <van-date-picker
        v-model="currentDate"
        :title="$t('selectDate')"
        :min-date="new Date(1970, 0, 1)"
        :max-date="new Date()"
        @confirm="confirmDate"
        @cancel="showBirthPicker = false"
      />
    </van-action-sheet>
  </div>
</template>

<script setup lang="ts">
import DetailInfoItem from '@/components/DetailInfoItem/index.vue'
import NavBar from '@/components/NavBar/index.vue'
import Avatar from '@/components/Avatar/index.vue'
import useUserStore from '@/store/modules/user'
import dayjs from 'dayjs'
import {
  closeToast,
  showLoadingToast,
  UploaderFileListItem,
  UploaderInstance,
} from 'vant'
import { feedbackToast, getFileType } from '@/utils/common'
import { updateBusinessInfo } from '@/api/user'
import { BusinessUserInfo } from '@/api/data'
import { IMSDK } from '@/utils/imCommon'
import { v4 as uuidV4 } from 'uuid'

const { t } = useI18n()
const userStore = useUserStore()
const uploaderRef = ref<UploaderInstance>()
const showGenderPicker = ref(false)
const showBirthPicker = ref(false)

const genderActions = [
  {
    name: t('private'),
  },
  {
    name: t('male'),
  },
  {
    name: t('female'),
  },
]

const comptGenderStr = computed(() => {
  if (userStore.storeSelfInfo.gender === 1) {
    return t('male')
  }
  if (userStore.storeSelfInfo.gender === 2) {
    return t('female')
  }
  return t('private')
})
const comptBirthStr = computed(() =>
  userStore.storeSelfInfo.birth
    ? dayjs(userStore.storeSelfInfo.birth).format('YYYY-MM-DD')
    : '-',
)
const currentDate = computed(() =>
  dayjs(userStore.storeSelfInfo.birth).format('YYYY-MM-DD').split('-'),
)

const chooseAvatar = () => {
  uploaderRef.value?.chooseFile()
}

const updateUserInfo = (info: Partial<BusinessUserInfo>) => {
  updateBusinessInfo({
    ...info,
    userID: userStore.storeSelfInfo.userID,
  })
    .then(() => userStore.getSelfInfoFromReq())
    .catch((error) => feedbackToast({ error }))
}

const afterReadFile = (data: UploaderFileListItem | UploaderFileListItem[]) => {
  const fileData = Array.isArray(data) ? data[0] : data
  showLoadingToast({
    message: t('uploading'),
    forbidClick: true,
    duration: 0,
  })
  IMSDK.uploadFile({
    name: new Date().getTime() + getFileType(fileData.file?.name ?? ''),
    contentType: fileData.file?.type!,
    uuid: uuidV4(),
    file: fileData.file as File,
  })
    .then((res) => {
      updateUserInfo({
        faceURL: res.data.url,
      })
    })
    .finally(closeToast)
}

const genderSelect = (_: unknown, gender: number) => {
  updateUserInfo({
    gender,
  })
}

const confirmDate = ({ selectedValues }: any) => {
  const birth = new Date(
    selectedValues[0],
    selectedValues[1],
    selectedValues[2],
  ).getTime()
  updateUserInfo({
    birth: birth / 1000,
  })
  showBirthPicker.value = false
}
</script>

<style lang="scss" scoped></style>
