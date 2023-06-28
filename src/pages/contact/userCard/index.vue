<template>
    <div class="page_container !overflow-y-auto">
        <NavBar />
        <div class="flex-1">
            <div class="px-[22px] py-6 mb-2 flex items-center bg-white">
                <Avatar :size="48" :src="contactStore.storeUserCardData.baseInfo?.faceURL" :desc="contactStore.storeUserCardData.baseInfo?.nickname" />
                <div class="ml-5">
                    <div class="flex items-center">
                        <span class="max-w-[160px] truncate mr-2 font-medium">{{ contactStore.storeUserCardData.baseInfo?.nickname }}</span>
                        <div class="flex items-center">
                            <i class="w-[6px] h-[6px] mr-1 bg-[#10CC64] rounded-full inline-block"
                                :class="{ 'bg-[#999]': onlineStateStr === $t('offline') }" />
                            <span class="text-xs text-[#999]">{{ onlineStateStr }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <CardDescItem class="mb-2" :lable="'ID'" :content="contactStore.storeUserCardData.baseInfo?.userID" />
        </div>

        <div class="flex justify-evenly w-full px-[22px] mb-6 mt-8">
            <div class="flex flex-col justify-center items-center" @click="toConversation">
                <img width="50" :src="user_card_message" alt="" />
                <span class="text-[#1D6BED] mt-1">发消息</span>
            </div>
            <div class="flex flex-col justify-center items-center">
                <img width="50" :src="user_card_call" alt="" />
                <span class="text-[#1D6BED] mt-1">OpenIM电话</span>
            </div>
            <div v-if="!friendInfo" class="flex flex-col justify-center items-center" @click="toAddFriend">
                <img width="50" :src="user_card_add" alt="" />
                <span class="text-[#1D6BED] mt-1">添加好友</span>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import Avatar from '@/components/Avatar/index.vue';
import CardDescItem from '@/components/CardDescItem/index.vue';
import user_card_message from '@assets/images/user_card_message.png'
import user_card_call from '@assets/images/user_card_call.png'
import user_card_add from '@assets/images/user_card_add.png'
import { getDesignatedUserOnlineState, toSpecifiedConversation } from '@/utils/imCommon';
import useContactStore from '@/store/modules/contact';
import { SessionType } from 'open-im-sdk-wasm/lib/types/enum';

const { t } = useI18n();
const contactStore = useContactStore()
const router = useRouter()

const onlineStateStr = ref(t("offline"))
const friendInfo = computed(() => contactStore.storeFriendList.find(friend => friend.userID === contactStore.storeUserCardData.baseInfo?.userID))

const getOnlineState = async () => {
    onlineStateStr.value = await getDesignatedUserOnlineState(contactStore.storeUserCardData.baseInfo!.userID)
}

// events
const toConversation = () => {
    toSpecifiedConversation(contactStore.storeUserCardData.baseInfo?.userID!, SessionType.Single)
}

const toAddFriend = () => {
    router.push({
        path: 'sendApplication',
        query: {
            sourceID: contactStore.storeUserCardData.baseInfo?.userID,
            sessionType: SessionType.Single
        }
    })
}

onBeforeMount(() => {
    getOnlineState();
})

</script>

<style lang='scss' scoped></style>