<template>
  <div class="page_container !overflow-y-auto">
    <NavBar>
      <img
        v-if="!isSelf"
        class="h-[23px] min-w-[23px]"
        :src="more"
        alt="more"
        @click="$router.push('userCardSetting')"
      />
    </NavBar>
    <div class="flex-1">
      <div class="mb-2 flex items-center bg-white px-[22px] py-6">
        <Avatar
          :size="48"
          :src="contactStore.storeUserCardData.baseInfo?.faceURL"
          :desc="contactStore.storeUserCardData.baseInfo?.nickname"
          @click="avatarPreview"
        />
        <div class="ml-3 flex flex-1 flex-row items-center justify-between">
          <div class="flex flex-col items-start justify-between">
            <span class="mr-2 max-w-[160px] truncate font-medium">
              {{ contactStore.storeUserCardData.baseInfo?.nickname }}
              {{
                contactStore.storeUserCardData.baseInfo?.remark
                  ? '(' + contactStore.storeUserCardData.baseInfo?.remark + ')'
                  : ''
              }}
            </span>
            <span
              class="mr-2 max-w-[160px] truncate text-sm font-medium text-sub-text"
              @click="copy2Text(contactStore.storeUserCardData.baseInfo?.userID || '')"
            >
              {{ contactStore.storeUserCardData.baseInfo?.userID }}
            </span>
          </div>
          <div
            v-if="cannAddFriend && !isSelf"
            class="ml-auto flex h-[30px] flex-row items-center justify-center rounded-md bg-primary px-2 py-1"
            @click="toAddFriend"
          >
            <img width="20" :src="add" alt="" />
            <span class="text-sm text-white">{{ $t('add') }}</span>
          </div>
        </div>
      </div>

      <!-- about group -->
      <div class="mb-2" v-if="contactStore.storeUserCardData.groupMemberInfo">
        <CardDescItem :lable="$t('joinGroupTime')" :content="comptJoinTime" />
      </div>

      <CardDescItem
        v-if="friendInfo"
        class="mb-2"
        :lable="$t('userInfo')"
        arrow
        @click="$router.push('userCardDetails')"
      />
    </div>

    <div class="mb-6 mt-8 flex w-full justify-between px-[22px]">
      <van-button
        v-if="!isSelf"
        :icon="message"
        type="primary"
        class="!ml-1 w-full text-base"
        @click="toConversation"
      >
        {{ $t('sendMessage') }}
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import message from '@assets/images/userCard/message.png'
import add from '@assets/images/userCard/add.png'
import more from '@assets/images/chatHeader/more.png'

import NavBar from '@/components/NavBar/index.vue'
import Avatar from '@/components/Avatar/index.vue'
import CardDescItem from '@/components/CardDescItem/index.vue'
import { IMSDK } from '@/utils/imCommon'
import { feedbackToast, copy2Text } from '@/utils/common'
import useContactStore from '@/store/modules/contact'
import useCurrentMemberRole from '@/hooks/useCurrentMemberRole'
import {
  AllowType,
  GroupJoinSource,
  GroupMemberRole,
  SessionType,
} from '@openim/wasm-client-sdk'
import dayjs from 'dayjs'
import useUserStore from '@/store/modules/user'
import useConversationStore from '@/store/modules/conversation'
import { BusinessAllowType } from '@/api/data'
import useConversationToggle from '@/hooks/useConversationToggle'
import { showImagePreview } from 'vant'

const { toSpecifiedConversation } = useConversationToggle()
const conversationStore = useConversationStore()
const contactStore = useContactStore()
const userStore = useUserStore()
const router = useRouter()
const { t } = useI18n()

const isSelf =
  contactStore.storeUserCardData.baseInfo?.userID === userStore.selfInfo.userID
const friendInfo = computed(() =>
  contactStore.storeFriendList.find(
    (friend) => friend.userID === contactStore.storeUserCardData.baseInfo?.userID,
  ),
)

// group
const comptJoinTime = computed(() =>
  contactStore.storeUserCardData.groupMemberInfo
    ? dayjs(contactStore.storeUserCardData.groupMemberInfo.joinTime).format(
        'YYYY-MM-DD',
      )
    : '',
)

const cannAddFriend = computed(() => {
  if (!!friendInfo.value) {
    return false
  }

  return true
})

const checkMemberInGroup = async () => {
  if (!contactStore.storeUserCardData.groupMemberInfo) {
    return
  }
}

// events
const toConversation = () => {
  toSpecifiedConversation({
    sourceID: contactStore.storeUserCardData.baseInfo?.userID!,
    sessionType: SessionType.Single,
  })
}

const toAddFriend = () => {
  if (
    contactStore.storeUserCardData.baseInfo?.allowAddFriend ===
    BusinessAllowType.NotAllow
  ) {
    feedbackToast({
      message: t('notCanAddFriend'),
      error: t('notCanAddFriend'),
    })
    return
  }
  router.push({
    path: 'sendApplication',
    query: {
      sourceID: contactStore.storeUserCardData.baseInfo?.userID,
      sessionType: SessionType.Single,
    },
  })
}

const avatarPreview = () => {
  if (contactStore.storeUserCardData.baseInfo?.faceURL?.includes('http')) {
    return showImagePreview({
      images: [contactStore.storeUserCardData.baseInfo?.faceURL],
      loop: false,
    })
  }
}

onBeforeMount(() => {
  checkMemberInGroup()
})
</script>

<style lang="scss" scoped></style>
