<template>
  <div
    ref="messageContainerRef"
    class="message_item"
    :class="{
      message_item_self: isSelfMsg,
      message_item_checked: showCheck,
      message_item_active: isActive || source.jump,
    }"
  >
    <div class="message_container_wrap">
      <Avatar
        ref="avatarRef"
        :size="42"
        :src="source.senderFaceUrl"
        :desc="source.senderNickname"
        @click="toDetails"
      />
      <div class="message_container">
        <div class="mb-1 max-w-[240px] truncate text-xs text-[#666]">
          <span className="text-[var(--sub-text)]">
            {{ formatMessageTime(source.sendTime) }}
          </span>
          <span>{{ ' ' }}</span>
          <span v-if="!isSing">{{ source.senderNickname }}</span>
        </div>
        <component
          :message="source"
          :is-self-msg="isSelfMsg"
          :disabled="showCheck || isActive"
          :is="getRenderComp"
        ></component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from '@/components/Avatar/index.vue'
import TextMessageRenderer from './TextMessageRenderer.vue'
import MediaMessageRenderer from './MediaMessageRenderer.vue'
import CatchMsgRenderer from './CatchMsgRenderer.vue'
import { MessageType, SessionType } from '@openim/wasm-client-sdk'
import useUserStore from '@/store/modules/user'
import { ExedMessageItem } from './data'
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

const getRenderComp = computed(() => {
  switch (props.source.contentType) {
    case MessageType.TextMessage:
      return TextMessageRenderer
    case MessageType.PictureMessage:
      return MediaMessageRenderer
    default:
      return CatchMsgRenderer
  }
})

const toDetails = async (e: Event) => {
  e.preventDefault()
  contactStore.getUserCardData(props.source.sendID, props.source.groupID)
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
