<template>
  <div class="flex items-center px-[22px] py-4 header">
    <Avatar :size="48" :src="userStore.storeSelfInfo.faceURL" :desc="userStore.storeSelfInfo.nickname" />
    <div class="flex-1 mx-3 text-xs">
      <div class="flex items-center">
        <div class="text-base truncate max-w-[30vw]">{{ userStore.storeSelfInfo.nickname }}</div>
        <view class="flex justify-center items-center w-[76px] h-[22px] bg-[#F2F8FF] rounded-md ml-3"
          v-if="userStore.isSyncing">
          <img class="loading h-3 w-3" :src="loading" alt="" />
          <text class="text-xs ml-0.5 text-primary">{{ $t('syncing') }}</text>
        </view>
        <view class="flex justify-center items-center w-[76px] h-[22px] bg-[#F2F8FF] rounded-md ml-3"
          v-if="connectState === connectStateEnum.Loading">
          <img class="loading h-3 w-3" :src="loading" alt="" />
          <text class="text-xs ml-0.5 text-primary">{{ $t('connecting') }}</text>
        </view>
        <view class="flex justify-center items-center w-[76px] h-[22px] bg-[#FFE1DD] rounded-md ml-3"
          v-if="connectState === connectStateEnum.Failed">
          <img class="h-3 w-3" :src="sync_error" alt="" />
          <text class="text-xs ml-0.5 text-error-text">{{ $t('connectFailed') }}</text>
        </view>
      </div>
    </div>
    <div class="flex">
      <!-- <img :src="call" alt="call" width="24" class="mr-2" /> -->
      <van-popover :show-arrow="false" v-model:show="showPopover" :actions="conversationTopMoreActions"
        placement="bottom-end" @select="selectMenu">
        <template #reference>
          <img :src="add" alt="add" width="24" />
        </template>
      </van-popover>

    </div>
  </div>
</template>

<script setup lang='ts'>
import add_friend from "@/assets/images/conversation/add_friend.png";
import add_group from "@/assets/images/conversation/add_group.png";
import scan from "@/assets/images/conversation/scan.png";
import create_group from "@/assets/images/conversation/create_group.png";
import Avatar from '@/components/Avatar/index.vue';
import add from '@/assets/images/conversation/add.png'
import loading from '@/assets/images/conversation/loading.png'
import sync_error from '@assets/images/conversation/sync_error.png'
import { PopoverAction } from 'vant';
import useUserStore from '@/store/modules/user';
import { IMSDK } from '@/utils/imCommon';
import { CbEvents } from '@/utils/open-im-sdk-wasm/constant';
import { GroupType } from '@/utils/open-im-sdk-wasm/types/enum';

enum ActionEnum {
  Scan,
  AddFriend,
  AddGroup,
  LaunchGroup
}

enum connectStateEnum {
  Loading,
  Success,
  Failed
}

const { t, locale } = useI18n();

const conversationTopMoreActions: PopoverAction[] = [
  {
    text: t("scanQr"),
    icon: scan,
  },
  {
    text: t("addFriend"),
    icon: add_friend,
  },
  {
    text: t("addGroup"),
    icon: add_group,
  },
  {
    text: t("launchGroup"),
    icon: create_group,
  },
];


watch(locale, () => {
  conversationTopMoreActions[0].text = t("scanQr");
  conversationTopMoreActions[1].text = t("addFriend");
  conversationTopMoreActions[2].text = t("addGroup");
  conversationTopMoreActions[3].text = t("launchGroup");
});

const userStore = useUserStore()
const router = useRouter()

const showPopover = ref(false)
const connectState = ref(connectStateEnum.Success)

const setConnectLoading = () => connectState.value = connectStateEnum.Loading
const setConnectSuccess = () => connectState.value = connectStateEnum.Success
const setConnectFailed = () => connectState.value = connectStateEnum.Failed

onMounted(() => {
  IMSDK.on(CbEvents.OnConnecting, setConnectLoading);
  IMSDK.on(CbEvents.OnConnectSuccess, setConnectSuccess);
  IMSDK.on(CbEvents.OnConnectFailed, setConnectFailed);
})

onBeforeUnmount(() => {
  IMSDK.off(CbEvents.OnConnecting, setConnectLoading);
  IMSDK.off(CbEvents.OnConnectSuccess, setConnectSuccess);
  IMSDK.off(CbEvents.OnConnectFailed, setConnectFailed);
})

const selectMenu = (_: PopoverAction, idx: ActionEnum) => {
  switch (idx) {
    case ActionEnum.Scan:
      router.push('scanPage')
      break;
    case ActionEnum.AddFriend:
    case ActionEnum.AddGroup:
      router.push({
        path: 'searchToJoin',
        query: {
          isGroup: String(idx === ActionEnum.AddGroup)
        }
      })
      break;
    case ActionEnum.LaunchGroup:
      router.push({
        path: 'createGroup',
        query: {
          groupType: GroupType.WorkingGroup
        }
      })
      break;
    default:
      break;
  }
}
</script>

<style lang='scss' scoped>
@keyframes loading {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading {
  animation: loading 1.5s infinite;
}
</style>