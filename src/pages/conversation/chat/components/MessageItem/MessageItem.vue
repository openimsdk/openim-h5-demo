<template>
  <div ref="messageContainerRef" class="message_item" :class="{
    message_item_self: isSelfMsg,
    message_item_checked: showCheck,
    message_item_active: isActive || source.jump,
  }" @click="clickMessage">
    <van-checkbox class="m-3" v-if="showCheck" v-model="source.checked"
      :disabled="source.disabled || source.contentType === MessageType.GroupAnnouncementUpdated" @click.stop>
    </van-checkbox>
    <div class="message_container_wrap">
      <Avatar ref="avatarRef" :size="42" :src="source.senderFaceUrl" :desc="source.senderNickname" @click="toDetails" />
      <div class="message_container">
        <div class="mb-1 max-w-[240px] truncate text-xs text-[#666]">
          <span className="text-[var(--sub-text)]">
            {{ formatMessageTime(source.sendTime) }}
          </span>
          <span>{{ ' ' }}</span>
          <span v-if="!isSing">{{ source.senderNickname }}</span>
        </div>
        <MessageMenu :message="source" :disabled="showCheck" :isSelfMsg="isSelfMsg" :isPreView="props.isPreView">
          <MessageSendState v-if="isSelfMsg" :message="source" />
          <component :message="source" :is-self-msg="isSelfMsg" :announce-content="groupAnnounceData.notification"
            :disabled="showCheck || isActive" :is="getRenderComp"></component>
          <MessageSendState v-if="!isSelfMsg" :message="source" />
        </MessageMenu>
        <QuoteMessageRenderer v-if="
          source.contentType === MessageType.QuoteMessage ||
          source.atTextElem?.quoteMessage
        " :message="source" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from '@/components/Avatar/index.vue'
import TextMessageRenderer from './TextMessageRenderer.vue'
import AudioMessageRenderer from './AudioMessageRenderer.vue'
import CardMessageRenderer from './CardMessageRenderer.vue'
import FileMessageRenderer from './FileMessageRenderer.vue'
import GroupAnnounceRenderer from './GroupAnnounceRenderer.vue'
import LocationMessageRenderer from './LocationMessageRenderer.vue'
import MediaMessageRenderer from './MediaMessageRenderer.vue'
import MergeMessageRenderer from './MergeMessageRenderer.vue'
import CatchMsgRenderer from './CatchMsgRenderer.vue'
import FaceMessageRenderer from './FaceMessageRenderer.vue'
import {
  AllowType,
  MessageStatus,
  MessageType,
  SessionType,
} from '@openim/wasm-client-sdk'
import useUserStore from '@/store/modules/user'
import { ExedMessageItem } from './data'
import { useMessageIsRead } from './useMessageIsRead'
import MessageReadState from './MessageReadState.vue'
import MessageSendState from './MessageSendState.vue'
import QuoteMessageRenderer from './QuoteMessageRenderer.vue'
import MessageMenu from '../MessageMenu.vue'
import useContactStore from '@/store/modules/contact'
import useConversationStore from '@/store/modules/conversation'
import { formatMessageTime } from '@/utils/imCommon'

interface MessageItemProps {
  source: ExedMessageItem
  showCheck?: boolean
  isPreView?: boolean
  isActive?: boolean
}

const userStore = useUserStore()
const contactStore = useContactStore()
const conversationStore = useConversationStore()
const props = defineProps<MessageItemProps>()

const { source, showCheck } = toRefs(props)
const messageContainerRef = ref()
const avatarRef = ref()

const isSing = computed(
  () => conversationStore.currentConversation.conversationType === SessionType.Single,
)
const isSelfMsg = computed(() => userStore.selfInfo.userID === source.value.sendID)
const groupAnnounceData = computed(() => {
  let detail
  if (props.source.contentType === MessageType.GroupAnnouncementUpdated) {
    try {
      detail = JSON.parse(props.source.notificationElem?.detail!)
    } catch (e) { }
  }
  return {
    notification: detail?.group?.notification,
    opUser: detail?.opUser,
  }
})

const getRenderComp = computed(() => {
  switch (props.source.contentType) {
    case MessageType.TextMessage:
    case MessageType.AtTextMessage:
    case MessageType.QuoteMessage:
      return TextMessageRenderer
    case MessageType.VoiceMessage:
      return AudioMessageRenderer
    case MessageType.VideoMessage:
    case MessageType.PictureMessage:
      return MediaMessageRenderer
    case MessageType.CardMessage:
      return CardMessageRenderer
    case MessageType.FileMessage:
      return FileMessageRenderer
    case MessageType.LocationMessage:
      return LocationMessageRenderer
    case MessageType.MergeMessage:
      return MergeMessageRenderer
    case MessageType.GroupAnnouncementUpdated:
      return GroupAnnounceRenderer
    case MessageType.FaceMessage:
      return FaceMessageRenderer
    default:
      return CatchMsgRenderer
  }
})

useMessageIsRead({
  messageContainerRef,
  isSelfMsg,
  isRead: props.source.isRead,
  isPreView: props.isPreView!,
  isGroupAnnounce: !!groupAnnounceData.value.notification,
  clientMsgID: props.source.clientMsgID,
})

const toDetails = async (e: Event) => {
  e.preventDefault()
  if (props.showCheck) {
    return
  }
  if (
    props.source.groupID &&
    conversationStore.storeCurrentGroupInfo.lookMemberInfo === AllowType.NotAllowed
  ) {
    return
  }
  contactStore.getUserCardData(
    groupAnnounceData.value.opUser?.userID ?? props.source.sendID,
    props.source.groupID,
  )
}

const clickMessage = () => {
  if (
    !props.showCheck ||
    props.source.contentType === MessageType.GroupAnnouncementUpdated
  ) {
    return
  }
  props.source.checked = !props.source.checked
}
</script>

<style lang="scss" scoped>
.message_item {
  display: flex;
  align-items: center;
  padding: 12px 22px;
  color: #333;
  min-height: 40px;
  position: relative;
  -webkit-overflow-scrolling: touch;

  .need_bg {
    padding: 10px 12px;
    border-radius: 6px;
    background-color: #f4f5f7;
  }

  .message_container_wrap {
    display: flex;
  }

  .message_container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 12px;
    max-width: 80%;
    position: relative;

    .message_content_wrap {
      position: relative;
    }

    .time_line {
      font-size: 12px;
      color: #999;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 100%);
    }
  }

  &_self {
    // flex-direction: row-reverse;

    .check_wrap {
      margin-right: 0;
      margin-left: 12px;
    }

    .need_bg {
      border-radius: 6px;
      background-color: #cce7fe;
    }

    .message_container_wrap {
      margin-left: auto;
      flex-direction: row-reverse;
    }

    .message_container {
      margin-left: 0;
      margin-right: 12px;
      align-items: flex-end;
    }
  }

  &_checked {
    align-items: flex-start;
    padding: 12px;
  }

  &_active {
    background-color: rgba(32, 107, 237, 0.2);
    animation: fadeOut 3s forwards;
  }
}

@keyframes fadeOut {
  from {
    background-color: rgba(32, 107, 237, 0.2);
  }

  to {
    background-color: transparent;
  }
}
</style>
