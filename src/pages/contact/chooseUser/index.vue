<template>
    <div class="page_container !bg-white">
        <NavBar :router="isBackRoute" :title="'联系人'" @leftClick="confirm" />
        <van-search v-model="keyword" placeholder="搜索" />

        <div class="flex-1 overflow-hidden mb-1">
            <van-tabs v-model:active="activeTab">
                <van-tab class="overflow-y-auto" title="按好友选">
                    <van-index-bar v-if="renderFriendList.indexList.length > 0" :index-list="renderFriendList.indexList">
                        <template v-for="(item, idx) in renderFriendList.indexList">
                            <van-index-anchor :index="item" />
                            <GenericListItem class="bg-white" v-for="(friend, index) in renderFriendList.dataList[idx]"
                                :key="friend.userID" :source="friend" :total="renderFriendList.dataList[idx].length"
                                :index="index" :showCheck="showCheck" :disabled="disabledUserIDList.includes(friend.userID)"
                                :checked="checkedUserList.findIndex(user => user.userID === friend.userID) > -1"
                                @click="clickFriend(friend)" />
                        </template>
                    </van-index-bar>
                    <CommonEmpty v-else />
                </van-tab>
                <van-tab title="按群聊选" v-if="canChooseGroupTypes.includes(chooseType)">
                    <virtual-list v-if="renderGroupList.length > 0"
                        class="my_scrollbar h-full overflow-y-auto overflow-x-hidden bg-white" :data-key="'groupID'"
                        :data-sources="renderGroupList" :data-component="GenericListItem" :estimate-size="88"
                        :extra-props="(item: GroupItem) => ({
                            subKey: 'memberCount',
                            total: renderGroupList.length,
                            showCheck: showCheck,
                            checked: checkedGroupList.findIndex(group => group.groupID === item.groupID) > -1,
                            onClick: () => updateGroupChoose(item)
                        })" />
                    <CommonEmpty v-else />
                </van-tab>
            </van-tabs>
        </div>

        <CheckedFooter v-if="showCheck" :all-checked-list="allCheckedList" @remove="remove" @confirm="confirm" />

    </div>
</template>
  
<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import GenericListItem from '@/components/GenericListItem/index.vue';
import CheckedFooter from '@/components/CheckedFooter/index.vue';
import VirtualList from '@components/VirtualList';

import { ConversationItem, FullUserItem, GroupItem, GroupMemberItem, PublicUserItem } from 'open-im-sdk-wasm/lib/types/entity';
import { GenericListItemSource } from '@/components/GenericListItem/data';
import { ContactChooseEnum } from './data';
import useContactStore from '@/store/modules/contact';
import { feedbackToast, formatContacts } from '@/utils/common';
import { showConfirmDialog, showToast } from 'vant';
import { IMSDK } from '@/utils/imCommon';
import emitter from '@/utils/events';
import useSendMessage from '@/hooks/useSendMessage';
import CommonEmpty from '@/components/CommonEmpty/index.vue';
import useConversationStore from '@/store/modules/conversation';
import { SessionType } from 'open-im-sdk-wasm/lib/types/enum';


type CheckedItem = FullUserItem & GroupItem & ConversationItem

const canChooseGroupTypes = [ContactChooseEnum.ForwardMessage, ContactChooseEnum.MergeMessage, ContactChooseEnum.ShareCard]

const router = useRouter()
const contactStore = useContactStore()
const conversationStore = useConversationStore();

const { sendMessage } = useSendMessage()

const activeTab = ref(0)
const keyword = ref('')
const checkedUserList = ref<PublicUserItem[]>([])
const checkedGroupList = ref<GroupItem[]>([])
const disabledUserIDList = ref<string[]>([])

const allCheckedList = computed(() => [...checkedUserList.value, ...checkedGroupList.value] as CheckedItem[])
const renderFriendList = computed(() => formatContacts(keyword.value ? contactStore.storeFriendList.filter(friend => friend.nickname.includes(keyword.value)) : contactStore.storeFriendList))
const renderGroupList = computed(() => keyword.value ? contactStore.storeGroupList.filter(group => group.groupName.includes(keyword.value)) : contactStore.storeGroupList)

const chooseType = history.state.chooseType
const isBackRoute = chooseType !== ContactChooseEnum.LaunchGroup
const showCheck = chooseType !== ContactChooseEnum.ChooseCard

