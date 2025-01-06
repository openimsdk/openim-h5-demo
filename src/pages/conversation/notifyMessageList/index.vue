<template>
  <div class="page_container">
    <NavBar :title="conversationStore.currentConversation.showName" />
    <div class="relative flex-1 overflow-hidden">
      <virtual-list
        ref="vsl"
        class="my_scrollbar h-full !flex-col overflow-y-auto"
        :data-key="'clientMsgID'"
        :data-sources="dataSources"
        :bottomThreshold="160"
        :data-component="NotifyMessageItem"
        :estimate-size="88"
        @onBottom="onToBottom"
        @resized="onItemRendered"
      >
      </virtual-list>
      <div
        v-show="initLoading"
        class="!absolute top-0 flex h-full w-full items-center justify-center bg-white"
      >
        <van-loading type="spinner" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar/index.vue'
import useConversationStore from '@/store/modules/conversation'
import useMessageStore from '@/store/modules/message'
import { IMSDK } from '@/utils/imCommon'
import VirtualList from '@components/VirtualList'
import NotifyMessageItem from './NotifyMessageItem.vue'
import useHistoryNotificationList from './useHistoryNotificationList'

const messageStore = useMessageStore()
const conversationStore = useConversationStore()

const historyMessageState = useHistoryNotificationList()
const { onItemRendered, onToBottom } = historyMessageState
const vsl = toRef(historyMessageState, 'vsl')
const initLoading = toRef(historyMessageState, 'historyNotificationInitLoading')

const checkUnRead = () => {
  if (conversationStore.storeCurrentConversation.unreadCount > 0) {
    IMSDK.markConversationMessageAsRead(
      conversationStore.storeCurrentConversation.conversationID,
    )
  }
}

const dataSources = computed(() => messageStore.storeHistoryMessageList.reverse())

onBeforeMount(() => {
  checkUnRead()
})

onBeforeUnmount(() => {
  checkUnRead()
})
</script>

<style lang="scss" scoped></style>
