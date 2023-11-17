<template>
  <div class="page_container">
    <NavBar :title="$t('notification')" />
    <div class="flex-1 overflow-hidden relative">
      <virtual-list ref="vsl" class="my_scrollbar h-full overflow-y-auto !flex-col" :data-key="'clientMsgID'"
        :data-sources="messageStore.storeHistoryMessageList" :bottomThreshold="160" :data-component="NotifyMessageItem"
        :estimate-size="88" @onBottom="onToBottom" @resized="onItemRendered">
      </virtual-list>
      <div v-show="initLoading" class="!absolute top-0 h-full w-full flex justify-center items-center bg-white">
        <van-loading type="spinner" />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import useConversationStore from '@/store/modules/conversation';
import useMessageStore from '@/store/modules/message';
import { IMSDK } from '@/utils/imCommon';
import VirtualList from '@components/VirtualList';
import NotifyMessageItem from './NotifyMessageItem.vue'
import useHistoryNotificationList from './useHistoryNotificationList';

const messageStore = useMessageStore();
const conversationStore = useConversationStore();

const historyMessageState = useHistoryNotificationList();
const {
  onItemRendered,
  onToBottom,
} = historyMessageState;
const vsl = toRef(historyMessageState, "vsl");
const initLoading = toRef(
  historyMessageState,
  "historyNotificationInitLoading"
);

const checkUnRead = () => {
  if (conversationStore.storeCurrentConversation.unreadCount > 0) {
    IMSDK.markConversationMessageAsRead(conversationStore.storeCurrentConversation.conversationID);
  }
}

onBeforeMount(() => {
  checkUnRead()
})

onBeforeUnmount(() => {
  checkUnRead();
})

</script>

<style lang='scss' scoped></style>