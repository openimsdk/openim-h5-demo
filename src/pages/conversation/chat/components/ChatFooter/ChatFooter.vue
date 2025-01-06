<template>
  <div>
    <div v-if="getPlaceholder.length > 0" class="flex h-[54px] items-center justify-center bg-[#F0F2F6]">
      <span class="text-sm text-[#8E9AB0]">{{ getPlaceholder }}</span>
    </div>
    <div v-else id="chat_footer" class="flex items-center bg-[#F0F2F6] px-3 py-3">
      <img @click="toggleRecording" class="mr-3 h-[26px] min-w-[26px]" :src="recording ? keyboard : audio" alt="" />
      <div class="flex-grow">
        <div v-show="recording" ref="recordingBtnRef" @touchmove="touchMoveSpeech" @touchend="endRecord"
          class="flex h-8 items-center justify-center rounded bg-white">
          <span>{{ $t('buttons.holdSpeak') }}</span>
        </div>
        <CustomEdit v-show="!recording" class="bg-[#fff]" ref="inputRef" @change="inputChange"
          @focus="onFocusUpdate(true)" @blur="onFocusUpdate(false)" v-model:input="messageContent"
          :placeholder="$t('placeholder.pleaseInput')" @trigger-at="() => { }" />
      </div>
      <img @click="clickEmojiBtn" class="ml-3 h-[26px] min-w-[26px]" :src="emoji" alt="" />
      <img v-show="!messageContent" @click="clickAddBtn" class="ml-3 h-[26px] min-w-[26px]" :src="add" alt="" />
      <img v-show="messageContent" @click="switchTextMessage" class="ml-3 h-[26px] min-w-[26px]" :src="send"
        alt="send" />
    </div>
    <ChatFooterAction v-show="showActionBar" @closeActionBar="closeActionBar" @getFile="getFile" />
    <ChatFooterEmoji v-show="showEmojiBar" @closeEmojiBar="closeEmojiBar" @emojiClick="emojiClick" />
    <ChatFooterRecording ref="recordingOverlayRef" @recordFinish="recordFinish" />
  </div>
</template>

<script setup lang="ts">
import add from '@/assets/images/chatFooter/add.png'
import audio from '@/assets/images/chatFooter/audio.png'
import emoji from '@/assets/images/chatFooter/emoji.png'
import keyboard from '@/assets/images/chatFooter/keyboard.png'
import send from '@/assets/images/chatFooter/send.png'

import CustomEdit from '@/components/CustomEdit/index.vue'
import ChatFooterAction from './ChatFooterAction.vue'
import ChatFooterEmoji from './ChatFooterEmoji.vue'
import ChatFooterRecording from './ChatFooterRecording.vue'
import { onLongPress, useThrottleFn } from '@vueuse/core'
import {
  GroupMemberRole,
  GroupStatus,
  MessageType,
  SessionType,
} from '@openim/wasm-client-sdk'
import { showToast, UploaderFileListItem } from 'vant'
import useSendMessage from '@/hooks/useSendMessage'
import useConversationStore from '@/store/modules/conversation'
import useContactStore from '@/store/modules/contact'
import { IMSDK } from '@/utils/imCommon'
import { feedbackToast } from '@/utils/common'
import emitter from '@/utils/events'
import { checkIsSafari } from '@/utils/common'
import useCreateNomalMessage from './useCreateNomalMessage'
import useCreateFileMessage from './useCreateFileMessage'

const emit = defineEmits([])
defineProps()

const { t } = useI18n()
const conversationStore = useConversationStore()
const contactStore = useContactStore()

// message
const messageContent = ref('')
const inputRef = ref()
const isJoinGroup = ref(true)

const { createFileMessage } = useCreateFileMessage()

const { getAtList, switchNomalMessage } = useCreateNomalMessage({
  messageContent,
})
const { sendMessage } = useSendMessage()

const isSingle = computed(
  () =>
    conversationStore.storeCurrentConversation.conversationType === SessionType.Single,
)

const getPlaceholder = computed(() => {
  const isMutedAll = conversationStore.currentGroupInfo.status === GroupStatus.Muted
  const roleLevel = conversationStore.storeCurrentMemberInGroup.roleLevel
  if (!isSingle.value && isMutedAll) {
    return roleLevel !== GroupMemberRole.Normal ? '' : t('placeholder.allMuted')
  }

  const isDismissed =
    conversationStore.currentGroupInfo.status === GroupStatus.Dismissed
  if (!isSingle.value && isDismissed) {
    return t('placeholder.leaveGroup')
  }

  if (!isSingle.value && !isJoinGroup.value) {
    return t('placeholder.leaveGroup')
  }

  const isMute = conversationStore.storeCurrentMemberInGroup.muteEndTime > Date.now()
  if (!isSingle.value && isMute) {
    return t('placeholder.singleBanned')
  }

  const isBlack = contactStore.storeBlackList.find(
    (black) => black.userID === conversationStore.storeCurrentConversation.userID,
  )
  if (isSingle.value && isBlack) {
    return t('placeholder.beBlack')
  }

  return ''
})

