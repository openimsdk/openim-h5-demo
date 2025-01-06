<template>
  <div class="page_container">
    <NavBar :title="$t('profileMenu.accountSetting')" />

    <div class="mx-3 mt-2 overflow-hidden rounded-md">
      <DetailInfoItem :lable="$t('profileMenu.disturbMode')">
        <van-switch
          size="20"
          :loading="switchLoading.globalRecvMsgOpt"
          v-model="globalRecvMsgOpt"
          @change="(e: any) => businessSettingsUpdate(e, 'globalRecvMsgOpt')"
        />
      </DetailInfoItem>
      <DetailInfoItem :lable="$t('profileMenu.newMessageSound')">
        <van-switch
          size="20"
          :loading="switchLoading.allowBeep"
          v-model="allowBeep"
          @change="(e: any) => businessSettingsUpdate(e, 'allowBeep')"
        />
      </DetailInfoItem>
    </div>

    <div class="mx-3 mt-2 overflow-hidden rounded-md">
      <DetailInfoItem :lable="$t('profileMenu.disallowAddMe')">
        <van-switch
          size="20"
          :loading="switchLoading.allowAddFriend"
          v-model="allowAddFriend"
          @change="(e: any) => businessSettingsUpdate(e, 'allowAddFriend')"
        />
      </DetailInfoItem>
      <DetailInfoItem
        arrow
        :lable="$t('profileMenu.blacklist')"
        @click="$router.push('blackList')"
      />
      <DetailInfoItem
        arrow
        :lable="$t('profileMenu.language')"
        @click="$router.push('/language')"
      />
    </div>

    <div class="mx-3 mt-2 overflow-hidden rounded-md">
      <DetailInfoItem
        arrow
        :lable="$t('changePassword')"
        @click="$router.push('/changePassword')"
      />
      <DetailInfoItem
        arrow
        danger
        :lable="$t('profileMenu.clearChatHistory')"
        @click="tryClearChatLogs"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar/index.vue'
import { BusinessAllowType, BusinessUserInfo } from '@/api/data'
import { updateBusinessInfo } from '@/api/user'
import DetailInfoItem from '@/components/DetailInfoItem/index.vue'
import useMessageStore from '@/store/modules/message'
import useUserStore from '@/store/modules/user'
import { feedbackToast } from '@/utils/common'
import { IMSDK } from '@/utils/imCommon'
import { MessageReceiveOptType } from '@openim/wasm-client-sdk'
import { showConfirmDialog, showToast } from 'vant'

const { t } = useI18n()
const userStore = useUserStore()
const messageStore = useMessageStore()

const globalRecvMsgOpt = computed(
  () => userStore.storeSelfInfo.globalRecvMsgOpt === MessageReceiveOptType.NotNotify,
)
const allowBeep = computed(
  () => userStore.storeSelfInfo.allowBeep === BusinessAllowType.Allow,
)
const allowAddFriend = computed(
  () => userStore.storeSelfInfo.allowAddFriend === BusinessAllowType.NotAllow,
)

const switchLoading = reactive({
  allowBeep: false,
  globalRecvMsgOpt: false,
  allowAddFriend: false,
})

const businessSettingsUpdate = (
  vaule: boolean,
  key: 'allowBeep' | 'globalRecvMsgOpt' | 'allowAddFriend',
) => {
  const updateInfo: Partial<BusinessUserInfo> = {}

  switchLoading[key] = true

  if (key === 'allowBeep') {
    updateInfo[key] = vaule ? BusinessAllowType.Allow : BusinessAllowType.NotAllow
  }
  if (key === 'globalRecvMsgOpt') {
    updateInfo[key] = vaule
      ? MessageReceiveOptType.NotNotify
      : MessageReceiveOptType.Normal
  }
  if (key === 'allowAddFriend') {
    updateInfo[key] = !vaule ? BusinessAllowType.Allow : BusinessAllowType.NotAllow
  }

  updateBusinessInfo(updateInfo)
    .then(() => {
      userStore.updateSelfInfo({ ...updateInfo })
      showToast(t('messageTip.nomalSuccess'))
    })
    .catch((err) => showToast(err.errMsg || t('messageTip.nomalFailed')))
    .finally(() => (switchLoading[key] = false))
}

const tryClearChatLogs = () => {
  showConfirmDialog({
    title: t('profileMenu.clearChatHistory'),
    message: t('popover.clearChatHistory'),
    beforeClose: (action: string) => {
      return new Promise((resolve) => {
        if (action !== 'confirm') {
          resolve(true)
          return
        }
        IMSDK.deleteAllMsgFromLocalAndSvr()
          .then(() => {
            messageStore.clearHistoryMessage()
            feedbackToast()
          })
          .catch((error: unknown) => feedbackToast({ error }))
          .finally(() => resolve(true))
      })
    },
  })
}
</script>

<style lang="scss" scoped></style>
