<template>
    <van-nav-bar placeholder fixed left-arrow :clickable="false" :border="false" @click-left="back">
        <template #left>
            <van-icon color="#333" name="arrow-left" size="23" />
        </template>
        <template #title>
            <div class="flex flex-col justify-evenly h-full">
                <div class="flex">
                    <span class="truncate flex-1">{{conversationStore.storeCurrentConversation.showName}}</span>
                    <span>{{titleSuffix}}</span>
                </div>
                <div v-show="isSingle" class="flex items-center justify-center">
                    <i class="w-[6px] h-[6px] mr-1 bg-[#10CC64] rounded-full inline-block"
                        :class="{'bg-[#999]':onlineStateStr === $t('offline')}" />
                    <span class="text-xs text-[#999] font-normal">{{onlineStateStr}}</span>
                </div>
            </div>
        </template>
        <template #right>
            <van-icon color="#000" size="23" name="ellipsis" @click="toSetting" />
        </template>
    </van-nav-bar>
</template>

<script setup lang='ts'>
import useConversationStore from '@/store/modules/conversation';
import { getDesignatedUserOnlineState } from '@/utils/imCommon';
import { SessionType } from 'open-im-sdk-wasm/lib/types/enum';

const emit = defineEmits([]);
const props = defineProps();

const { t } = useI18n();
const router = useRouter();
const conversationStore = useConversationStore();

const onlineStateStr = ref(t("offline"))

const isSingle = computed(() => conversationStore.storeCurrentConversation.conversationType === SessionType.Single)
const isNotification = computed(() => conversationStore.storeCurrentConversation.conversationType === SessionType.Notification)
const titleSuffix = computed(() => {
    let suffix = ''
    if (!isNotification.value && !isSingle.value) {
        suffix = `（${conversationStore.storeCurrentGroupInfo.memberCount || 0}）`
    }
    return suffix
})

const back = () => {
    router.push('conversation')
}

const toSetting = () => {
    router.push(isSingle.value ? 'singleSetting' : 'groupSetting')
}

watch(
    () => conversationStore.storeCurrentConversation.conversationID,
    async (newVal) => {
        if (newVal && isSingle.value) {
            onlineStateStr.value = await getDesignatedUserOnlineState(conversationStore.storeCurrentConversation.userID)
        }
    }
);

</script>

<style lang='scss' scoped>
:deep(.van-nav-bar__title) {
    height: 100%;
}
</style>