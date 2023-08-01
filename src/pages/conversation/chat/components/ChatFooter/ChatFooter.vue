<template>
    <div>
        <div id="chat_footer" class="flex items-center px-3 py-3 bg-[#E8F2FF]">
            <div class="flex-grow">
                <CustomEdit class="bg-[#fff]" ref="inputRef" @change="inputChange"
                    @focus="onFocusUpdate(true)" @blur="onFocusUpdate(false)" v-model:input="messageContent"
                    :placeholder="inputPlaceholder" @trigger-at="tryToAtPage" />
            </div>
            <img v-show="!messageContent" @click="clickAddBtn" class="h-[26px] min-w-[26px] ml-3" :src="chating_footer_add"
                alt="">
            <img @click="clickEmojiBtn" class="h-[26px] min-w-[26px] ml-3" :src="chating_footer_emoji" alt="">
            <van-button v-show="messageContent" class="!h-6 !px-2 !ml-3" color="#1B72EC" @click="switchTextMessage"
                :text="$t('buttons.send')" />
        </div>
        <ChatFooterAction v-show="showActionBar" @closeActionBar="closeActionBar" @getFile="getFile" />
        <ChatFooterEmoji v-show="showEmojiBar" @closeEmojiBar="closeEmojiBar" @emojiClick="emojiClick" />
    </div>
</template>

<script setup lang='ts'>
import chating_footer_add from '@/assets/images/chating_footer_add.png'
import chating_footer_emoji from '@/assets/images/chating_footer_emoji.png'
import CustomEdit from '@/components/CustomEdit/index.vue';
import ChatFooterAction from './ChatFooterAction.vue';
import ChatFooterEmoji from './ChatFooterEmoji.vue';
import { useThrottleFn } from '@vueuse/core';
import { MessageType, SessionType } from 'open-im-sdk-wasm/lib/types/enum'
import { UploaderFileListItem } from 'vant';
import useSendMessage from '@/hooks/useSendMessage';
import useConversationStore from '@/store/modules/conversation';
import { IMSDK } from '@/utils/imCommon';
import { feedbackToast } from '@/utils/common';
import emitter from "@/utils/events";
import { checkIsSafari } from '@/utils/common';
import useCreateNomalMessage from './useCreateNomalMessage'
import useCreateFileMessage from './useCreateFileMessage'

const conversationStore = useConversationStore();

// message
const messageContent = ref('')
const inputPlaceholder = ref('请输入')
const inputRef = ref();

const { createFileMessage } = useCreateFileMessage()
const { switchNomalMessage } = useCreateNomalMessage({
    messageContent,
});
const { sendMessage } = useSendMessage();

const showAtPop = ref(false)

const tryToAtPage = () => {
    if (conversationStore.storeCurrentConversation.groupID) {
        showAtPop.value = true
    }
}

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
    resetState();
}

const emojiClick = ({ context, src }: any) => {
    const image = new Image();
    image.setAttribute("class", "face_el");
    image.setAttribute("style", "padding-right:2px");
    image.setAttribute("width", "24px");
    image.setAttribute("alt", context);
    image.src = src;
    inputRef.value.insertAtCursor([image])
};

const resetState = () => {
    messageContent.value = "";
    inputRef.value.clear();
};

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
    const { error, message, buffer, snapBuffer } = await createFileMessage(uploadData.file!, messageType)
    if (error || !message) {
        feedbackToast({ error, message: error })
        return;
    }
    sendMessage({ message, fileArrayBuffer: buffer as ArrayBuffer, snpFileArrayBuffer: snapBuffer as ArrayBuffer })
}

</script>

<style lang='scss' scoped>
:deep(.van-button__content) {
    width: max-content;
}
</style>