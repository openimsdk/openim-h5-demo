<template>
  <div class="relative flex-1 overflow-hidden">
    <virtual-list
      :class="{ '!flex-col': overflow }"
      ref="vsl"
      class="my_scrollbar h-full overflow-y-auto"
      :data-key="'clientMsgID'"
      :data-sources="messageStore.storeHistoryMessageList"
      :topThreshold="120"
      :keeps="20"
      :data-component="
        (message: MessageItem) =>
          checkIsNotification(message) ? SystemNotificationItem : MessageItemVue
      "
      :estimate-size="80"
      @totop="onTotop"
      @resized="onItemRendered"
      @scroll="onScoll"
    >
      <template #header>
        <div v-if="overflow && !initLoading" class="pt-2">
          <div class="spinner" v-show="loadState.loading"></div>
          <div class="finished" v-show="!messageStore.storeHistoryMessageHasMore">
            {{ $t('noMore') }}
          </div>
        </div>
      </template>
    </virtual-list>
    <div
      v-show="initLoading"
      class="!absolute top-0 flex h-full w-full items-center justify-center bg-white"
    >
      <van-loading type="spinner" />
    </div>
  </div>
</template>

<script setup lang="ts">
import useMessageStore from '@/store/modules/message'
import VirtualList from '@components/VirtualList'
import useHistoryMessageList from '../useHistoryMessageList'
import MessageItemVue from './MessageItem/MessageItem.vue'
import SystemNotificationItem from './SystemNotificationItem.vue'
import { MessageItem, MessageType } from '@openim/wasm-client-sdk'
import { TipTypes } from '@/constants/enum'

const emit = defineEmits([])

const messageStore = useMessageStore()

const historyMessageState = useHistoryMessageList()
const { onItemRendered, onTotop, onScoll } = historyMessageState
const vsl = toRef(historyMessageState, 'vsl')
const overflow = toRef(historyMessageState, 'overflow')
const loadState = toRef(historyMessageState, 'loadState')
const initLoading = toRef(historyMessageState, 'initLoading')

const checkIsNotification = computed(() => (message: MessageItem) => {
  if (message.contentType === MessageType.GroupInfoUpdated) {
    let detail
    try {
      detail = JSON.parse(message.notificationElem?.detail!)
    } catch (e) {}
    return detail?.group?.notification === undefined
  }
  return TipTypes.includes(message.contentType)
})
</script>

<style lang="scss" scoped>
.finished {
  font-size: 14px;
  text-align: center;
  color: #bfbfbf;
}

.spinner {
  font-size: 10px;
  margin: 0px auto;
  text-indent: -9999em;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #ffffff;
  background: linear-gradient(to right, #ccc 10%, rgba(255, 255, 255, 0) 42%);
  position: relative;
  animation: load3 1.4s infinite linear;
  transform: translateZ(0);
}

.spinner:before {
  width: 50%;
  height: 50%;
  background: #ccc;
  border-radius: 100% 0 0 0;
  position: absolute;
  top: 0;
  left: 0;
  content: '';
}

.spinner:after {
  background: #ffffff;
  width: 75%;
  height: 75%;
  border-radius: 50%;
  content: '';
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

@-webkit-keyframes load3 {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes load3 {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.group_announcement_tab {
  display: flex;
  position: absolute;
  top: 6px;
  z-index: 10;
  flex-direction: column;
  align-items: flex-start;
  width: 90%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f2f8ff;
  padding: 8px 12px;
  border-radius: 6px;
}
</style>
