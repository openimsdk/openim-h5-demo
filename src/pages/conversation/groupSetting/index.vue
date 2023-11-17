<template>
  <div class="page_container">
    <NavBar :title="$t('groupSetting')" />

    <div class="overflow-y-auto flex-1">
      <div class="flex items-center bg-white p-4 mt-[10px] mx-[10px] rounded-md">
        <div class="relative w-12 h-12">
          <Avatar :size="48" :src="conversationStore.currentConversation.faceURL" is-group @click="chooseAvatar" />
          <img v-if="isOwner || isAdmin" class="w-[14px] h-[14px] absolute right-[-4px] bottom-[-4px]" :src="edit_icon"
            alt="" />
        </div>

        <div class="flex flex-1 h-[48px] flex-col items-start ml-[10px]" @click="toChangeName(true)">
          <div class="flex items-center justify-start">
            <span class="text-base">{{ conversationStore.currentConversation.showName }}</span>
            <span class="text-base">{{ "(" }}</span>
            <span class="text-base">{{ conversationStore.storeCurrentGroupInfo.memberCount }}</span>
            <span class="text-base">{{ ")" }}</span>
            <img v-if="isOwner || isAdmin" class="w-[12px] h-[12px] ml-1.5" :src="edit" alt="">
          </div>

          <span class="text-sm text-sub-text mt-1">{{ conversationStore.storeCurrentGroupInfo.groupID }}</span>
        </div>
        <img class="w-[18px] h-[18px]" @click="toGroupQr" :src="qr" alt="">
      </div>

      <GroupMemberRow :member-count="conversationStore.storeCurrentGroupInfo.memberCount" :is-nomal="isNomal" />

      <div class="bg-white m-[10px] rounded-md overflow-hidden">
        <SettingRowItem danger :title="isOwner ? $t('buttons.disbandGroup') : $t('buttons.quitGroup')"
          @click-item="dismissOrQuit" />
      </div>
    </div>

    <van-uploader v-show="false" ref="uploaderRef" accept="image/*" capture="camcorder" :preview-image="false"
      :multiple="false" :after-read="afterReadFile" />
  </div>
</template>

<script name="groupSetting" setup lang="ts">
import qr from '@/assets/images/setting/qr.png'
import edit from '@/assets/images/setting/edit.png'
import edit_icon from '@/assets/images/setting/edit_icon.png'
import NavBar from "@/components/NavBar/index.vue";
import Avatar from "@/components/Avatar/index.vue";
import { UploaderFileListItem, UploaderInstance, showConfirmDialog, showLoadingToast } from "vant";
import SettingRowItem from "@/components/SettingRowItem/index.vue";
import GroupMemberRow from "./components/GroupMemberRow.vue";
import useConversationSettings from "@/hooks/useConversationSettings";
import useCurrentMemberRole from "@/hooks/useCurrentMemberRole";
import { IMSDK } from "@/utils/imCommon";
import { v4 as uuidV4 } from "uuid";
import { feedbackToast } from '@/utils/common';

const {
  conversationStore,
} = useConversationSettings();

const { isNomal, isOwner, isAdmin } = useCurrentMemberRole();
const router = useRouter();
const { t } = useI18n()

const uploaderRef = ref<UploaderInstance>()

const afterReadFile = (data: UploaderFileListItem | UploaderFileListItem[]) => {
  const fileData = Array.isArray(data) ? data[0] : data
  const uploadToast = showLoadingToast({
    message: t('uploading'),
    forbidClick: true,
    duration: 0
  })
  IMSDK.uploadFile({
    name: fileData.file?.name ?? '',
    contentType: fileData.file?.type!,
    uuid: uuidV4(),
    file: fileData.file as File,
  }).then((res) => {
    IMSDK.setGroupInfo({
      groupID: conversationStore.storeCurrentConversation.groupID,
      faceURL: res.data.url
    }).finally(() => uploadToast.close())
  }).catch(() => {
    uploadToast.message = t('messageTip.uploadFailed'); setTimeout(() => {
      uploadToast.close()
    }, 200)
  }).finally(() => uploadToast.close())
}

const chooseAvatar = () => {
  if (!isNomal.value) {
    uploaderRef.value?.chooseFile()
  }
}

const toChangeName = (isGroup?: boolean) => {
  if (isGroup && isNomal.value) {
    return;
  }
  router.push({
    path: 'changeName',
    query: {
      originData: JSON.stringify(isGroup ? conversationStore.storeCurrentGroupInfo : conversationStore.storeCurrentMemberInGroup)
    }
  })
}

const toGroupQr = () => {
  router.push({
    path: 'selfOrGroupQr',
    query: {
      isGroup: 'true'
    }
  })
}

const dismissOrQuit = () => {
  const funName = isOwner ? 'dismissGroup' : "quitGroup"
  const message = isOwner ? t('messageTip.disbandGroup') :  t('messageTip.quitGroup')

  showConfirmDialog({
    message,
    beforeClose: (action: string) => {
      return new Promise((resolve) => {
        if (action !== "confirm") {
          resolve(true);
          return;
        }
        IMSDK[funName](conversationStore.currentConversation.groupID)
          .then(() => router.push('/conversation'))
          .catch((error: unknown) => feedbackToast({ error }))
          .finally(() => resolve(true));
      });
    },
  });
}

</script>

<style lang="scss" scoped></style>
