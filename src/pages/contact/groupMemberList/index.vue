<template>
  <div class="page_container">
    <NavBar :router="false" :title="title" @left-click="tryBack" />
    <van-search v-model="searchState.keyword" :placeholder="$t('placeholder.search')" @search="onSearch" @blur="onBlur" />
    <virtual-list class="my_scrollbar flex-1 overflow-y-auto" @tobottom="loadmore" :data-key="'userID'"
      :data-sources="renderData" :data-component="GenericListItem" :estimate-size="88" :extra-props="(member: GroupMemberItem) => ({
        total: fetchState.groupMemberList.length,
        showCheck: showCheck,
        checked: checkedMemberIDList.includes(member.userID),
        disabled: checkIsDisable(member.roleLevel),
        onClickItem: clickItem,
        showRole: true
      })" />
    <CheckedFooter v-if="showCheck" :all-checked-list="allCheckedList" :total="renderData.length" @remove="remove"
      @confirm="confirm" />
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar/index.vue";
import VirtualList from "@components/VirtualList";
import GenericListItem from "@/components/GenericListItem/index.vue";
import useGroupMemberList from "@/hooks/useGroupMemberList";
import { showConfirmDialog } from "vant";
import useCurrentMemberRole from "@/hooks/useCurrentMemberRole";
import { GroupMemberItem } from "@/utils/open-im-sdk-wasm/types/entity";
import { MemberListActionEnum } from "./data";
import CheckedFooter from "@/components/CheckedFooter/index.vue";
import { AllowType, GroupMemberRole } from "@/utils/open-im-sdk-wasm/types/enum";
import useContactStore from "@/store/modules/contact";
import { IMSDK } from "@/utils/imCommon";
import { feedbackToast } from "@/utils/common";
import { onBeforeRouteLeave } from "vue-router";
import useConversationStore from "@/store/modules/conversation";

type GroupMemberListState = {
  groupID?: string;
  action: MemberListActionEnum;
};

const { t } = useI18n()
const router = useRouter();
const contactStore = useContactStore();
const conversationStore = useConversationStore()

const pageState: GroupMemberListState = history.state
const showCheckType = [MemberListActionEnum.CallInvite, MemberListActionEnum.ChooseAt, MemberListActionEnum.Kickout]

const { fetchState, getMemberData, searchMember } = useGroupMemberList(pageState.groupID);
const { isOwner } = useCurrentMemberRole(pageState.groupID);

const action = ref(pageState.action)
const checkedMemberIDList = ref([] as string[]);
const searchState = reactive({
  keyword: "",
  searching: false,
});

const showCheck = computed(() => showCheckType.includes(action.value))
const allCheckedList = computed(() => fetchState.groupMemberList.filter(member => checkedMemberIDList.value.includes(member.userID)))
const title = computed(() => {
  switch (action.value) {
    case MemberListActionEnum.CallInvite:
      return t('invite')
    case MemberListActionEnum.ChooseAt:
      return t('selectAtMember')
    case MemberListActionEnum.Kickout:
      return t('kickMember')
    case MemberListActionEnum.Transfer:
      return t('transferGroupDesc')
    default:
      return t('groupMember')
  }
})
const renderData = computed(() => {
  if (searchState.searching) {
    return fetchState.searchMemberList
  }
  if (history.state.action === MemberListActionEnum.Transfer) {
    return fetchState.groupMemberList.filter((member) => member.roleLevel !== GroupMemberRole.Owner)
  }
  return fetchState.groupMemberList
})
const checkIsDisable = computed(() => (level: GroupMemberRole) => {
  if (level === GroupMemberRole.Owner) {
    return true
  }
  if (level === GroupMemberRole.Admin) {
    return !isOwner.value
  }
  return false
})

const onSearch = () => {
  if (!searchState.keyword) {
    return;
  }
  searchState.searching = true;
  fetchState.searchOffset = 0;
  fetchState.searchMemberList = [];
  searchMember(searchState.keyword)
};

const onBlur = () => {
  if (!searchState.keyword) {
    searchState.searching = false;
  }
}

const loadmore = () => {
  if (!fetchState.hasMore) {
    return;
  }

  if (searchState.searching) {
    searchMember(searchState.keyword)
  } else {
    getMemberData()
  }
}

const tryBack = () => {
  if (showCheck.value && action.value === MemberListActionEnum.Kickout) {
    action.value = MemberListActionEnum.Preview
    return;
  }
  router.back();
}

const clickItem = async (member: GroupMemberItem) => {
  if (action.value === MemberListActionEnum.Transfer) {
    showConfirmDialog({
      message: t('messageTip.transferOwner', { name: member.nickname }),
      beforeClose: (action: string) => {
        return new Promise((resolve) => {
          if (action !== "confirm") {
            resolve(true);
            return;
          }
          IMSDK.transferGroupOwner({
            groupID: member.groupID,
            newOwnerUserID: member.userID
          })
            .then(() => router.back())
            .catch((error: unknown) => feedbackToast({ error }))
            .finally(() => resolve(true));
        });
      },
    });
    return
  }
  if (!showCheck.value) {
    if (conversationStore.storeCurrentGroupInfo.lookMemberInfo === AllowType.Allowed) {
      contactStore.getUserCardData(member.userID, member.groupID)
    }
    return;
  }
  if (checkIsDisable.value(member.roleLevel)) {
    return
  }
  const idx = checkedMemberIDList.value.findIndex(userID => member.userID === userID)
  if (idx > -1) {
    const tmpArr = [...checkedMemberIDList.value]
    tmpArr.splice(idx, 1)
    checkedMemberIDList.value = tmpArr
  } else {
    checkedMemberIDList.value.push(member.userID)
  }
}

const confirm = () => {
  if (action.value === MemberListActionEnum.Kickout) {
    IMSDK.kickGroupMember({
      groupID: pageState.groupID!,
      reason: "",
      userIDList: checkedMemberIDList.value
    }).then(() => {
      action.value = MemberListActionEnum.Preview
      fetchState.groupMemberList = [];
      fetchState.offset = 0;
      fetchState.loading = false;
      fetchState.hasMore = true;
      getMemberData();
      feedbackToast({ message: t('messageTip.kuckSuccess') })
    }).catch(error => feedbackToast({ error }))
  }
}

const remove = (member: GroupMemberItem) => {
  const idx = checkedMemberIDList.value.findIndex(userID => member.userID === userID)
  if (idx > -1) {
    const tmpArr = [...checkedMemberIDList.value]
    tmpArr.splice(idx, 1)
    checkedMemberIDList.value = tmpArr
  }
}

onBeforeRouteLeave((to, from, next) => {
  history.state.action = MemberListActionEnum.Preview
  next();
})

</script>

<style lang="scss" scoped></style>
