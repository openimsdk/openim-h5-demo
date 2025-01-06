<template>
  <van-swipe-cell>
    <div
      @click="clickConversation"
      class="flex items-center py-[10px] px-[22px] active:bg-[#F3F3F3]"
    >
      <div class="pinned" v-if="source.isPinned"></div>
      <Avatar
        :size="48"
        :src="source.faceURL"
        :desc="source.showName"
        :is-group="isGroup"
        :is-notification="isNotification"
      />
      <div class="mx-3 flex h-12 flex-1 flex-col justify-evenly">
        <div class="max-w-[40vw] truncate text-[15px]">{{ source.showName }}</div>
        <div class="max-w-[40vw] truncate text-[13px] text-[#666]">
          <span
            v-show="messagePrefix"
            class="mr-1"
            :class="{ 'text-[#1B72EC]': activePrefix }"
          >
            {{ messagePrefix }}
          </span>
          <span>{{ formattedMessage }}</span>
        </div>
      </div>
      <div
        class="flex h-12 flex-col items-end text-xs text-[#999]"
        :class="{ 'justify-evenly': notAccept || source.unreadCount > 0 }"
      >
        <span class="w-max">{{ latestMessageTime }}</span>
        <img v-if="notAccept" class="h-4 w-4" :src="not_accept" alt="" />
        <van-badge
          v-else
          class="w-fit"
          color="#F44038"
          :content="source.unreadCount"
          max="99"
          :show-zero="false"
        />
      </div>
    </div>
    <template #right>
      <van-button
        color="#1B72EC"
        :text="$t(!source.isPinned ? 'buttons.pin' : 'buttons.cancelPin')"
        @click="updatePin"
      />
      <van-button
        color="#FF381F"
        :text="$t('buttons.remove')"
        @click="removeConversation"
      />
      <van-button
        v-if="source.unreadCount > 0"
        color="#8E9AB0"
        :text="$t('buttons.markAsRead')"
        @click="markHasRead"
      />
    </template>
  </van-swipe-cell>
</template>

<script setup lang="ts">
import type {
  ConversationItem,
  MessageItem,
} from '@openim/wasm-client-sdk/lib/types/entity'
import Avatar from '@/components/Avatar/index.vue'
import not_accept from '@assets/images/conversation/not_accept.png'
import { formatConversionTime, IMSDK, getConversationContent } from '@/utils/imCommon'
import {
  GroupAtType,
  MessageReceiveOptType,
  SessionType,
} from '@openim/wasm-client-sdk'
import { feedbackToast } from '@/utils/common'
import useConversationStore from '@/store/modules/conversation'
import { GroupSessionTypes } from '@/constants/enum'

type ConversationItemProps = {
  source: ConversationItem
}

const router = useRouter()
const { t } = useI18n()

const conversationStore = useConversationStore()

const emit = defineEmits([])
const props = defineProps<ConversationItemProps>()

const isGroup = GroupSessionTypes.includes(props.source.conversationType)
const isNotification = props.source.conversationType === SessionType.Notification

const notAccept = props.source.recvMsgOpt !== MessageReceiveOptType.Normal

const formattedMessage = computed(() => {
  let parsedMessage: MessageItem | undefined = undefined
  try {
    parsedMessage = JSON.parse(props.source.latestMsg)
  } catch (e) {}
  if (!parsedMessage) return ''
  return getConversationContent(parsedMessage)
})

const latestMessageTime = computed(() =>
  formatConversionTime(props.source.latestMsgSendTime),
)

const messagePrefix = computed(() => {
  let prefix = ''

  if (
    props.source?.recvMsgOpt !== MessageReceiveOptType.Normal &&
    props.source.unreadCount > 0
  ) {
    prefix = t('pieces', { number: props.source.unreadCount })
  }

  if (props.source.groupAtType !== GroupAtType.AtNormal) {
    switch (props.source.groupAtType) {
      case GroupAtType.AtAll:
        prefix = t('messageDesc.atAll')
        break
      case GroupAtType.AtMe:
        prefix = t('messageDesc.atYou')
        break
      case GroupAtType.AtAllAtMe:
        prefix = t('messageDesc.atYou')
        break
      case GroupAtType.AtGroupNotice:
        prefix = t('messageDesc.groupAnnouncement')
        break
    }
  }

  return prefix
})

const activePrefix = computed(
  () => props.source.groupAtType !== GroupAtType.AtNormal || props.source.draftText,
)

const clickConversation = () => {
  conversationStore.updateCurrentConversation(props.source)
  let path = 'chat'
  if (props.source.conversationType === SessionType.Notification) {
    path = 'notifyMessageList'
  }
  router.push(path)
}

const updatePin = () => {
  IMSDK.pinConversation({
    conversationID: props.source.conversationID,
    isPinned: !props.source.isPinned,
  }).catch((error) => feedbackToast({ error }))
}
const removeConversation = () => {
  IMSDK.deleteConversationAndDeleteAllMsg(props.source.conversationID)
    .then(() => conversationStore.delConversationByCID(props.source.conversationID))
    .catch((error) => feedbackToast({ error }))
}
const markHasRead = () => {
  IMSDK.markConversationMessageAsRead(props.source.conversationID).catch((error) =>
    feedbackToast({ error }),
  )
}
</script>

<style lang="scss" scoped>
.pinned {
  position: absolute;
  top: 4px;
  right: 8px;
  width: 8px;
  height: 8px;
  background-image: linear-gradient(to bottom left, #314ffe 50%, white 50%);
}

:deep(.van-button) {
  height: 100%;
  max-width: 70px;
  border-radius: 0;
}

:deep(.van-badge--top-right) {
  transform: translate(0, 0);
}
</style>
