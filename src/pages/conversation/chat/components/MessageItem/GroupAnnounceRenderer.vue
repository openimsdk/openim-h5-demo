<template>
  <div
    class="need_bg w-[220px] border border-[#E8EAEF] !bg-white"
    @click="toGroupAnnouncement"
  >
    <div class="flex items-center">
      <img class="mr-2 h-6 w-6" :src="announce" />
      <span class="text-primary">{{ $t('popover.groupAnnouncement') }}</span>
    </div>
    <div class="mt-2 break-all text-sm">
      {{ announceContent }}
    </div>
  </div>
</template>

<script setup lang="ts">
import useCurrentMemberRole from '@/hooks/useCurrentMemberRole'
import useConversationStore from '@/store/modules/conversation'
import { IMSDK } from '@/utils/imCommon'
import announce from '@assets/images/messageItem/announce.png'

type GroupAnnounceRendererProps = {
  announceContent: string
}
defineProps<GroupAnnounceRendererProps>()

const router = useRouter()
const { isNomal } = useCurrentMemberRole()
const conversationStore = useConversationStore()

const toGroupAnnouncement = () => {
  IMSDK.resetConversationGroupAtType(
    conversationStore.storeCurrentConversation.conversationID,
  )
  router.push({
    path: 'groupAnnouncement',
    query: {
      isNomal: isNomal.value + '',
    },
  })
}
</script>

<style lang="scss" scoped></style>
