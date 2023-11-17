<template>
  <div class="page_container !overflow-y-auto">
    <NavBar>
      <img v-if="!isSelf" class="h-[23px] min-w-[23px]" :src="more" alt="more" @click="$router.push('userCardSetting')" />
    </NavBar>
    <div class="flex-1">
      <div class="px-[22px] py-6 mb-2 flex items-center bg-white">
        <Avatar :size="48" :src="contactStore.storeUserCardData.baseInfo?.faceURL"
          :desc="contactStore.storeUserCardData.baseInfo?.nickname" />
        <div class="ml-3 flex flex-row justify-between items-center flex-1">
          <div class="flex items-start flex-col justify-between">
            <span class="max-w-[160px] truncate mr-2 font-medium">
              {{ contactStore.storeUserCardData.baseInfo?.nickname }}
            </span>
            <span class="max-w-[160px] truncate mr-2 font-medium text-sm text-sub-text"
              @click="copy2Text(contactStore.storeUserCardData.baseInfo?.userID || '')">
              {{ contactStore.storeUserCardData.baseInfo?.userID }}
            </span>
          </div>
          <div v-if="cannAddFriend && !isSelf"
            class="flex flex-row justify-center items-center bg-primary rounded-md px-2 py-1 h-[30px] ml-auto"
            @click="toAddFriend">
            <img width="20" :src="add" alt="" />
            <span class="text-white text-sm">{{ $t('add') }}</span>
          </div>
        </div>
      </div>

      <!-- about group -->
      <div class="mb-2" v-if="contactStore.storeUserCardData.groupMemberInfo">
        <CardDescItem :lable="$t('groupNickDesc')" :content="contactStore.storeUserCardData.groupMemberInfo.nickname" />
        <CardDescItem :lable="$t('joinGroupTime')" :content="comptJoinTime" />
        <CardDescItem :lable="$t('joinGroupMethod')" :content="comptJoinSource" />
      </div>

      <div class="mb-2" v-if="contactStore.storeUserCardData.groupMemberInfo && !isSelf">
        <CardDescItem v-if="isOwner" :lable="$t('setAdmin')" arrow>
          <van-switch size="20" :loading="setAdminLoading"
            :model-value="contactStore.storeUserCardData.groupMemberInfo.roleLevel === GroupMemberRole.Admin"
            @update:model-value="onUpdateValue" />
        </CardDescItem>
        <CardDescItem v-if="showSetMuteMember" :lable="$t('setMute')" arrow />
      </div>

      <CardDescItem v-if="friendInfo" class="mb-2" :lable="$t('userInfo')" arrow
        @click="$router.push('userCardDetails')" />
    </div>

    <div class="flex justify-between w-full px-[22px] mb-6 mt-8">
      <van-button v-if="cannSendMessage && !isSelf" :icon="message" type="primary" class="w-full !ml-1 text-base"
        @click="toConversation">
        {{ $t('sendMessage') }}
      </van-button>

    </div>
  </div>
</template>

<script setup lang='ts'>
import message from '@assets/images/userCard/message.png'
import add from '@assets/images/userCard/add.png'
import more from '@assets/images/chatHeader/more.png'

import NavBar from '@/components/NavBar/index.vue';
import Avatar from '@/components/Avatar/index.vue';
import CardDescItem from '@/components/CardDescItem/index.vue';
import { IMSDK } from '@/utils/imCommon';
import { feedbackToast, copy2Text } from '@/utils/common';
import useContactStore from '@/store/modules/contact';
import useCurrentMemberRole from '@/hooks/useCurrentMemberRole';
import { AllowType, GroupJoinSource, GroupMemberRole, SessionType } from '@/utils/open-im-sdk-wasm/types/enum';
import dayjs from 'dayjs';
import useUserStore from '@/store/modules/user';
import useConversationStore from '@/store/modules/conversation';
import { BusinessAllowType } from '@/api/data';
import useConversationToggle from '@/hooks/useConversationToggle';

const { toSpecifiedConversation } = useConversationToggle();
const conversationStore = useConversationStore()
const contactStore = useContactStore()
const userStore = useUserStore()
const router = useRouter()
const { t } = useI18n()

const isSelf = contactStore.storeUserCardData.baseInfo?.userID === userStore.selfInfo.userID
const friendInfo = computed(() => contactStore.storeFriendList.find(friend => friend.userID === contactStore.storeUserCardData.baseInfo?.userID))

// group
const { isAdmin, isOwner } = useCurrentMemberRole()
const showSetMuteMember = ref(false)
const setAdminLoading = ref(false)
const comptJoinTime = computed(() => contactStore.storeUserCardData.groupMemberInfo ? dayjs(contactStore.storeUserCardData.groupMemberInfo.joinTime).format("YYYY-MM-DD") : '')
const comptJoinSource = computed(() => {
  if (!contactStore.storeUserCardData.groupMemberInfo) {
    return '';
  }

  switch (contactStore.storeUserCardData.groupMemberInfo.joinSource) {
    case GroupJoinSource.Invitation:
      return t('inviteToGroup');
    case GroupJoinSource.QrCode:
      return t('qrToGroup');
    case GroupJoinSource.Search:
      return t('searchToGroup')
    default:
      return '-'
  }
})
const cannSendMessage = computed(() => Number(userStore.storeAppConfig.allowSendMsgNotFriend) === BusinessAllowType.Allow ? true : !!friendInfo.value)
const cannAddFriend = computed(() => {
  if (!!friendInfo.value) {
    return false
  }
  if (!!contactStore.storeUserCardData.groupMemberInfo) {
    return conversationStore.storeCurrentGroupInfo.applyMemberFriend === AllowType.Allowed
  }

  return true
})


const checkMemberInGroup = async () => {
  if (!contactStore.storeUserCardData.groupMemberInfo) {
    return;
  }
  showSetMuteMember.value = isOwner.value || (isAdmin.value && contactStore.storeUserCardData.groupMemberInfo.roleLevel === GroupMemberRole.Nomal)
}
const onUpdateValue = (newValue: boolean) => {
  setAdminLoading.value = true;
  IMSDK.setGroupMemberRoleLevel({
    groupID: contactStore.storeUserCardData.groupMemberInfo!.groupID,
    userID: contactStore.storeUserCardData.groupMemberInfo!.userID,
    roleLevel: newValue ? GroupMemberRole.Admin : GroupMemberRole.Nomal
  })
    .catch((error) => feedbackToast({ error }))
    .finally(() => setAdminLoading.value = false)
}

// events
const toConversation = () => {
  toSpecifiedConversation({
    sourceID: contactStore.storeUserCardData.baseInfo?.userID!,
    sessionType: SessionType.Single
  })
}

const toAddFriend = () => {
  router.push({
    path: 'sendApplication',
    query: {
      sourceID: contactStore.storeUserCardData.baseInfo?.userID,
      sessionType: SessionType.Single
    }
  })
}

onBeforeMount(() => {
  checkMemberInGroup();
})

</script>

<style lang='scss' scoped></style>