onBeforeMount(() => {
    const state = history.state
    checkedUserList.value = state.prevCheckedUserList ? JSON.parse(state.prevCheckedUserList) : []
    checkedGroupList.value = state.prevCheckedGroupList ? JSON.parse(state.prevCheckedGroupList) : []
    if (!canChooseGroupTypes.includes(history.state.chooseType)) {
        nextTick(() => {
            const el = document.querySelector('.van-tabs__wrap')
            el?.setAttribute('style', 'display:none')
        })
    }
})

const clickFriend = (item: PublicUserItem) => {
    if (disabledUserIDList.value.includes(item.userID)) {
        return
    }
    if (showCheck) {
        updateUserChoose(item)
    } else {
        showConfirmDialog({
            title: '提示',
            message: `确定要发送${item.nickname}的名片吗？`,
            beforeClose: (action) =>
                new Promise(async resolve => {
                    if (action === 'confirm') {
                        const message = (await IMSDK.createCardMessage(JSON.stringify(item))).data
                        await sendMessage({ message })
                        resolve(true);
                        setTimeout(() => emitter.emit("CHAT_MAIN_SCROLL_TO_BOTTOM", false));
                        router.back()
                    } else {
                        resolve(true)
                    }
                })
        })
    }
}

const updateUserChoose = (item: PublicUserItem) => {
    const idx = checkedUserList.value.findIndex(user => user.userID === item.userID)
    if (idx > -1) {
        const tmpArr = [...checkedUserList.value]
        tmpArr.splice(idx, 1)
        checkedUserList.value = [...tmpArr]
    } else {
        checkedUserList.value = [...checkedUserList.value, item]
    }
}

const updateGroupChoose = (item: GroupItem) => {
    const idx = checkedGroupList.value.findIndex(group => group.groupID === item.groupID)
    if (idx > -1) {
        const tmpArr = [...checkedGroupList.value]
        tmpArr.splice(idx, 1)
        checkedGroupList.value = [...tmpArr]
    } else {
        checkedGroupList.value = [...checkedGroupList.value, item]
    }
}

const remove = (item: Partial<GenericListItemSource>) => {
    if (item.groupID) {
        const idx = checkedGroupList.value.findIndex(user => user.groupID === item.groupID)
        const tmpArr = [...checkedGroupList.value]
        tmpArr.splice(idx, 1)
        checkedGroupList.value = [...tmpArr]
    } else {
        const idx = checkedUserList.value.findIndex(user => user.userID === item.userID)
        const tmpArr = [...checkedUserList.value]
        tmpArr.splice(idx, 1)
        checkedUserList.value = [...tmpArr]
    }
}

const confirm = async () => {
    console.log('confirm');
    switch (chooseType) {
        case ContactChooseEnum.LaunchGroup:
            router.replace({
                path: 'createGroup',
                state: {
                    prevCheckedUserList: JSON.stringify(checkedUserList.value),
                    extraData: history.state.extraData as string
                }
            })
            router.go(-1)
            break;
        case ContactChooseEnum.ForwardMessage:
        case ContactChooseEnum.ShareCard:
            allCheckedList.value.map(async item => {
                let message
                if (chooseType === ContactChooseEnum.ForwardMessage) {
                    message = (await IMSDK.createForwardMessage(history.state.extraData)).data
                } else {
                    message = (await IMSDK.createCardMessage(history.state.extraData)).data
                }
                await sendMessage({ message, recvID: item.userID, groupID: item.groupID })
            })
            feedbackToast({
                message: '发送成功！',
                onClose: router.back
            })
            break;
        case ContactChooseEnum.InviteGroup:
            IMSDK.inviteUserToGroup({
                groupID: history.state.extraData,
                userIDList: allCheckedList.value.map(user => user.userID),
                reason: ''
            }).then(() => feedbackToast({ message: '邀请成功！' })).catch(() => feedbackToast({ message: '邀请失败！' })).finally(() => router.back())
            break;
        default:
            break;
    }
}


</script>
  
<style lang='scss' scoped>
:deep(.van-index-anchor--sticky) {
    transform: translate3d(0px, 103px, 0px) !important;
}

.van-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.van-tabs__content) {
        flex: 1;
        overflow: hidden;

        .van-tab__panel {
            height: 100%;
        }
    }
}
</style>