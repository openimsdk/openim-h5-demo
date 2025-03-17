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
        </div>
      </div>
    </template>
    <template #right>
      <img class="h-[23px] min-w-[23px]" :src="more" alt="" @click="toSetting" />
    </template>
  </van-nav-bar>
</template>

<script setup lang="ts">
import arrows_left from '@/assets/images/chatHeader/arrows_left.png'
import more from '@/assets/images/chatHeader/more.png'
import useConversationStore from '@/store/modules/conversation'
import { SessionType } from '@openim/wasm-client-sdk'

const router = useRouter()
const conversationStore = useConversationStore()

const isSingle = computed(
  () =>
    conversationStore.storeCurrentConversation.conversationType === SessionType.Single,
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
