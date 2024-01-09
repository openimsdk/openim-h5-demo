<template>
  <div>
    <van-loading v-show="message.status === MessageStatus.Sending" size="16" type="spinner" />
    <img class="w-4 h-4 mx-1" v-if="message.status === MessageStatus.Failed" :src="failed" @click="reSend" />
  </div>
</template>

<script setup lang='ts'>
import failed from '@/assets/images/messageItem/failed.png'
import { MessageStatus } from 'open-im-sdk-wasm';
import { ExedMessageItem } from './data';
import useSendMessage from '@/hooks/useSendMessage';
import useMessageStore from '@/store/modules/message';
type MessageSendStateProps = {
  message: ExedMessageItem;
}

const props = defineProps<MessageSendStateProps>();

const messageStore = useMessageStore();
const { sendMessage } = useSendMessage();

const reSend = () => {
  messageStore.updateOneMessage({
    ...props.message,
    status: MessageStatus.Sending,
  });
  sendMessage({ message: props.message, needOpreateMessage: false });
}

</script>

<style lang='scss' scoped></style>