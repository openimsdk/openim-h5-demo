<template>
  <div ref="target" class="bg-[#F0F2F6]">
    <van-grid class="px-3 py-3" :border="false" :column-num="4">
      <van-grid-item
        v-for="action in actionList"
        :key="action.type"
        clickable
        :icon="action.icon"
        :text="action.text"
        @click="clickAction(action)"
      />
    </van-grid>
    <van-uploader
      v-show="false"
      ref="uploaderRef"
      :accept="uploadChooseOptions.accept"
      :capture="uploadChooseOptions.capture"
      :preview-image="false"
      multiple
      max-count="1"
      :after-read="afterReadFile"
    />
    <van-action-sheet
      v-model:show="actionSheetVisible"
      teleport="body"
      :actions="actionSheetActions"
      @select="onActionSelect"
    />
    <div class="dac"></div>
  </div>
</template>

<script setup lang="ts">
import image from '@/assets/images/chatFooter/image.png'
import call from '@/assets/images/chatFooter/call.png'

import { onClickOutside } from '@vueuse/core'
import { ActionSheetAction, UploaderFileListItem, UploaderInstance } from 'vant'
import useConversationStore from '@/store/modules/conversation'
import { ChatFooterActionType } from '@/constants/action'
import { useInviteRtc } from '@/hooks/useInviteRtc'
import { SessionType } from '@openim/wasm-client-sdk'

const { t } = useI18n()
const { inviteRtc } = useInviteRtc()

const isSingle = computed(
  () =>
    conversationStore.storeCurrentConversation.conversationType === SessionType.Single,
)

type ChatFooterActionEmits = {
  (event: 'closeActionBar'): void
  (event: 'getFile', uploadData: UploaderFileListItem): void
}

type ChatFooterActionItem = {
  text: string
  icon: string
  type: ChatFooterActionType
}

const actionList = computed(() => {
  if (!isSingle.value) {
    return [
      {
        text: t('footerAction.album'),
        icon: image,
        type: ChatFooterActionType.Album,
      },
    ]
  }
  return [
    {
      text: t('footerAction.album'),
      icon: image,
      type: ChatFooterActionType.Album,
    },
    {
      text: t('rtc.video'),
      icon: call,
      type: ChatFooterActionType.VideoCall,
    },
  ]
})

const albumActions = [
  {
    name: t('picture'),
    type: ChatFooterActionType.Album,
  },
] as unknown as ActionSheetAction[]

const videoCallActions = [
  {
    name: t('rtc.voice'),
    type: ChatFooterActionType.VoiceCall,
  },
  {
    name: t('rtc.video'),
    type: ChatFooterActionType.VideoCall,
  },
] as unknown as ActionSheetAction[]

const conversationStore = useConversationStore()
const emit = defineEmits<ChatFooterActionEmits>()

const actionSheetVisible = ref(false)
const actionSheetActions = ref<ActionSheetAction[]>([])
const uploadChooseOptions = reactive({
  accept: 'image/*',
  capture: undefined as any,
})
const target = ref(null)
const uploaderRef = ref<UploaderInstance>()

onClickOutside(target, () => emit('closeActionBar'), {
  ignore: ['.van-overlay', '.van-action-sheet__content'],
})

const onActionSelect = ({ type }: any, idx: number) => {
  if (
    type === ChatFooterActionType.VoiceCall ||
    type === ChatFooterActionType.VideoCall
  ) {
    actionSheetVisible.value = false
    inviteRtc(type, [conversationStore.currentConversation.userID])
    return
  }
  nextTick(() => uploaderRef.value?.chooseFile())
  actionSheetVisible.value = false
}

const clickAction = ({ type }: ChatFooterActionItem) => {
  console.log(type)
  switch (type) {
    case ChatFooterActionType.Album:
      actionSheetActions.value = [...albumActions]
      actionSheetVisible.value = true
      break
    case ChatFooterActionType.VideoCall:
      actionSheetActions.value = [...videoCallActions]
      actionSheetVisible.value = true
      break
    default:
      break
  }
}

const afterReadFile = (data: UploaderFileListItem | UploaderFileListItem[]) => {
  if (!Array.isArray(data)) {
    data = [data]
  }
  data.map((item) => {
    emit('getFile', item)
  })
}
</script>

<style lang="scss" scoped>
:deep(.van-icon__image) {
  width: 48px;
  height: 48px;
}

:deep(.van-grid-item__content) {
  background: none;
  padding: 6px 8px;
}
</style>
