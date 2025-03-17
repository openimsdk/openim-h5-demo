<template>
  <div class="page_container">
    <NavBar :router="isBackRoute" :title="$t('contactMenu.contacts')" @leftClick="confirm" />

    <div class="mb-[10px]"></div>
    <DetailInfoItem arrow :lable="tabs[0].title" :content="''" @click="showPopType(tabs[0].idx)" />
    <DetailInfoItem v-if="showGroupAndUser" arrow :lable="tabs[1].title" :content="''"
      @click="showPopType(tabs[1].idx)" />

    <div v-if="showGroupAndUser" class="flex h-[28px] items-center justify-start pl-5 text-xs text-sub-text">
      {{ $t('contactMenu.recentSession') }}
    </div>
    <div class="flex-1 overflow-hidden">
      <virtual-list v-if="showGroupAndUser && renderConversationList.length > 0"
        class="my_scrollbar h-full overflow-scroll bg-white" :data-key="'groupID'"
        :data-sources="renderConversationList" :data-component="GenericListItem" :estimate-size="88" :extra-props="(item: ConversationItem) => ({
            total: renderConversationList.length,
            showCheck: true,
            checked: !![...checkedGroupList, ...checkedUserList].find(
              (checkedItem: any) =>
                (checkedItem.groupID && checkedItem.groupID === item.groupID) ||
                (checkedItem.userID && checkedItem.userID === item.userID),
            ),
            onClick: () => updateConversationChoose(item),
          })
          " />
    </div>

    <CheckedFooter :all-checked-list="allCheckedList" :total="999" @remove="remove"
      @confirm="confirm" />

    <van-popup v-model:show="showPop" position="bottom" :duration="0" @click-overlay="showPop = false"
      class="!bg-[#F8F9FA]">
      <div class="flex h-screen flex-col">
        <div class="flex justify-between bg-white px-[22px] pt-3">
          <div @click="showPop = false"><van-icon name="arrow-down" /></div>
          <div>{{ tabs[activeTab].title }}</div>
          <div></div>
        </div>
        <div class="flex-1 overflow-x-hidden overflow-y-scroll bg-white">
          <van-index-bar v-if="activeTab === 0 && renderFriendList.indexList.length > 0"
            :index-list="renderFriendList.indexList">
            <template v-for="(item, idx) in renderFriendList.indexList">
              <van-index-anchor :index="item" />
              <GenericListItem class="bg-white" v-for="(friend, index) in renderFriendList.dataList[idx]"
                :key="friend.userID" :source="friend" :total="renderFriendList.dataList[idx].length" :index="index"
                :showCheck="true" :disabled="disabledUserIDList.includes(friend.userID)" :checked="checkedUserList.findIndex((user) => user.userID === friend.userID) >
                  -1
                  " @click="clickFriend(friend)" />
            </template>
          </van-index-bar>
          <virtual-list v-if="activeTab === 1 && renderGroupList.length > 0"
            class="my_scrollbar h-full overflow-y-auto overflow-x-hidden bg-white" :data-key="'groupID'"
            :data-sources="renderGroupList" :data-component="GenericListItem" :estimate-size="88" :extra-props="(item: GroupItem) => ({
                subKey: 'memberCount',
                total: renderGroupList.length,
                showCheck: true,
                checked:
                  checkedGroupList.findIndex(
                    (group) => group.groupID === item.groupID,
                  ) > -1,
                onClick: () => updateGroupChoose(item),
              })
              " />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar/index.vue'
import DetailInfoItem from '@/components/DetailInfoItem/index.vue'
import GenericListItem from '@/components/GenericListItem/index.vue'
import CheckedFooter from '@/components/CheckedFooter/index.vue'
import VirtualList from '@components/VirtualList'

import type {
  ConversationItem,
  FriendUserItem,
  GroupItem,
  MessageItem,
  PublicUserItem,
} from '@openim/wasm-client-sdk/lib/types/entity'
import { GenericListItemSource } from '@/components/GenericListItem/data'
import { ContactChooseEnum } from './data'
import useContactStore from '@/store/modules/contact'
import { feedbackToast, formatContacts } from '@/utils/common'
import { IMSDK } from '@/utils/imCommon'
import useConversationStore from '@/store/modules/conversation'
import { SessionType } from '@openim/wasm-client-sdk'

const { t } = useI18n()

const tabs = [
  {
    idx: 0,
    title: t('contactMenu.myGoodFriend'),
  },
  {
    idx: 1,
    title: t('contactMenu.myGroup'),
  },
]

