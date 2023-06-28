<template>
  <div class="flex-1 overflow-hidden relative">
    <virtual-list :class="{ '!flex-col': overflow }" ref="vsl" class="my_scrollbar h-full overflow-y-auto"
      :data-key="'clientMsgID'" :data-sources="messageStore.storeHistoryMessageList" :topThreshold="120"
      :data-component="(message: MessageItem) => checkIsNotification(message) ? SystemNotificationItem : MessageItemVue"
      :estimate-size="80" @totop="onTotop" @resized="onItemRendered">
    </virtual-list>
    <div v-show="initLoading" class="!absolute top-0 h-full w-full flex justify-center items-center bg-white">
      <van-loading type="spinner" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { TipTypes } from '@/constants/enum';
import useMessageStore from '@/store/modules/message';
import VirtualList from '@components/VirtualList';
import { MessageItem } from 'open-im-sdk-wasm/lib/types/entity';
import useHistoryMessageList from '../useHistoryMessageList';
import { useMessageReceipt } from '../useMessageReceipt';
import MessageItemVue from './MessageItem/MessageItem.vue';
import SystemNotificationItem from './SystemNotificationItem.vue';
import { MessageType } from 'open-im-sdk-wasm/lib/types/enum';


const emit = defineEmits([]);
const props = defineProps();

const messageStore = useMessageStore();

useMessageReceipt();
const historyMessageState = useHistoryMessageList();
const {
  onItemRendered,
  onTotop,
} = historyMessageState;
const vsl = toRef(historyMessageState, "vsl");
const overflow = toRef(historyMessageState, "overflow");
const initLoading = toRef(
  historyMessageState,
  "initLoading"
);

const checkIsNotification = computed(() => (message: MessageItem) => {
  if (message.contentType === MessageType.GROUPINFOUPDATED) {
    let detail
    try {
      detail = JSON.parse(message.notificationElem?.detail)
    } catch (e) {
    }
    return detail?.group?.notification === undefined
  }
  return TipTypes.includes(message.contentType)
})

</script>

<style lang='scss' scoped>
</style>