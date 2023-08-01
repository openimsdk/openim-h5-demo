<template>
  <div class="page_container">
    <NavBar :title="title"/>
    <van-search placeholder="请输入搜索关键词" />
    <virtual-list class="my_scrollbar flex-1 overflow-y-auto bg-white" @tobottom="loadmore" :data-key="'userID'"
      :data-sources="fetchState.groupMemberList" :data-component="GenericListItem" :estimate-size="88" :extra-props="(member: GroupMemberItem) => ({
        total: fetchState.groupMemberList.length,
        showCheck: showCheck,
        checked: checkedMemberIDList.includes(member.userID),
        disabled: checkIsDisable(member.roleLevel),
        onClickItem: clickItem
      })" />
    <CheckedFooter v-if="showCheck" :all-checked-list="allCheckedList" @remove="remove" @confirm="confirm" />
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar/index.vue";
import VirtualList from "@components/VirtualList";
import GenericListItem from "@/components/GenericListItem/index.vue";
import useGroupMemberList from "@/hooks/useGroupMemberList";
import useCurrentMemberRole from "@/hooks/useCurrentMemberRole";
import { GroupMemberItem } from "open-im-sdk-wasm/lib/types/entity";
import { MemberListActionEnum } from "./data";
import CheckedFooter from "@/components/CheckedFooter/index.vue";
import { GroupMemberRole } from "open-im-sdk-wasm/lib/types/enum";
import useContactStore from "@/store/modules/contact";
import { IMSDK } from "@/utils/imCommon";
import { feedbackToast } from "@/utils/common";
import { onBeforeRouteLeave } from "vue-router";
import useConversationStore from "@/store/modules/conversation";

type GroupMemberListState = {
  groupID?: string;
  action: MemberListActionEnum;
};

const { t } = useI18n();
const router = useRouter();
const contactStore = useContactStore();
const conversationStore = useConversationStore()

const pageState: GroupMemberListState = history.state
const showCheckType = [MemberListActionEnum.Kickout]

const { fetchState, getMemberData } = useGroupMemberList(pageState.groupID);
const { isOwner } = useCurrentMemberRole(pageState.groupID);

const action = ref(pageState.action)
const checkedMemberIDList = ref([] as string[]);

const showCheck = computed(() => showCheckType.includes(action.value))
const allCheckedList = computed(() => fetchState.groupMemberList.filter(member => checkedMemberIDList.value.includes(member.userID)))
const title = computed(() => {
  switch (action.value) {
    case MemberListActionEnum.Kickout:
      return '移除群成员'
    default:
      return '群成员'
  }
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

const loadmore = () => {
  if (!fetchState.hasMore) {
    return;
  }

  getMemberData()
}

const clickItem = async (member: GroupMemberItem) => {
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
      feedbackToast({ message: "移除成功！" })
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

onBeforeRouteLeave((to,from,next)=>{
  history.state.action = MemberListActionEnum.Preview
  next();
})

</script>

<style lang="scss" scoped></style>