const canChooseGroupTypes = [
  ContactChooseEnum.ShareCard,
]

type CheckedItem = FriendUserItem & GroupItem & ConversationItem

const router = useRouter()
const contactStore = useContactStore()
const conversationStore = useConversationStore()

const activeTab = ref(0)
const showPop = ref(false)
const keyword = ref('')
const checkedUserList = ref<PublicUserItem[]>([])
const checkedGroupList = ref<GroupItem[]>([])
const disabledUserIDList = ref<string[]>([])

const chooseType = history.state.chooseType

const showGroupAndUser = computed(() => canChooseGroupTypes.includes(chooseType))
const allCheckedList = computed(
  () => [...checkedUserList.value, ...checkedGroupList.value] as CheckedItem[],
)
const renderFriendList = computed(() =>
  formatContacts(
    keyword.value
      ? contactStore.storeFriendList.filter((friend) =>
        friend.nickname.includes(keyword.value),
      )
      : contactStore.storeFriendList,
  ),
)
const renderConversationList = conversationStore.storeConversationList.filter(
  (cve) =>
    cve.conversationType !== SessionType.Notification &&
    (keyword.value ? cve.showName.includes(keyword.value) : true),
)
const renderGroupList = computed(() =>
  keyword.value
    ? contactStore.storeGroupList.filter((group) =>
      group.groupName.includes(keyword.value),
    )
    : contactStore.storeGroupList,
)

const isBackRoute = chooseType !== ContactChooseEnum.LaunchGroup

onBeforeMount(() => {
  const state = history.state
  checkedUserList.value = state.prevCheckedUserList
    ? JSON.parse(state.prevCheckedUserList)
    : []
  checkedGroupList.value = state.prevCheckedGroupList
    ? JSON.parse(state.prevCheckedGroupList)
    : []
  checkDisabled()
})

const checkDisabled = () => {
  if (history.state.chooseType !== ContactChooseEnum.InviteGroup) {
    return
  }
  IMSDK.getUsersInGroup({
    groupID: history.state.extraData,
    userIDList: contactStore.storeFriendList.map((user) => user.userID),
  }).then(({ data }) => {
    disabledUserIDList.value = data
  })
}

const showPopType = (actionType: number) => {
  showPop.value = true
  activeTab.value = actionType
}

const updateConversationChoose = (conversation: ConversationItem) => {
  if (conversation.userID) {
    updateUserChoose(conversation as any)
  } else {
    updateGroupChoose(conversation as any)
  }
}

const clickFriend = (item: PublicUserItem) => {
  if (disabledUserIDList.value.includes(item.userID)) {
    return
  }
  updateUserChoose(item)
}

const updateUserChoose = (item: PublicUserItem) => {
  const idx = checkedUserList.value.findIndex((user) => user.userID === item.userID)
  if (idx > -1) {
    const tmpArr = [...checkedUserList.value]
    tmpArr.splice(idx, 1)
    checkedUserList.value = [...tmpArr]
  } else {
    checkedUserList.value = [...checkedUserList.value, item]
  }
}

const updateGroupChoose = (item: GroupItem) => {
  const idx = checkedGroupList.value.findIndex(
    (group) => group.groupID === item.groupID,
  )
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
    const idx = checkedGroupList.value.findIndex(
      (user) => user.groupID === item.groupID,
    )
    const tmpArr = [...checkedGroupList.value]
    tmpArr.splice(idx, 1)
    checkedGroupList.value = [...tmpArr]
  } else {
    const idx = checkedUserList.value.findIndex((user) => user.userID === item.userID)
    const tmpArr = [...checkedUserList.value]
    tmpArr.splice(idx, 1)
    checkedUserList.value = [...tmpArr]
  }
}

const confirm = async () => {
  console.log('confirm')
  switch (chooseType) {
    case ContactChooseEnum.LaunchGroup:
      router.replace({
        path: 'createGroup',
        state: {
          prevCheckedUserList: JSON.stringify(checkedUserList.value),
          extraData: history.state.extraData as string,
        },
      })
      router.go(-1)
      break
    case ContactChooseEnum.InviteGroup:
      IMSDK.inviteUserToGroup({
        groupID: history.state.extraData,
        userIDList: allCheckedList.value.map((user) => user.userID),
        reason: '',
      })
        .then(() => feedbackToast({ message: t('messageTip.inviteSuccess') }))
        .catch(() => feedbackToast({ message: t('messageTip.inviteFailed') }))
        .finally(() => router.back())
      break
    default:
      break
  }
}
</script>

<style lang="scss" scoped></style>
