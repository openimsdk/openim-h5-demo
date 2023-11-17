<template>
  <div class="bg-white pt-2 px-1 mt-[10px] mx-[10px] rounded-md overflow-hidden" @click="toMemberList">

    <div class="flex flex-wrap mt-3">
      <div class="flex flex-col justify-center items-center grow-0 shrink-0 basis-1/5 pb-[10px] px-[6px] w-[42px]"
        v-for="member in fetchState.groupMemberList.slice(0, isNomal ? 9 : 8)">
        <div class="relative w-12 h-12">
          <Avatar :src="member.faceURL" :desc="member.nickname" :size="48" />
          <div v-if="member.roleLevel === 100"
            class="absolute w-12 flex justify-center items-center bg-[#E8EAEF] text-primary rounded-md bottom-0 text-xs">
            {{ $t('groupOwner') }}</div>
        </div>
        <span class="w-[42px] text-center text-xs text-sub-text truncate mt-0.5">{{ member.nickname }}</span>
      </div>

      <div class="flex flex-col justify-center items-center grow-0 shrink-0 basis-1/5 pb-[10px] px-[6px] w-[42px]">
        <img class="w-12 h-12" :src="group_invite" alt="" @click.stop="inviteMember" />
        <span class="w-[42px] text-center text-xs text-sub-text truncate mt-0.5">{{ $t('add') }}</span>
      </div>

      <div v-if="!isNomal"
        class="flex flex-col justify-center items-center grow-0 shrink-0 basis-1/5 pb-[10px] px-[6px] w-[42px]">
        <img class="w-12 h-12" :src="group_remove" alt="" @click.stop="kickMember" />
        <span class="w-[42px] text-center text-xs text-sub-text truncate mt-0.5">{{ $t('buttons.remove') }}</span>
      </div>

    </div>

    <SettingRowItem class="border-t" :title="`${$t('allGroupMember')}(${memberCount})`" />
  </div>
</template>

<script setup lang="ts">
import Avatar from "@/components/Avatar/index.vue";
import useGroupMemberList from "@/hooks/useGroupMemberList";
import { ContactChooseEnum } from "@/pages/contact/chooseUser/data";
import { MemberListActionEnum } from "@/pages/contact/groupMemberList/data";
import useConversationStore from "@/store/modules/conversation";
import group_invite from "@assets/images/setting/group_invite.png";
import group_remove from "@assets/images/setting/group_remove.png";
import SettingRowItem from "@/components/SettingRowItem/index.vue";

type GroupMemberRowProps = {
  memberCount: number;
  isNomal: boolean;
};

defineProps<GroupMemberRowProps>();

const router = useRouter();
const conversationStore = useConversationStore();
const { fetchState } = useGroupMemberList(undefined, true);

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

<style lang="scss" scoped></style>
