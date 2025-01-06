<template>
  <div class="flex items-center justify-center">
    <i
      v-if="!typing"
      class="mr-1 inline-block h-[6px] w-[6px] rounded-full bg-[#10CC64]"
      :class="{ 'bg-[#999]': onlineState?.status === OnlineState.Offline }"
    />
    <span v-if="typing" class="text-xs font-normal text-[#999]">{{
      $t('typing')
    }}</span>
    <span v-else class="text-xs font-normal text-[#999]">{{
      platformToDetails(onlineState)
    }}</span>
  </div>
</template>

<script setup lang="ts">
import useConversationStore from '@/store/modules/conversation'
import emitter from '@/utils/events'
import { IMSDK } from '@/utils/imCommon'
import { CbEvents } from '@openim/wasm-client-sdk'
import type { UserOnlineState, WSEvent } from '@openim/wasm-client-sdk/lib/types/entity'
import { OnlineState, Platform } from '@openim/wasm-client-sdk'

const platformMap: Record<Platform, string> = {
  1: 'iOS',
  2: 'Android',
  3: 'Windows',
  4: 'MacOSX',
  5: 'Web',
  7: 'Linux',
  8: 'AndroidPad',
  9: 'iPad',
}

const { t } = useI18n()
const conversationStore = useConversationStore()

const userID = computed(() => conversationStore.storeCurrentConversation.userID)

const typing = ref(false)
const timer = ref<NodeJS.Timer | null>(null)
const onlineState = reactive<UserOnlineState>({
  platformIDs: [],
  status: 1,
  userID: userID.value,
})

const platformToDetails = (state?: UserOnlineState) => {
  if (!state || state.status === OnlineState.Offline) return t('offline')
  let string = ''
  state.platformIDs?.map((platform) => {
    string += `${platformMap[platform]}/`
  })
  return `${string.slice(0, -1)}${t('online')}`
}

const userStatusChangeHandler = ({ data }: WSEvent<UserOnlineState>) => {
  if (data.userID === userID.value) {
    onlineState.platformIDs = data.platformIDs
    onlineState.status = data.status
  }
}

const typingHandler = () => {
  typing.value = true
  timer.value = setTimeout(() => {
    if (timer.value) {
      clearTimeout(timer.value)
    }
    typing.value = false
  }, 1000)
}

onMounted(() => {
  IMSDK.on(CbEvents.OnUserStatusChanged, userStatusChangeHandler)
  IMSDK.subscribeUsersStatus([userID.value]).then(({ data }) => {
    onlineState.platformIDs = data[0].platformIDs
    onlineState.status = data[0].status
  })
  emitter.on('TYPING_UPDATE', typingHandler)
})

onBeforeUnmount(() => {
  IMSDK.off(CbEvents.OnUserStatusChanged, userStatusChangeHandler)
  IMSDK.unsubscribeUsersStatus([userID.value])
  if (timer.value) {
    clearTimeout(timer.value)
  }
  emitter.off('TYPING_UPDATE', typingHandler)
})
</script>

<style lang="scss" scoped></style>
