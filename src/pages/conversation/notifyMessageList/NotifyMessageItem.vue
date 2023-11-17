<template>
    <div class="flex px-[22px] py-3">
        <Avatar is-notification :src="notifyContent.notificationFaceURL" :size="42" />
        <div class="ml-3 flex-1 overflow-hidden">
            <div>{{notifyContent.notificationName}}</div>
            <div class="mt-2 px-3 py-2 bg-white rounded">
                <div class="text-[#5496EB]">{{notifyContent.notificationName}}</div>
                <div class="text-xs text-[#999] mt-2 break-all">{{notifyContent.text}}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import Avatar from '@/components/Avatar/index.vue';
import { MessageItem } from '@/utils/open-im-sdk-wasm/types/entity';

const emit = defineEmits([]);
const props = defineProps<{ source: MessageItem }>();

const notifyContent = computed(() => {
    try {
        console.log(props.source.notificationElem.detail);
        return JSON.parse(props.source.notificationElem.detail)
    } catch (error) {
        return {}
    }
})

</script>

<style lang='scss' scoped>

</style>