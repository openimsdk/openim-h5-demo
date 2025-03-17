<template>
  <div class="page_container">
    <NavBar :title="$t('groupSetting')" />

    <div class="flex-1 overflow-y-auto">
      <div class="mx-[10px] mt-[10px] flex items-center rounded-md bg-white p-4">
        <div class="relative h-12 w-12">
          <Avatar
            :size="48"
            :src="conversationStore.currentConversation.faceURL"
            is-group
            @click="chooseAvatar"
          />
          <img
            v-if="isOwner || isAdmin"
            class="absolute right-[-4px] bottom-[-4px] h-[14px] w-[14px]"
            :src="edit_icon"
            alt=""
          />
        </div>

        <div class="ml-[10px] flex h-[48px] flex-1 flex-col items-start">
          <div class="flex items-center justify-start" @click="toChangeName(true)">
            <span class="text-base">{{
              conversationStore.currentConversation.showName
            }}</span>
            <span class="text-base">{{ '(' }}</span>
            <span class="text-base">{{
              conversationStore.storeCurrentGroupInfo.memberCount
            }}</span>
            <span class="text-base">{{ ')' }}</span>
            <img
              v-if="isOwner || isAdmin"
              class="ml-1.5 h-[12px] w-[12px]"
              :src="edit"
              alt=""
            />
          </div>

          <span class="mt-1 text-sm text-sub-text" @click="copyGroupID">{{
            conversationStore.storeCurrentGroupInfo.groupID
          }}</span>
        </div>
      </div>

      <GroupMemberRow
        v-if="inSameGroup"
        :member-count="conversationStore.storeCurrentGroupInfo.memberCount"
        :is-nomal="isNomal"
      />

      <div
        v-if="inSameGroup"
        class="mx-[10px] mt-[10px] overflow-hidden rounded-md bg-white"
      >
        <SettingRowItem
          v-if="isOwner || isAdmin"
          :title="$t('groupManage')"
          @click="toGroupManage"
        />
      </div>

      <div class="m-[10px] overflow-hidden rounded-md bg-white">
        <SettingRowItem
          v-if="inSameGroup"
          danger
          :title="isOwner ? $t('buttons.disbandGroup') : $t('buttons.quitGroup')"
          @click-item="dismissOrQuit"
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
    />
  </div>
</template>

<script name="groupSetting" setup lang="ts">
import edit from '@/assets/images/setting/edit.png'
import edit_icon from '@/assets/images/setting/edit_icon.png'
import NavBar from '@/components/NavBar/index.vue'
import Avatar from '@/components/Avatar/index.vue'
import {
  UploaderFileListItem,
  UploaderInstance,
  showConfirmDialog,
  showLoadingToast,
} from 'vant'
import SettingRowItem from '@/components/SettingRowItem/index.vue'
import GroupMemberRow from './components/GroupMemberRow.vue'
import useConversationSettings from '@/hooks/useConversationSettings'
import useCurrentMemberRole from '@/hooks/useCurrentMemberRole'
import { IMSDK } from '@/utils/imCommon'
import { v4 as uuidV4 } from 'uuid'
import { feedbackToast, getFileType, useCopy } from '@/utils/common'

const {conversationStore} = useConversationSettings()

const { isNomal, isOwner, isAdmin, inSameGroup } = useCurrentMemberRole()
const router = useRouter()
const { t } = useI18n()
const { copy } = useCopy()

const uploaderRef = ref<UploaderInstance>()

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
      IMSDK.setGroupInfo({
        groupID: conversationStore.storeCurrentConversation.groupID,
        faceURL: res.data.url,
      }).finally(() => uploadToast.close())
    })
    .catch(() => {
      uploadToast.message = t('messageTip.uploadFailed')
      setTimeout(() => {
        uploadToast.close()
      }, 200)
    })
    .finally(() => uploadToast.close())
}

const chooseAvatar = () => {
  if (!isNomal.value) {
    uploaderRef.value?.chooseFile()
  }
}

const toChangeName = (isGroup?: boolean) => {
  if (isGroup && isNomal.value) {
    return
  }
  router.push({
    path: 'changeName',
    query: {
      originData: JSON.stringify(
        isGroup
          ? conversationStore.storeCurrentGroupInfo
          : conversationStore.storeCurrentMemberInGroup,
      ),
    },
  })
}

const toGroupManage = () => {
  router.push('/groupManage')
}

const dismissOrQuit = () => {
  const funName = isOwner.value ? 'dismissGroup' : 'quitGroup'
  const message = isOwner.value
    ? t('messageTip.disbandGroup')
    : t('messageTip.quitGroup')

  showConfirmDialog({
    message,
    beforeClose: (action: string) => {
      return new Promise((resolve) => {
        if (action !== 'confirm') {
          resolve(true)
          return
        }
        IMSDK[funName](conversationStore.currentConversation.groupID)
          .then(() => router.push('/conversation'))
          .catch((error: unknown) => feedbackToast({ error }))
          .finally(() => resolve(true))
      })
    },
  })
}

const copyGroupID = () => {
  copy(conversationStore.storeCurrentGroupInfo.groupID)
}
</script>

<style lang="scss" scoped></style>
