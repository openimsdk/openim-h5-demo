<template>
  <div class="page_container !bg-white">
    <NavBar :router="isBackRoute" :title="$t('contactMenu.contacts')" @leftClick="confirm" />
    <van-search v-model="keyword" :placeholder="t('placeholder.search')" @search="onSearch" />
    <div class="flex justify-evenly py-3">
      <template v-for="item in tabs">
        <div @click="tabChange(item.idx)" :key="item.idx" v-if="item.visible" class="flex flex-col items-center">
          <img width="50" :src="activeTab === item.idx ? item.activeIcon : item.icon" alt="">
          <span class="mt-2">{{ item.title }}</span>
        </div>
      </template>
    </div>

    <div class="flex-1 overflow-hidden mb-1">
      <div class="h-full overflow-y-auto relative" v-show="activeTab === 0">
        <van-index-bar :index-list="renderList.indexList">
          <template v-for="(item, idx) in renderList.indexList">
            <van-index-anchor :index="item" />
            <GenericListItem class="bg-white" v-for="(friend, index) in renderList.dataList[idx]" :key="friend.userID"
              :source="friend" :total="renderList.dataList[idx].length" :index="index" :showCheck="showCheck"
              :checked="checkedUserList.findIndex(user => user.userID === friend.userID) > -1"
              @click="clickFriend(friend)" />
          </template>
        </van-index-bar>
      </div>

      <virtual-list v-show="activeTab === 1" class="my_scrollbar h-full overflow-y-auto bg-white" :data-key="'groupID'"
        :data-sources="contactStore.storeGroupList" :data-component="GenericListItem" :estimate-size="88" :extra-props="(item: GroupItem) => ({
          subKey: 'memberCount',
          total: contactStore.storeGroupList.length,
          showCheck: showCheck,
          checked: checkedGroupList.findIndex(group => group.groupID === item.groupID) > -1,
          onClick: () => updateGroupChoose(item)
        })" />
    </div>

    <CheckedFooter v-if="showCheck" :all-checked-list="allCheckedList" @remove="remove" :total="999" @confirm="confirm" />

  </div>
</template>
  
<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import GenericListItem from '@/components/GenericListItem/index.vue';
import CheckedFooter from '@/components/CheckedFooter/index.vue';
import VirtualList from '@components/VirtualList';

import contact_choose_friend from '@assets/images/contact_choose_friend.png'
import contact_choose_friend_active from '@assets/images/contact_choose_friend_active.png'
import contact_choose_group from '@assets/images/contact_choose_group.png'
import contact_choose_group_active from '@assets/images/contact_choose_group_active.png'
import contact_choose_company from '@assets/images/contact_choose_company.png'
import contact_choose_company_active from '@assets/images/contact_choose_company_active.png'
import { ConversationItem, FullUserItem, GroupItem, MessageItem, PublicUserItem } from '@/utils/open-im-sdk-wasm/types/entity';
import { GenericListItemSource } from '@/components/GenericListItem/data';
import { ContactChooseEnum } from './data';
import useContactStore from '@/store/modules/contact';
import { feedbackToast, formatContacts } from '@/utils/common';
import { showConfirmDialog } from 'vant';
import { IMSDK } from '@/utils/imCommon';
import emitter from '@/utils/events';
import useSendMessage from '@/hooks/useSendMessage';

type CheckedItem = FullUserItem & GroupItem & ConversationItem

const { t } = useI18n()

const canChooseGroupTypes = [ContactChooseEnum.ForwardMessage, ContactChooseEnum.MergeMessage, ContactChooseEnum.ShareCard]
const tabs = [{
  idx: 0,
  title: t('contactMenu.chooseFriend'),
  icon: contact_choose_friend,
  activeIcon: contact_choose_friend_active,
  visible: true,
},
{
  idx: 1,
  title: t('contactMenu.chooseGroup'),
  icon: contact_choose_group,
  activeIcon: contact_choose_group_active,
  visible: canChooseGroupTypes.includes(history.state.chooseType),
},
{
  idx: 2,
  title: t('contactMenu.chooseCompany'),
  icon: contact_choose_company,
  activeIcon: contact_choose_company_active,
  visible: false,
},
]

const router = useRouter()
const contactStore = useContactStore()

const { sendMessage } = useSendMessage()

const renderList = computed(() => formatContacts(contactStore.storeFriendList))

const activeTab = ref(0)
const keyword = ref('')
const checkedUserList = ref<PublicUserItem[]>([])
const checkedGroupList = ref<GroupItem[]>([])

const allCheckedList = computed(() => [...checkedUserList.value, ...checkedGroupList.value] as CheckedItem[])
const isBackRoute = history.state.chooseType !== ContactChooseEnum.LaunchGroup
const showCheck = history.state.chooseType !== ContactChooseEnum.ChooseCard

onBeforeMount(() => {
  const state = history.state
  checkedUserList.value = state.prevCheckedUserList ? JSON.parse(state.prevCheckedUserList) : []
  checkedGroupList.value = state.prevCheckedGroupList ? JSON.parse(state.prevCheckedGroupList) : []
})


const onSearch = () => {

}

const tabChange = (idx: number) => {
  activeTab.value = idx
}

const clickFriend = (item: PublicUserItem) => {
  if (showCheck) {
    updateUserChoose(item)
  } else {
    showConfirmDialog({
      message: t('messageTip.sendCard', { name: item.nickname }),
      beforeClose: (action) =>
        new Promise(async resolve => {
          if (action === 'confirm') {
            const message = (await IMSDK.createCardMessage(item)).data as MessageItem
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
  console.log(item);

  const idx = checkedGroupList.value.findIndex(user => user.groupID === item.groupID)
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
  switch (history.state.chooseType) {
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
    case ContactChooseEnum.MergeMessage:
    case ContactChooseEnum.ShareCard:
      allCheckedList.value.map(async item => {
        let message: MessageItem
        if (history.state.chooseType === ContactChooseEnum.ForwardMessage) {
          message = (await IMSDK.createForwardMessage(history.state.extraData)).data as MessageItem
        } else if (history.state.chooseType === ContactChooseEnum.MergeMessage) {
          message = (await IMSDK.createMergerMessage(JSON.parse(history.state.extraData))).data as MessageItem
        } else {
          message = (await IMSDK.createCardMessage(history.state.extraData)).data as MessageItem
        }
        await sendMessage({ message, recvID: item.userID, groupID: item.groupID })
      })
      emitter.emit('UPDATE_MULTIPLE_CHECK_STATE', false)
      feedbackToast({
        message: t("messageTip.sendSuccess"),
        onClose: router.back
      })
      break;
    case ContactChooseEnum.InviteGroup:
      IMSDK.inviteUserToGroup({
        groupID: history.state.extraData,
        userIDList: allCheckedList.value.map(user => user.userID),
        reason: ''
      })
        .then(() => feedbackToast({ message: t("messageTip.inviteSuccess") }))
        .catch(() => feedbackToast({ message: t("messageTip.inviteFailed") }))
        .finally(() => router.back())
      break;
    default:
      break;
  }
}
</script>
  
<style lang='scss' scoped>
:deep(.van-index-anchor--sticky) {
  transform: translate3d(0px, 210px, 0px) !important;
}
</style>