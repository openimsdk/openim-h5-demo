<template>
  <div class="bg-white py-4 px-[22px] my-3" @click="toMemberList">
    <div class="flex w-full justify-between">
      <span>群成员</span>
      <div class="text-[#999] text-[13px]">
        <span class="mr-1">{{ `${memberCount}人` }}</span>
        <van-icon name="arrow" />
      </div>
    </div>

    <div class="flex mt-3">
      <Avatar class="mr-[6px]" v-for="member in fetchState.groupMemberList.slice(0, isNomal ? 6 : 5)"
        :src="member.faceURL" :desc="member.nickname" :size="42" />
        <img class="w-9 h-9" :src="group_setting_invite" alt="" @click.stop="inviteMember" />
      <img v-if="!isNomal" class="w-9 h-9 ml-[6px]" :src="group_setting_remove" alt="" @click.stop="kickMember" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from "@/components/Avatar/index.vue";
import useGroupMemberList from "@/hooks/useGroupMemberList";
import { ContactChooseEnum } from "@/pages/contact/chooseUser/data";
import { MemberListActionEnum } from "@/pages/contact/groupMemberList/data";
import useConversationStore from "@/store/modules/conversation";
import group_setting_invite from "@assets/images/group_setting_invite.png";
import group_setting_remove from "@assets/images/group_setting_remove.png";

type GroupMemberRowProps = {
  memberCount: number;
  isNomal: boolean;
};

const router = useRouter();
const conversationStore = useConversationStore();

const props = defineProps<GroupMemberRowProps>();
const { fetchState } = useGroupMemberList(undefined,true);

const inviteMember = () => {
  router.push({
    path: 'chooseUser',
    state: {
      chooseType: ContactChooseEnum.InviteGroup,
      extraData: conversationStore.storeCurrentGroupInfo.groupID,
    }
  })
}

const kickMember = () => {
  router.push({
    path: 'groupMemberList',
    state: {
      groupID: conversationStore.storeCurrentGroupInfo.groupID,
      action: MemberListActionEnum.Kickout
    }
  })
}

const toMemberList = () => {
  router.push({
    path: 'groupMemberList',
    state: {
      groupID: conversationStore.storeCurrentGroupInfo.groupID,
      action: MemberListActionEnum.Preview
    }
  })
}

</script>

<style lang="scss" scoped>

</style>
