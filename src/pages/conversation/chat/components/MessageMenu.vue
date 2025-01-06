<template>
  <van-popover theme="dark" :placement="placement" trigger="manual" v-model:show="showMenu">
    <div class="flex max-w-[192px] flex-wrap px-2 py-2">
      <div v-for="menu in computedMenus" :key="menu.type" @click.prevent="menuClick(menu.type)"
        class="flex flex-col items-center px-2 py-1">
        <img class="h-7 w-7" :src="menu.icon" alt="" />
        <span class="text-xs">{{ menu.title }}</span>
      </div>
    </div>
    <template #reference>
      <div ref="messageContentRef" class="flex items-center">
        <slot></slot>
      </div>
    </template>
  </van-popover>
</template>

<script setup lang="ts">
import { ExedMessageItem, MessageMenuType } from './MessageItem/data'
import { GroupMemberRole, MessageType, SessionType } from '@openim/wasm-client-sdk'

import copy_icon from '@/assets/images/messageMenu/copy.png'
import forward from '@/assets/images/messageMenu/forward.png'
import revoke from '@/assets/images/messageMenu/revoke.png'
import del from '@/assets/images/messageMenu/remove.png'

import { PopoverPlacement, showLoadingToast } from 'vant'
import { onLongPress, useClipboard, useElementBounding } from '@vueuse/core'
import { IMSDK } from '@/utils/imCommon'
import useMessageStore from '@/store/modules/message'
import { feedbackToast } from '@/utils/common'
import { ContactChooseEnum } from '@/pages/contact/chooseUser/data'
import useConversationStore from '@/store/modules/conversation'
import useUserStore from '@/store/modules/user'
import { ToastWrapperInstance } from 'vant/lib/toast/types'

const canCopyTypes = [
  MessageType.AtTextMessage,
  MessageType.TextMessage,
  MessageType.QuoteMessage,
]

type MessageMenuProps = {
  message: ExedMessageItem
  disabled?: boolean
  isSelfMsg: boolean
  isPreView?: boolean
}

const { t, locale } = useI18n()
const props = defineProps<MessageMenuProps>()
const userStore = useUserStore()
const messageStore = useMessageStore()
const conversationStore = useConversationStore()

const menuList = [
  {
    title: t('messageMenu.copy'),
    icon: copy_icon,
    hidden: false,
    type: MessageMenuType.Copy,
  },
  {
    title: t('messageMenu.delete'),
    icon: del,
    hidden: false,
    type: MessageMenuType.Delete,
  },
  {
    title: t('messageMenu.forward'),
    icon: forward,
    hidden: false,
    type: MessageMenuType.ForWard,
  },
  {
    title: t('messageMenu.revoke'),
    icon: revoke,
    hidden: false,
    type: MessageMenuType.Revoke,
  },
]

watch(locale, () => {
  menuList[0].title = t('messageMenu.copy')
  menuList[1].title = t('messageMenu.delete')
  menuList[2].title = t('messageMenu.forward')
  menuList[3].title = t('messageMenu.revoke')
})

const showMenu = ref(false)
const placement = ref<PopoverPlacement>('top')
const messageContentRef = ref()
const router = useRouter()

let loadingToast: ToastWrapperInstance | null = null

const { top } = useElementBounding(messageContentRef)

const { copy, isSupported } = useClipboard()

const canRevoke = computed(() => {
  if (
    props.message.sessionType !== SessionType.Single &&
    conversationStore.storeCurrentMemberInGroup.roleLevel !== GroupMemberRole.Normal
  ) {
    return true
  }
  const interval = (new Date().getTime() - props.message.sendTime) / 60000
  return props.message.sendID === userStore.storeSelfInfo.userID && interval < 1440
})

const computedMenus = computed(() => {
  menuList.map((menu) => {
    if (
      menu.type === MessageMenuType.Copy &&
      !canCopyTypes.includes(props.message.contentType)
    ) {
      menu.hidden = true
    }
    if (menu.type === MessageMenuType.Revoke && !canRevoke.value) {
      menu.hidden = true
    }
  })
  if (props.isPreView) {
    return canCopyTypes.includes(props.message.contentType) ? menuList.slice(0, 1) : []
  }
  return menuList.filter((menu) => !menu.hidden)
})

const onMenuLongPressCall = () => {
  if (props.disabled || computedMenus.value.length < 1) {
    return
  }
  if (props.isSelfMsg) {
    placement.value = top.value < 150 ? 'bottom-end' : 'top-end'
  } else {
    placement.value = top.value < 150 ? 'bottom-start' : 'top-start'
  }
  showMenu.value = true
}

onLongPress(messageContentRef, onMenuLongPressCall, { modifiers: { prevent: true } })

const getCopyText = () => {
  if (props.message.contentType === MessageType.AtTextMessage) {
    return props.message.atTextElem?.text
  }
  if (props.message.contentType === MessageType.QuoteMessage) {
    return props.message.quoteElem?.text
  }
  return props.message.textElem?.content
}

const showLoading = () => {
  loadingToast = showLoadingToast({
    forbidClick: true,
  })
}

const menuClick = (type: MessageMenuType) => {
  switch (type) {
    case MessageMenuType.Copy:
      if (isSupported) {
        console.log(getCopyText())
        copy(getCopyText()!)
        feedbackToast({
          message: t('messageTip.copySuccess'),
        })
      } else {
        feedbackToast({
          message: t('messageTip.copyFailed'),
          error: t('messageTip.copyFailed'),
        })
      }
      break
    case MessageMenuType.Delete:
      showLoading()
      console.log('deleteMessage')
      IMSDK.deleteMessage({
        conversationID: conversationStore.currentConversation.conversationID,
        clientMsgID: props.message.clientMsgID,
      })
        .then(() => messageStore.deleteOneMessage(props.message))
        .catch((error) => feedbackToast({ error }))
        .finally(() => loadingToast?.close())
      break
    case MessageMenuType.ForWard:
      router.push({
        path: 'chooseUser',
        state: {
          chooseType: ContactChooseEnum.ForwardMessage,
          extraData: JSON.stringify(props.message),
        },
      })
      break
    case MessageMenuType.ForWard:
      router.push({
        path: 'chooseUser',
        state: {
          chooseType: ContactChooseEnum.ForwardMessage,
          extraData: JSON.stringify(props.message),
        },
      })
      break
    case MessageMenuType.Revoke:
      showLoading()
      console.log('newRevokeMessage')
      IMSDK.revokeMessage({
        conversationID: conversationStore.currentConversation.conversationID,
        clientMsgID: props.message.clientMsgID,
      })
        .then(() => {
          messageStore.updateOneMessage({
            ...props.message,
            contentType: MessageType.RevokeMessage,
            notificationElem: {
              detail: JSON.stringify({
                clientMsgID: props.message.clientMsgID,
                revokeTime: Date.now(),
                revokerID: userStore.storeSelfInfo.userID,
                revokerNickname: t('you'),
                revokerRole: 0,
                seq: props.message.seq,
                sessionType: props.message.sessionType,
                sourceMessageSendID: props.message.sendID,
                sourceMessageSendTime: props.message.sendTime,
                sourceMessageSenderNickname: props.message.senderNickname,
              }),
            },
          })
          messageStore.updateQuoteMessageRevoke(props.message.clientMsgID)
        })
        .catch((error) => feedbackToast({ error }))
        .finally(() => loadingToast?.close())
      break
    default:
      break
  }
  showMenu.value = false
}
</script>

<style lang="scss" scoped></style>
