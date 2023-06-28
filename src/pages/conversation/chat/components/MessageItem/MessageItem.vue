<template>
  <div ref="messageContainerRef" class="message_item"
    :class="{ 'message_item_self': isSelfMsg}"
   >
    <div class="message_container_wrap">
      <Avatar ref="avatarRef" :size="42" :src="source.senderFaceUrl"
        :desc="source.senderNickname" @click="toDetails" />
      <div class="message_container">
        <div class="max-w-[240px] text-xs text-[#666] mb-1 truncate">{{ source.senderNickname }}</div>
        <MessageMenu :message="source" :disabled="showCheck || isActive">
          <component :message="source" :is-self-msg="isSelfMsg"
            :disabled="showCheck || isActive" :is="getRenderComp"></component>
        </MessageMenu>
        <MessageReadState v-if="isSelfMsg"
          :message="source"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from "@/components/Avatar/index.vue";
import TextMessageRenderer from "./TextMessageRenderer.vue";
import AudioMessageRenderer from "./AudioMessageRenderer.vue";
import CardMessageRenderer from "./CardMessageRenderer.vue";
import FileMessageRenderer from "./FileMessageRenderer.vue";
import LocationMessageRenderer from "./LocationMessageRenderer.vue";
import MediaMessageRenderer from "./MediaMessageRenderer.vue";
import MergeMessageRenderer from "./MergeMessageRenderer.vue";
import CatchMsgRenderer from "./CatchMsgRenderer.vue";
import MessageReadState from "./MessageReadState.vue";
import { AllowType, MessageType } from "open-im-sdk-wasm/lib/types/enum";
import useUserStore from "@/store/modules/user";
import { ExedMessageItem } from "./data";
import { useMessageIsRead } from "./useMessageIsRead";
import MessageMenu from "../MessageMenu.vue";
import useContactStore from "@/store/modules/contact";
import useConversationStore from "@/store/modules/conversation";

interface MessageItemProps {
  source: ExedMessageItem;
  showCheck?: boolean;
  isPreView?: boolean;
  isActive?: boolean;
}

const userStore = useUserStore();
const contactStore = useContactStore();
const conversationStore = useConversationStore();
const props = defineProps<MessageItemProps>();

const { source, showCheck } = toRefs(props);
const messageContainerRef = ref();
const avatarRef = ref();

const isSelfMsg = computed(() => userStore.selfInfo.userID === source.value.sendID);
const getRenderComp = computed(() => {
  switch (props.source.contentType) {
    case MessageType.TEXTMESSAGE:
    case MessageType.ATTEXTMESSAGE:
    case MessageType.QUOTEMESSAGE:
      return TextMessageRenderer;
    case MessageType.VOICEMESSAGE:
      return AudioMessageRenderer;
    case MessageType.VIDEOMESSAGE:
    case MessageType.PICTUREMESSAGE:
      return MediaMessageRenderer;
    case MessageType.CARDMESSAGE:
      return CardMessageRenderer;
    case MessageType.FILEMESSAGE:
      return FileMessageRenderer;
    case MessageType.LOCATIONMESSAGE:
      return LocationMessageRenderer;
    case MessageType.MERGERMESSAGE:
      return MergeMessageRenderer;
    default:
      return CatchMsgRenderer;
  }
})

useMessageIsRead({
  messageContainerRef,
  isSelfMsg,
  isRead: props.source.isRead,
  isPreView: props.isPreView!,
  clientMsgID: props.source.clientMsgID,
});

const toDetails = async () => {
  if (props.showCheck) {
    return;
  }
  if (props.source.groupID && conversationStore.storeCurrentGroupInfo.lookMemberInfo === AllowType.NotAllowed) {
    return;
  }
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

  .check_wrap {
    min-width: 20px;
    margin-top: 10px;
    margin-right: 12px;
  }

  .need_bg {
    padding: 8px 12px;
    border-radius: 4px;
    background-color: #F0F0F0;
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
      transform: translate(-50%, 100%)
    }

  }

  &_self {
    flex-direction: row-reverse;

    .check_wrap {
      margin-right: 0;
      margin-left: 12px;
    }

    .need_bg {
      background-color: #DCEBFE;
    }

    .message_container_wrap {
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
