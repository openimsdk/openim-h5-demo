<template>
  <div class="page_container">
    <NavBar :title="$t('launchGroup')" />

    <div class="mt-2 flex bg-white px-[22px] py-3">
      <img
        :src="
          groupBaseInfo.groupFaceUrl === '' ? create_group : groupBaseInfo.groupFaceUrl
        "
        @click="chooseAvatar"
        class="h-[44px] w-[44px] rounded-md"
      />
      <van-field
        class="ml-2"
        maxlength="16"
        v-model="groupBaseInfo.groupName"
        :placeholder="$t('placeholder.inputGroupName')"
      />
    </div>

    <div class="mt-2 bg-white px-[22px] py-4" @click="toChooseMember">
      <div class="flex items-center justify-between">
        <span>{{ $t('memberCounts') }}</span>
        <span class="ml-3 text-xs text-[#ADADAD]">{{
          $t('somePeople', { count: checkedUserList.length })
        }}</span>
      </div>
      <div class="mt-3 flex">
        <Avatar
          class="mr-2 last:mr-0"
          v-for="member in checkedUserList.slice(0, 6)"
          :key="member.userID"
          :src="member.faceURL"
          :desc="member.nickname"
          :size="42"
        />
        <div
          v-show="checkedUserList.length > 6"
          class="flex h-[42px] w-[42px] items-center justify-center rounded-md bg-[#5496EB]"
        >
          <van-icon name="ellipsis" size="28" color="#fff" />
        </div>
      </div>
    </div>

    <div class="flex flex-1 flex-col-reverse">
      <div class="bg-white py-4 px-3">
        <van-button
          :loading="createLoading"
          :disabled="comptBtnDisabled"
          class="w-full !border-0"
          type="primary"
          :text="$t('placeholder.completeCreation')"
          @click="createGroup"
        />
      </div>
    </div>

    <van-uploader
      v-show="false"
      ref="uploaderRef"
      accept="image/*"
      capture="camcorder"
      :preview-image="false"
      :multiple="false"
      :after-read="afterReadFile"
      reupload
      max-count="1"
    />
  </div>
</template>

<script setup lang="ts">
import Avatar from '@/components/Avatar/index.vue'
import { feedbackToast, getFileType } from '@/utils/common'
import { IMSDK } from '@/utils/imCommon'
import type { PublicUserItem } from '@openim/wasm-client-sdk/lib/types/entity'
import { GroupType, SessionType } from '@openim/wasm-client-sdk'
import { ContactChooseEnum } from '../chooseUser/data'
import create_group from '@/assets/images/contact/create_group.png'
import NavBar from '@/components/NavBar/index.vue'
import { UploaderFileListItem, UploaderInstance, showLoadingToast } from 'vant'
import { v4 as uuidV4 } from 'uuid'
import useConversationToggle from '@/hooks/useConversationToggle'

type CreateGroupProps = {
  groupType: GroupType
}
const props = defineProps<CreateGroupProps>()

const { toSpecifiedConversation } = useConversationToggle()

const router = useRouter()
const { t } = useI18n()

const groupBaseInfo = ref({
  groupName: '',
  groupFaceUrl: '',
})
const checkedUserList = ref<PublicUserItem[]>([])
const createLoading = ref(false)
const uploaderRef = ref<UploaderInstance>()
const comptBtnDisabled = computed(
  () => !groupBaseInfo.value.groupName || checkedUserList.value.length === 0,
)

const toChooseMember = () => {
  router.push({
    path: 'chooseUser',
    state: {
      extraData: JSON.stringify(groupBaseInfo.value),
      chooseType: ContactChooseEnum.LaunchGroup,
      prevCheckedUserList: JSON.stringify(checkedUserList.value),
    },
  })
}

const createGroup = () => {
  createLoading.value = true
  const baseInfo = {
    groupType: props.groupType,
    groupName: groupBaseInfo.value.groupName,
    faceURL: groupBaseInfo.value.groupFaceUrl,
  }
  const memberList = checkedUserList.value.map((member) => member.userID)
  IMSDK.createGroup({
    groupInfo: baseInfo,
    memberUserIDs: memberList,
  })
    .then(({ data }) => {
      feedbackToast({ message: t('messageTip.createSuccess') })
      toSpecifiedConversation({
        sourceID: data.groupID,
        sessionType: SessionType.Group,
      })
    })
    .catch((error) => feedbackToast({ error }))
    .finally(() => (createLoading.value = false))
}

const afterReadFile = (data: UploaderFileListItem | UploaderFileListItem[]) => {
  const fileData = Array.isArray(data) ? data[0] : data
  const uploadToast = showLoadingToast({
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
      groupBaseInfo.value.groupFaceUrl = res.data.url
    })
    .catch(() => (uploadToast.message = t('messageTip.uploadFailed')))
    .finally(() => uploadToast.close())
}

const chooseAvatar = () => {
  uploaderRef.value?.chooseFile()
}

onBeforeMount(() => {
  const state = history.state
  if (state.extraData) {
    groupBaseInfo.value = JSON.parse(state.extraData)
  }
  checkedUserList.value = state.prevCheckedUserList
    ? JSON.parse(state.prevCheckedUserList)
    : []
})
</script>

<style lang="scss" scoped></style>
