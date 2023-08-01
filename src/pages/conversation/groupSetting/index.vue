<template>
  <div class="page_container">
    <NavBar title="聊天设置" />

    <div class="overflow-y-auto flex-1">
      <div class="flex items-center bg-white px-[22px] py-[18px] mt-3">
        <Avatar class="mr-5" :size="48" :src="conversationStore.currentConversation.faceURL" is-group />
        <div class="max-w-[160px] truncate">
          {{ conversationStore.currentConversation.showName }}
        </div>
        <span>{{
          `（${conversationStore.storeCurrentGroupInfo.memberCount}）`
        }}</span>
      </div>

      <GroupMemberRow :member-count="conversationStore.storeCurrentGroupInfo.memberCount" :is-nomal="isNomal"/>


      <SettingRowItem title="群聊名称" :sub-title="conversationStore.storeCurrentGroupInfo.groupName" />

      <SettingRowItem title="群ID号" border :sub-title="conversationStore.storeCurrentGroupInfo.groupID"
        @click="copyGroupID" />

      <div class="my-12">
        <van-button class="w-full text-[#F85050] !border-0" plain type="default" :text="isOwner ? '解散群聊' : '退出群聊'" />
      </div>
    </div>
  </div>
</template>

<script name="groupSetting" setup lang="ts">
import NavBar from "@/components/NavBar/index.vue";
import Avatar from "@/components/Avatar/index.vue";
import { showToast } from "vant";
import SettingRowItem from "@/components/SettingRowItem/index.vue";
import GroupMemberRow from "./components/GroupMemberRow.vue";
import { useClipboard } from "@vueuse/core";
import useConversationStore from "@/store/modules/conversation";
import { GroupMemberRole } from "open-im-sdk-wasm/lib/types/enum";

const { copy, isSupported } = useClipboard()

const conversationStore = useConversationStore();


const isOwner = conversationStore.currentMemberInGroup.roleLevel === GroupMemberRole.Owner
const isNomal = conversationStore.currentMemberInGroup.roleLevel === GroupMemberRole.Nomal

const copyGroupID = () => {
  if (isSupported) {
    copy(conversationStore.storeCurrentGroupInfo.groupID)
  }
  showToast(isSupported ? '复制成功！' : '当前环境暂不支持复制！')
}

</script>

<style lang="scss" scoped></style>
