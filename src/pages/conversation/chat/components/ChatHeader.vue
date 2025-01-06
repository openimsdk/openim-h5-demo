<template>
  <van-nav-bar
    placeholder
    fixed
    left-arrow
    :clickable="false"
    :border="false"
    @click-left="back"
  >
    <template #left>
      <img class="mr-4 h-[23px] min-w-[23px]" :src="arrows_left" alt="" />
    </template>
    <template #title>
      <div class="flex h-full flex-col justify-evenly">
        <div class="flex items-center justify-center">
          <span class="flex-1 truncate">{{
            conversationStore.storeCurrentConversation.showName
          }}</span>
          <span>{{ titleSuffix }}</span>
          <img v-if="notAccept" class="h-4 w-4" :src="not_accept" alt="" />
        </div>
        <online-or-typing-status v-if="isSingle" />
      </div>
    </template>
    <template #right>
      <!-- <img class="h-[23px] min-w-[23px] mr-4" :src="call" alt="" /> -->
      <!-- <img class="h-[23px] min-w-[23px] mr-4" :src="call" alt="" /> -->
      <img class="h-[23px] min-w-[23px]" :src="more" alt="" @click="toSetting" />
    </template>
  </van-nav-bar>
</template>

<script setup lang="ts">
import arrows_left from '@/assets/images/chatHeader/arrows_left.png'
import not_accept from '@assets/images/conversation/not_accept.png'
import call from '@/assets/images/chatHeader/call.png'
import more from '@/assets/images/chatHeader/more.png'
import useConversationStore from '@/store/modules/conversation'
import { MessageReceiveOptType, SessionType } from '@openim/wasm-client-sdk'
import OnlineOrTypingStatus from './OnlineOrTypingStatus.vue'

const router = useRouter()
const conversationStore = useConversationStore()

const isSingle = computed(
  () =>
    conversationStore.storeCurrentConversation.conversationType === SessionType.Single,
)
const notAccept = computed(
  () =>
    conversationStore.storeCurrentConversation.recvMsgOpt !==
    MessageReceiveOptType.Normal,
)
const isNotification = computed(
  () =>
    conversationStore.storeCurrentConversation.conversationType ===
    SessionType.Notification,
)
const titleSuffix = computed(() => {
  let suffix = ''
  if (!isNotification.value && !isSingle.value) {
    suffix = `(${conversationStore.storeCurrentGroupInfo.memberCount || 0})`
  }
  return suffix
})

const back = () => {
  router.push('conversation')
}

const toSetting = () => {
  router.push(isSingle.value ? 'singleSetting' : 'groupSetting')
}
</script>

<style lang="scss" scoped>
:deep(.van-nav-bar__title) {
  height: 100%;
}

:deep(.van-nav-bar) {
  border-bottom: 1px solid #e8eaef;
}
</style>