const inputChange = useThrottleFn(() => {
  if (
    conversationStore.storeCurrentConversation.conversationType !== SessionType.Single
  ) {
    return
  }
  IMSDK.typingStatusUpdate({
    recvID: conversationStore.storeCurrentConversation.userID,
    msgTip: 'yes',
  })
}, 2000)

const onFocusUpdate = (isFocus: boolean) => {
  if (!checkIsSafari()) {
    return
  }
  setTimeout(() => emitter.emit('KEYBOARD_UPDATE'), 100)
  if (isFocus) {
    setTimeout(() => window.scroll(0, 0), 101)
  }
}

const switchTextMessage = async () => {
  const message = await switchNomalMessage()
  if (message) {
    sendMessage({ message })
  }
  resetState()
}

const emojiClick = (str: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(str, 'text/html')
  const nodes = Array.from(doc.body.childNodes)
  inputRef.value.insertAtCursor(nodes)
}

const resetState = () => {
  messageContent.value = ''
  conversationStore.updateQuoteMessage()
  inputRef.value.clear()
}

// recording
const recording = ref(false)
const recordingBtnRef = ref()
const recordingOverlayRef = ref()

const onMenuLongPressCall = () => {
  recordingOverlayRef.value.isShowOverlay()
}

onLongPress(recordingBtnRef, onMenuLongPressCall, { modifiers: { prevent: true } })

const toggleRecording = async () => {
  if (!recording.value) {
    try {
      await recordingOverlayRef.value.requestPermission()
    } catch (error) {
      console.log(error)
      showToast(t('messageTip.environmentNotSupported'))
      return
    }
  }
  recording.value = !recording.value
}

const touchMoveSpeech = useThrottleFn((event: TouchEvent) => {
  recordingOverlayRef.value.touchMoveSpeech(event)
}, 250)

const endRecord = () => {
  recordingOverlayRef.value.isShowOverlay(false)
}

const recordFinish = async (blob: File, duration: number) => {
  const { error, message, buffer } = await createFileMessage(
    blob,
    MessageType.VoiceMessage,
    duration,
  )
  if (error || !message) {
    feedbackToast({ error, message: error })
    return
  }
  sendMessage({ message })
}

// action bar
const showActionBar = ref(false)
const showEmojiBar = ref(false)

const closeActionBar = () => {
  showActionBar.value = false
}
const closeEmojiBar = () => {
  showEmojiBar.value = false
}
const clickAddBtn = () => {
  if (showEmojiBar.value) {
    showEmojiBar.value = false
  }
  showActionBar.value = !showActionBar.value
}
const clickEmojiBtn = () => {
  recording.value = false
  if (showActionBar.value) {
    showActionBar.value = false
  }
  showEmojiBar.value = !showEmojiBar.value
}
const getFile = async (uploadData: UploaderFileListItem) => {
  let messageType = MessageType.FileMessage
  if (uploadData.file?.type.includes('image')) {
    messageType = MessageType.PictureMessage
  }
  if (uploadData.file?.type.includes('video')) {
    messageType = MessageType.VideoMessage
  }
  const { error, message, buffer, snapBuffer } = await createFileMessage(
    uploadData.file!,
    messageType,
  )
  if (error || !message) {
    feedbackToast({ error, message: error })
    return
  }
  sendMessage({
    message,
  })
}

const checkGroupMembership = async () => {
  isJoinGroup.value = true

  if (isSingle.value) return
  if (!conversationStore.currentConversation.groupID) return

  const { data } = await IMSDK.isJoinGroup<boolean>(
    conversationStore.currentConversation.groupID,
  )
  isJoinGroup.value = data
}

watch(
  () => conversationStore.storeQuoteMessage,
  (val) => {
    if (val) {
      inputRef.value.inputRef.focus()
    }
  },
)

watch(
  () => conversationStore.currentConversation.conversationID,
  (val, prevCount) => {
    checkGroupMembership()
    let cleanText = messageContent.value
    const atEls = getAtList()

    // console.error('val, prevCount', val, prevCount)

    if (messageContent.value && prevCount) {
      if (atEls.length > 0) {
        atEls.map((el) => (cleanText = cleanText.replace(el.tag, `@${el.userID} `)))
        const pattern = /@\S+\s/g
        const arr = cleanText.match(pattern)
        arr?.map((item) => {
          const member = atEls.find((el) => el.userID === item.slice(1, -1))
          if (member) {
            const reg = new RegExp(item, 'g')
            cleanText = cleanText.replace(
              reg,
              `<b class="at_el" contenteditable="false" data_id="${member.userID}" data_name="${member.nickname}">@${member.nickname} </b>`,
            )
          }
        })
      }
    }
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  checkGroupMembership()

  if (!inputRef.value) return
  inputRef.value.inputRef.focus()
})

onActivated(() => {
  checkGroupMembership()
  if (!inputRef.value) return
  inputRef.value.clear()
  inputRef.value.inputRef.focus()
})
</script>

<style lang="scss" scoped>
:deep(.van-button__content) {
  width: max-content;
}
</style>
