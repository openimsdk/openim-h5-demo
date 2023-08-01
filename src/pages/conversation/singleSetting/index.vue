<template>
    <div class="page_container !overflow-y-auto">
        <NavBar title="聊天设置" />

        <div class="flex items-start bg-white px-[22px] py-[22px] mt-[6px]">
            <div class="flex flex-col mr-6">
                <Avatar :size="48" :src="conversationStore.storeCurrentConversation.faceURL"
                    :desc="conversationStore.storeCurrentConversation.showName" @click="toUser" />
                <span class="w-12 text-center truncate mt-2">{{ conversationStore.storeCurrentConversation.showName }}</span>
            </div>
            <img width="48" :src="single_setting_add" alt="" @click="createGroup" />
        </div>
    </div>
</template>

<script name="singleSetting" setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import Avatar from '@/components/Avatar/index.vue';
import single_setting_add from '@assets/images/single_setting_add.png'
import useContactStore from '@/store/modules/contact';
import useConversationStore from '@/store/modules/conversation';

const router = useRouter()
const contactStore = useContactStore();
const conversationStore = useConversationStore();

const toUser = () => {
    contactStore.getUserCardData(conversationStore.storeCurrentConversation.userID)
}

const createGroup = () => {
    router.push({
        path: 'createGroup',
        state: {
            prevCheckedUserList: JSON.stringify([{
                ...conversationStore.storeCurrentConversation,
                nickname: conversationStore.storeCurrentConversation.showName
            }]),
        }
    })
}


</script>

<style lang='scss' scoped></style>