<template>
    <div class="text-[13px] text-[#006AFF] mt-1" :class="{ '!text-[#999]': !message.isRead }">
        {{ readStateStr }}
    </div>
</template>

<script setup lang='ts'>
import { ExedMessageItem } from './data';


type MessageReadStateProps = {
    message: ExedMessageItem;
}

const props = defineProps<MessageReadStateProps>();
const readStateStr = computed(() => props.message.isRead ? '已读' : '未读')
</script>

<style lang='scss' scoped></style>