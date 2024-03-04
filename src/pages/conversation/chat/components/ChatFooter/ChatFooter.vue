<template>
  <div>
    <div id="chat_footer" class="flex items-center px-3 py-3 bg-[#F0F2F6]">
      <div class="flex-grow">
        <CustomEdit class="bg-[#fff]" ref="inputRef" @change="inputChange"
          @focus="onFocusUpdate(true)" @blur="onFocusUpdate(false)" v-model:input="messageContent"
          :placeholder="inputPlaceholder" />
      </div>
      <img v-show="!messageContent" @click="clickAddBtn" class="h-[26px] min-w-[26px] ml-3" :src="add" alt="">
      <img v-show="messageContent" @click="switchTextMessage" class="h-[26px] min-w-[26px] ml-3" :src="send" alt="send">
    </div>
    <ChatFooterAction v-show="showActionBar" @closeActionBar="closeActionBar" @getFile="getFile" />
  </div>
</template>

<script setup lang='ts'>
import add from '@/assets/images/chatFooter/add.png'
import send from '@/assets/images/chatFooter/send.png'

import CustomEdit from '@/components/CustomEdit/index.vue';
import ChatFooterAction from './ChatFooterAction.vue';
import { useThrottleFn } from '@vueuse/core';
import { MessageType, SessionType } from 'open-im-sdk-wasm'
import { UploaderFileListItem } from 'vant';
import useSendMessage from '@/hooks/useSendMessage';
import useConversationStore from '@/store/modules/conversation';
import { feedbackToast } from '@/utils/common';
import emitter from "@/utils/events";
import { checkIsSafari } from '@/utils/common';
import useCreateNomalMessage from './useCreateNomalMessage'
import useCreateFileMessage from './useCreateFileMessage'
import { IMSDK } from '@/utils/imCommon';

const emit = defineEmits([]);
defineProps();

const { t } = useI18n()
const conversationStore = useConversationStore();

// message
const messageContent = ref('')
const inputPlaceholder = ref(t('placeholder.pleaseInput'))
const inputRef = ref();

const { createFileMessage } = useCreateFileMessage()

const { switchNomalMessage } = useCreateNomalMessage({
  messageContent,
});
const { sendMessage } = useSendMessage();

const showAtPop = ref(false)

const inputChange = useThrottleFn(() => {
  if (conversationStore.storeCurrentConversation.conversationType !== SessionType.Single) {
    return;
  }
  IMSDK.typingStatusUpdate({ recvID: conversationStore.storeCurrentConversation.userID, msgTip: 'yes' })
}, 2000)

const onFocusUpdate = (isFocus: boolean) => {
  if (!checkIsSafari()) {
    return;
  }
  setTimeout(() => emitter.emit("KEYBOARD_UPDATE"), 100)
  if (isFocus) {
    setTimeout(() => window.scroll(0, 0), 101)
  }
}

const switchTextMessage = async () => {
  const message = await switchNomalMessage();
  if (message) {
    sendMessage({ message })
  }
  resetState()
}

const resetState = () => {
  messageContent.value = ''
  inputRef.value.clear()
}

// action bar
const showActionBar = ref(false)

const closeActionBar = () => {
  showActionBar.value = false
}
const clickAddBtn = () => {
  showActionBar.value = !showActionBar.value
}

const getFile = async (uploadData: UploaderFileListItem) => {
  let messageType = MessageType.FileMessage
  if (uploadData.file?.type.includes('image')) {
    messageType = MessageType.PictureMessage
  }
  if (uploadData.file?.type.includes('video')) {
    messageType = MessageType.VideoMessage
  }
  const { error, message, buffer, snapBuffer } = await createFileMessage(uploadData.file!, messageType)
  if (error || !message) {
    feedbackToast({ error, message: error })
    return;
  }
  sendMessage({ message })
}

</script>

<style lang='scss' scoped>
:deep(.van-button__content) {
  width: max-content;
}
</style>