<template>
    <div class="text-[13px] text-[#006AFF] mt-1" :class="{ '!text-[#999]': !message.isRead }">
        {{ readStateStr }}
    </div>
</template>

<script setup lang='ts'>
import { SessionType } from 'open-im-sdk-wasm/lib/types/enum';
import { ExedMessageItem } from './data';


type MessageReadStateProps = {
    message: ExedMessageItem;
}

const props = defineProps<MessageReadStateProps>();
const readStateStr = computed(() => {
    if(props.message.sessionType === SessionType.Single){
        return props.message.isRead ? '已读' : '未读';
    }
    return ''
})
</script>

<style lang='scss' scoped></style>