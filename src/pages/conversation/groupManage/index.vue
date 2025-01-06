<template>
  <div class="page_container">
    <NavBar :title="$t('groupManage')" />
    <div v-if="isOwner" class="mx-[10px] mt-[10px] overflow-hidden rounded-md bg-white">
      <SettingRowItem :title="$t('groupTransfer')" @click="groupTransfer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar/index.vue'
import SettingRowItem from '@/components/SettingRowItem/index.vue'
import useCurrentMemberRole from '@/hooks/useCurrentMemberRole'
import { MemberListActionEnum } from '@/pages/contact/groupMemberList/data'
import useConversationStore from '@/store/modules/conversation'

const router = useRouter()
const { isOwner } = useCurrentMemberRole()
const conversationStore = useConversationStore()

const groupTransfer = () => {
  router.push({
    path: 'groupMemberList',
    state: {
      groupID: conversationStore.storeCurrentGroupInfo.groupID,
      action: MemberListActionEnum.Transfer,
    },
  })
}
</script>
