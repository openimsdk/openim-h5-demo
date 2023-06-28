<template>
    <div class="card_message_container">
        <div class="card_info">
            <Avatar :src="cardData.faceURL" :desc="cardData.nickname" :size="42" />
            <span class="ml-3 truncate">{{cardData.nickname}}</span>
        </div>
        <div class="text-[#999] pl-5">
            <span>名片</span>
        </div>
    </div>
</template>

<script setup lang='ts'>
import Avatar from '@/components/Avatar/index.vue';
import { PublicUserItem } from 'open-im-sdk-wasm/lib/types/entity';
import { ExedMessageItem } from './data';

type CardMessageRendererProps = {
    message: ExedMessageItem;
    disabled: boolean;
}

const props = defineProps<CardMessageRendererProps>();

const cardData = computed(() => {
    let info = {} as PublicUserItem
    try {
        info = JSON.parse(props.message.content)
    } catch (error) { }
    return info
})

</script>

<style lang='scss' scoped>
.card_message_container {
    display: flex;
    flex-direction: column;
    background-color: #fbfbfb;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    width: 222px;
    border: 1px solid #ECECEC;

    .card_info {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #E9E9E9;
    }
}
</style>