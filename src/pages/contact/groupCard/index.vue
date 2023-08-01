<template>
    <div class="page_container">
        <NavBar />

        <div class="flex items-center px-[22px] py-6 bg-white">
            <Avatar :size="48" :src="conversationStore.storeCurrentGroupInfo.faceURL" is-group />
            <div class="ml-6">
                <div class="font-medium text-lg">
                    <span>{{ conversationStore.storeCurrentGroupInfo.groupName }}</span>
                    <span>{{ `(${conversationStore.storeCurrentGroupInfo.memberCount})` }}</span>
                </div>
                <div>
                    <van-icon name="clock" size="13" color="#ADADAD" />
                    <span class="text-[13px] text-[#ADADAD] ml-1">{{ groupCreateTime }}</span>
                </div>
            </div>
        </div>

        <div class="my-2 px-[22px] py-4 bg-white" @click="toMemberList">
            <div class="flex items-center justify-between">
                <div>
                    <span>群成员</span>
                    <span
                        class="text-xs text-[#ADADAD] ml-3">{{ `${conversationStore.storeCurrentGroupInfo.memberCount}人` }}</span>
                </div>
                <van-icon name="arrow" color="#999" />
            </div>
            <div class="mt-3 flex">
                <Avatar class="mr-2 last:mr-0" v-for="member in comptMemberRow" :key="member.userID" :src="member.faceURL"
                    :desc="member.nickname" :size="42" />
                <div class="bg-[#5496EB] w-[42px] h-[42px] flex justify-center items-center rounded-md">
                    <van-icon name="ellipsis" size="28" color="#fff" />
                </div>
            </div>
        </div>

        <div class="px-[22px] py-4 bg-white">
            <span>群ID</span>
            <span class="ml-3 text-[#ADADAD]">{{ conversationStore.storeCurrentGroupInfo.groupID }}</span>
        </div>


        <div class="flex-1 flex justify-center items-center">
            <van-button class="w-full !text-[#1D6BED] !border-0" plain type="default"
                :text="comptInGroup ? '发消息' : '申请加入该群'" @click="toConversationOrApply" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import Avatar from '@/components/Avatar/index.vue';
import useConversationStore from '@/store/modules/conversation';
import useContactStore from '@/store/modules/contact';
import useGroupMemberList from '@/hooks/useGroupMemberList';
import user_icon from '@assets/images/contact_my_friend.png'
import dayjs from 'dayjs';
import { toSpecifiedConversation } from '@/utils/imCommon';
import { GroupType, SessionType } from 'open-im-sdk-wasm/lib/types/enum';

const router = useRouter();
const contactStore = useContactStore();
const conversationStore = useConversationStore();

const { fetchState } = useGroupMemberList()

const groupCreateTime = dayjs(conversationStore.storeCurrentGroupInfo.createTime * 1000).format('YYYY-MM-DD')
const comptInGroup = computed(() => contactStore.storeGroupList.findIndex(group => group.groupID === conversationStore.storeCurrentGroupInfo.groupID) > -1)
const comptMemberRow = computed(() => {
    if (comptInGroup.value) {
        return fetchState.groupMemberList.slice(0, 6)
    }
    const memberCount = conversationStore.storeCurrentGroupInfo.memberCount ?? 0
    return new Array(memberCount >= 6 ? 6 : memberCount).fill(1).map((_, idx) => ({
        userID: idx,
        nickname: '',
        faceURL: user_icon,
    }))
})

const toConversationOrApply = () => {
    const sessionType = SessionType.WorkingGroup
    if (comptInGroup.value) {
        toSpecifiedConversation(conversationStore.storeCurrentGroupInfo.groupID, sessionType)
    } else {
        router.push({
            path: 'sendApplication',
            query: {
                isGroup: 'true',
                sourceID: conversationStore.storeCurrentGroupInfo.groupID,
                isScan: 'false',
                notNeedVerification: 'false',
                sessionType
            }
        })
    }
}

const toMemberList = () => {
    if (comptInGroup.value) {
        router.push({
            path: 'groupMemberList',
            state: {
                groupID: conversationStore.storeCurrentGroupInfo.groupID
            }
        })
    }
}

onMounted(() => {
    conversationStore.getCurrentMemberInGroupFromReq(conversationStore.storeCurrentGroupInfo.groupID);
})

</script>

<style lang='scss' scoped></style>