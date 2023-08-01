<template>
    <van-popover theme="dark" :placement="placement" trigger="manual" v-model:show="show">
        <div class="flex flex-wrap max-w-[172px] px-1 py-1">
            <div v-for="menu in computedMenus" :key="menu.type" @click.prevent="menuClick(menu.type)"
                class="flex flex-col items-center px-2 py-1">
                <img class="w-[17px] h-[18px]" :src="menu.icon" alt="" />
                <span class="text-xs mt-1">{{ menu.title }}</span>
            </div>
        </div>
        <template #reference>
            <div ref="messageContentRef" class="relative">
                <slot></slot>
            </div>
        </template>
    </van-popover>
</template>

<script setup lang='ts'>
import { ExedMessageItem, MessageMenuType } from './MessageItem/data';
import { MessageType } from 'open-im-sdk-wasm/lib/types/enum';

import copy_icon from '@/assets/images/chating_message_copy.png'
import forward from '@/assets/images/chating_message_forward.png'
import reply from '@/assets/images/chating_message_reply.png'
import revoke from '@/assets/images/chating_message_revoke.png'
import multiple from '@/assets/images/chating_message_multiple.png'
import del from '@/assets/images/chating_message_del.png'
import { PopoverPlacement, showLoadingToast } from 'vant';
import { onLongPress, useClipboard, useElementBounding } from '@vueuse/core';
import { IMSDK } from '@/utils/imCommon';
import useMessageStore from '@/store/modules/message';
import { feedbackToast } from '@/utils/common';
import { ContactChooseEnum } from '@/pages/contact/chooseUser/data';
import useConversationStore from '@/store/modules/conversation';
import useUserStore from '@/store/modules/user';
import emitter from '@/utils/events';
import { ToastWrapperInstance } from 'vant/lib/toast/types';

const canCopyTypes = [MessageType.AtTextMessage, MessageType.TextMessage, MessageType.QuoteMessage]


type MessageMenuProps = {
    message: ExedMessageItem;
    disabled?: boolean;
}

const props = defineProps<MessageMenuProps>();
const userStore = useUserStore();
const messageStore = useMessageStore();
const conversationStore = useConversationStore();

const menuList = [
    {
        title: '复制',
        icon: copy_icon,
        hidden: false,
        type: MessageMenuType.Copy,
    },
    {
        title: '删除',
        icon: del,
        hidden: false,
        type: MessageMenuType.Delete,
    },
    {
        title: '撤回',
        icon: revoke,
        hidden: false,
        type: MessageMenuType.Revoke,
    },
]

const show = ref(false)
const placement = ref<PopoverPlacement>('top')
const messageContentRef = ref();
const router = useRouter()

let loadingToast: ToastWrapperInstance | null = null

const { top } = useElementBounding(messageContentRef)

const { copy, isSupported } = useClipboard()

const computedMenus = computed(() => {
    menuList.map(menu => {
        if (menu.type === MessageMenuType.Copy && !canCopyTypes.includes(props.message.contentType)) {
            menu.hidden = true
        }
        if (menu.type === MessageMenuType.Revoke && props.message.sendID !== userStore.storeSelfInfo.userID) {
            menu.hidden = true
        }
    })
    return menuList.filter(menu => !menu.hidden)
})



const onMenuLongPressCall = () => {
    if (props.disabled) {
        return;
    }
    placement.value = top.value < 150 ? 'bottom' : 'top'
    show.value = true;
}

onLongPress(
    messageContentRef,
    onMenuLongPressCall,
    { modifiers: { prevent: true } }
)

const getCopyText = () => {
    if (props.message.contentType === MessageType.AtTextMessage) {
        return props.message.atTextElem.text;
    }
    if (props.message.contentType === MessageType.QuoteMessage) {
        return props.message.quoteElem.text;
    }
    return props.message.content;
}

const showLoading = () => {
    loadingToast = showLoadingToast({
        forbidClick: true,
    });
}

const menuClick = (type: MessageMenuType) => {
    switch (type) {
        case MessageMenuType.Copy:
            if (isSupported) {
                copy(getCopyText())
            }
            feedbackToast({ message: isSupported ? '复制成功！' : '当前环境暂不支持复制！' })
            break;
        case MessageMenuType.Delete:
            showLoading()
            IMSDK.deleteMessage({
                conversationID: conversationStore.currentConversation.conversationID,
                clientMsgID: props.message.clientMsgID
            })
                .then(() => messageStore.deleteOneMessage(props.message))
                .catch(error => feedbackToast({ error }))
                .finally(() => loadingToast?.close())
            break;
        case MessageMenuType.Revoke:
            showLoading()
            IMSDK.revokeMessage({
                conversationID: conversationStore.currentConversation.conversationID,
                clientMsgID: props.message.clientMsgID
            })
                .then(() => {
                    messageStore.updateOneMessage({
                        ...props.message,
                        contentType: MessageType.RevokeMessage,
                        notificationElem: {
                            detail: JSON.stringify({
                                clientMsgID: props.message.clientMsgID,
                                revokeTime: Date.now(),
                                revokerID:  userStore.storeSelfInfo.userID,
                                revokerNickname: "你",
                                revokerRole: 0,
                                seq: props.message.seq,
                                sessionType: props.message.sessionType,
                                sourceMessageSendID: props.message.sendID,
                                sourceMessageSendTime: props.message.sendTime,
                                sourceMessageSenderNickname: props.message.senderNickname,
                            }),
                        },
                    })
                })
                .catch(error => feedbackToast({ error }))
                .finally(() => loadingToast?.close())
            break;
        default:
            break;
    }
    show.value = false
}


</script>

<style lang='scss' scoped></style>