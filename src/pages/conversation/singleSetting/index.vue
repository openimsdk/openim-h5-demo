<template>
  <div class="page_container !overflow-y-auto">
    <NavBar :title="$t('chatSetting')" />

    <div
      class="mx-3 mt-2 flex items-start overflow-hidden rounded-md bg-white px-4 pt-4 pb-3"
    >
      <div class="mr-3 flex flex-col">
        <Avatar
          :size="44"
          :src="conversationStore.storeCurrentConversation.faceURL"
          :desc="conversationStore.storeCurrentConversation.showName"
          @click="toUser"
        />
        <span class="mt-2 w-12 truncate">{{
          conversationStore.storeCurrentConversation.showName
        }}</span>
      </div>
      <img width="44" :src="create_group" alt="" @click="createGroup" />
    </div>

    <div class="mx-3 mt-2 overflow-hidden rounded-md">
      <SettingRowItem
        :title="$t('chatPin')"
        show-switch
        :loading="switchLoading.pinLoading"
        :checked="conversationStore.storeCurrentConversation.isPinned"
        @updateValue="updateConversationPinState"
      />
      <SettingRowItem
        :title="$t('checks.notDisturb')"
        show-switch
        :loading="switchLoading.recvMsgLoading"
        :checked="
          conversationStore.storeCurrentConversation.recvMsgOpt ===
          MessageReceiveOptType.NotNotify
        "
        @updateValue="
          updateConversationRecvMsgState($event, MessageReceiveOptType.NotNotify)
        "
      />
    </div>

    <div class="mx-3 mt-2 overflow-hidden rounded-md">
      <SettingRowItem
        danger
        :title="$t('popover.clearModalTitle')"
        @click-item="clearLogs"
      />
    </div>
  </div>
</template>

<script name="singleSetting" setup lang="ts">
import create_group from '@assets/images/setting/create_group.png'

import NavBar from '@/components/NavBar/index.vue'
import Avatar from '@/components/Avatar/index.vue'
import SettingRowItem from '@/components/SettingRowItem/index.vue'
import { MessageReceiveOptType } from '@openim/wasm-client-sdk'
import useConversationSettings from '@/hooks/useConversationSettings'
import useContactStore from '@/store/modules/contact'

const router = useRouter()
const contactStore = useContactStore()

const {
  conversationStore,
  switchLoading,
  updateConversationPinState,
  updateConversationRecvMsgState,
  updateBurnDuration,
  clearLogs,
} = useConversationSettings()

const toUser = () => {
  contactStore.getUserCardData(conversationStore.storeCurrentConversation.userID)
}

const createGroup = () => {
  router.push({
    path: 'createGroup',
    state: {
      prevCheckedUserList: JSON.stringify([
        {
          ...conversationStore.storeCurrentConversation,
          nickname: conversationStore.storeCurrentConversation.showName,
        },
      ]),
    },
  })
}
</script>

<style lang="scss" scoped></style>
