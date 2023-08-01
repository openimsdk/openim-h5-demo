<template>
    <van-swipe-cell>
        <div @click="clickConversation" class="flex items-center py-[10px] px-[22px] active:bg-[#F3F3F3]"
            :class="{ 'bg-[#F3F3F3]': source.isPinned }">
            <Avatar :size="48" :src="source.faceURL" :desc="source.showName" :is-group="isGroup"
                :is-notification="isNotification" />
            <div class="flex-1 mx-3 flex justify-evenly flex-col h-12">
                <div class="text-[15px] truncate max-w-[40vw]">{{ source.showName }}</div>
                <div class="text-[#666] text-[13px] truncate max-w-[50vw]">
                    <span v-show="messagePrefix" class="mr-1" :class="{ 'text-[#1B72EC]': activePrefix }">{{ messagePrefix
                    }}</span>
                    <span>{{ formattedMessage }}</span>
                </div>
            </div>
            <div class="flex flex-col h-12 text-xs text-[#999] items-end"
                :class="{ 'justify-evenly': !isOptNomal || source.unreadCount > 0 }">
                <span class="w-max">{{ latestMessageTime }}</span>
                <img v-if="!isOptNomal" class="w-5 h-5" :src="conversation_not_accept" alt="">
                <van-badge v-show="source.unreadCount > 0 && isOptNomal" class="w-fit" color="#F44038"
                    :content="source.unreadCount" max="99" />
            </div>
        </div>
        <template #right>
            <van-button color="#1B72EC" :text="$t(!source.isPinned ? 'buttons.pin' : 'buttons.cancelPin')"
                @click="updatePin" />
            <van-button color="#FFAB41" :text="$t('buttons.remove')" @click="removeConversation" />
            <van-button v-if="source.unreadCount > 0" color="#a8a8a8" :text="$t('buttons.markAsRead')"
                @click="markHasRead" />
        </template>
    </van-swipe-cell>
</template>

<script setup lang='ts'>
import { ConversationItem, MessageItem } from 'open-im-sdk-wasm/lib/types/entity';
import Avatar from '@/components/Avatar/index.vue';
import conversation_not_accept from '@assets/images/conversation_not_accept.png'
import { formatConversionTime, IMSDK, formatMessageByType } from '@/utils/imCommon';
import { GroupAtType, MessageReceiveOptType, SessionType } from 'open-im-sdk-wasm/lib/types/enum';
import { feedbackToast } from '@/utils/common';
import useConversationStore from '@/store/modules/conversation';


type ConversationItemProps = {
    source: ConversationItem
}

const router = useRouter();
const { t } = useI18n();

const conversationStore = useConversationStore();

const emit = defineEmits([]);
const props = defineProps<ConversationItemProps>();

const isGroup = props.source.conversationType === SessionType.WorkingGroup
const isNotification = props.source.conversationType === SessionType.Notification

const isOptNomal = props.source.recvMsgOpt === MessageReceiveOptType.Nomal

const formattedMessage = computed(() => {
    let parsedMessage: MessageItem | undefined = undefined
    try {
        parsedMessage = JSON.parse(props.source.latestMsg);
    } catch (e) { }
    if (!parsedMessage) return ''
    return formatMessageByType(parsedMessage)
})

const latestMessageTime = computed(() => formatConversionTime(props.source.latestMsgSendTime))

const messagePrefix = computed(() => {
    if (props.source.draftText) {
        let text = props.source.draftText;
        return t('messageDesc.drftMessage')
    }
    let prefix = ''

    if (props.source?.recvMsgOpt !== MessageReceiveOptType.Nomal && props.source.unreadCount > 0) {
        prefix = t('pieces', { number: props.source.unreadCount });
    }

    if (props.source.groupAtType !== GroupAtType.AtNormal) {
        switch (props.source.groupAtType) {
            case GroupAtType.AtAll:
                prefix = t('messageDesc.atAll')
                break;
            case GroupAtType.AtMe:
                prefix = t('messageDesc.atYou')
                break;
            case GroupAtType.AtAllAtMe:
                prefix = t('messageDesc.atYou')
                break;
            case GroupAtType.AtGroupNotice:
                prefix = t('messageDesc.groupAnnouncement')
                break;
        }
    }

    return prefix
})

const activePrefix = computed(() => props.source.groupAtType !== GroupAtType.AtNormal)

const clickConversation = () => {
    conversationStore.updateCurrentConversation(props.source);
    let path = 'chat'
    if (props.source.conversationType === SessionType.Notification) {
        path = 'notifyMessageList'
    }
    router.push(path)
}

const updatePin = () => {
    IMSDK.pinConversation({
        conversationID: props.source.conversationID,
        isPinned: !props.source.isPinned
    }).catch((error) => feedbackToast({ error }))
}
const removeConversation = () => {
    IMSDK.deleteConversationAndDeleteAllMsg(props.source.conversationID).then(() => conversationStore.delConversationByCID(props.source.conversationID)).catch((error) => feedbackToast({ error }))
}
const markHasRead = () => {
    IMSDK.markConversationMessageAsRead(props.source.conversationID).catch((error) => feedbackToast({ error }))
}

</script>

<style lang='scss' scoped>
:deep(.van-button) {
    height: 100%;
    max-width: 70px;
    border-radius: 0;
}

:deep(.van-badge--top-right) {
    transform: translate(0, 0);
}
</style>