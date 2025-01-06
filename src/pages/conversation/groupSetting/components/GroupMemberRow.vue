<template>
  <div
    class="mx-[10px] mt-[10px] overflow-hidden rounded-md bg-white px-1 pt-2"
    @click="toMemberList"
  >
    <div class="mt-3 flex flex-wrap">
      <div
        class="flex w-[42px] shrink-0 grow-0 basis-1/5 flex-col items-center justify-center px-[6px] pb-[10px]"
        v-for="member in fetchState.groupMemberList.slice(0, isNomal ? 9 : 8)"
      >
        <div class="relative h-12 w-12">
          <Avatar :src="member.faceURL" :desc="member.nickname" :size="48" />
          <div
            v-if="member.roleLevel === 100"
            class="absolute bottom-0 flex w-12 items-center justify-center rounded-md bg-[#E8EAEF] text-xs text-primary"
          >
            {{ $t('groupOwner') }}
          </div>
        </div>
        <span class="mt-0.5 w-[42px] truncate text-center text-xs text-sub-text">{{
          member.nickname
        }}</span>
      </div>

      <div
        class="flex w-[42px] shrink-0 grow-0 basis-1/5 flex-col items-center justify-center px-[6px] pb-[10px]"
      >
        <img class="h-12 w-12" :src="group_invite" alt="" @click.stop="inviteMember" />
        <span class="mt-0.5 w-[42px] truncate text-center text-xs text-sub-text">{{
          $t('add')
        }}</span>
      </div>

      <div
        v-if="!isNomal"
        class="flex w-[42px] shrink-0 grow-0 basis-1/5 flex-col items-center justify-center px-[6px] pb-[10px]"
      >
        <img class="h-12 w-12" :src="group_remove" alt="" @click.stop="kickMember" />
        <span class="mt-0.5 w-[42px] truncate text-center text-xs text-sub-text">{{
          $t('buttons.remove')
        }}</span>
      </div>
    </div>

    <SettingRowItem
      class="border-t"
      :title="`${$t('allGroupMember')}(${memberCount})`"
    />
  </div>
</template>

<script setup lang="ts">
import Avatar from '@/components/Avatar/index.vue'
import useGroupMemberList from '@/hooks/useGroupMemberList'
import { ContactChooseEnum } from '@/pages/contact/chooseUser/data'
import { MemberListActionEnum } from '@/pages/contact/groupMemberList/data'
import useConversationStore from '@/store/modules/conversation'
import group_invite from '@assets/images/setting/group_invite.png'
import group_remove from '@assets/images/setting/group_remove.png'
import SettingRowItem from '@/components/SettingRowItem/index.vue'

type GroupMemberRowProps = {
  memberCount: number
  isNomal: boolean
}

defineProps<GroupMemberRowProps>()

const router = useRouter()
const conversationStore = useConversationStore()
const { fetchState } = useGroupMemberList(undefined, true)

const inviteMember = () => {
  router.push({
    path: 'chooseUser',
    state: {
      chooseType: ContactChooseEnum.InviteGroup,
      extraData: conversationStore.storeCurrentGroupInfo.groupID,
    },
  })
}

const kickMember = () => {
  router.push({
    path: 'groupMemberList',
    state: {
      groupID: conversationStore.storeCurrentGroupInfo.groupID,
      action: MemberListActionEnum.Kickout,
    },
  })
}

const toMemberList = () => {
  router.push({
    path: 'groupMemberList',
    state: {
      groupID: conversationStore.storeCurrentGroupInfo.groupID,
      action: MemberListActionEnum.Preview,
    },
  })
}
</script>

<style lang="scss" scoped></style>
