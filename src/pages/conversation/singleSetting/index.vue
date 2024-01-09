<template>
  <div class="page_container !overflow-y-auto">
    <NavBar :title="$t('chatSetting')" />

    <div class="flex items-start bg-white px-4 pt-4 pb-3 mt-2 mx-3 rounded-md overflow-hidden">
      <div class="flex flex-col mr-3">
        <Avatar :size="44" :src="conversationStore.storeCurrentConversation.faceURL"
          :desc="conversationStore.storeCurrentConversation.showName" @click="toUser" />
        <span class="w-12 truncate mt-2">{{ conversationStore.storeCurrentConversation.showName }}</span>
      </div>
      <img width="44" :src="create_group" alt="" @click="createGroup" />
    </div>

    <div class="mt-2 mx-3 rounded-md overflow-hidden">
      <SettingRowItem danger :title="$t('popover.clearModalTitle')" @click-item="clearLogs" />
    </div>
  </div>
</template>

<script name="singleSetting" setup lang='ts'>
import create_group from '@assets/images/setting/create_group.png'

import NavBar from '@/components/NavBar/index.vue';
import Avatar from '@/components/Avatar/index.vue';
import SettingRowItem from '@/components/SettingRowItem/index.vue';
import useConversationSettings from '@/hooks/useConversationSettings';
import useContactStore from '@/store/modules/contact';



const show = ref(false);
const router = useRouter()
const contactStore = useContactStore();

const { conversationStore , clearLogs } = useConversationSettings()


const toUser = () => {
  contactStore.getUserCardData(conversationStore.storeCurrentConversation.userID)
}

const createGroup = () => {
  router.push({
    path: 'createGroup',
    state: {
      prevCheckedUserList: JSON.stringify([{
        ...conversationStore.storeCurrentConversation,
        nickname: conversationStore.storeCurrentConversation.showName
      }]),
    }
  })
}

</script>

<style lang='scss' scoped></style>