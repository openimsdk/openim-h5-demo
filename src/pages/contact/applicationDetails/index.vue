<template>
  <div class="page_container">
    <NavBar :title="applicationTitle" />

    <div class="bg-white">
      <div class="flex items-center px-[22px] pt-4 pb-4">
        <Avatar :size="48" :src="getIcon" />
        <div>
          <div class="truncate max-w-[160px] ml-2">{{ getTitle }}</div>
          <div v-if="isGroup" class="truncate max-w-[160px] ml-2 text-sm">
            <span class="text-sub-text">{{ $t('applyJoin') }}:</span>
            <span class="text-primary">{{ application.groupName }}</span>
          </div>
        </div>
      </div>

      <div class="mx-[22px] h-[80px] bg-[#E8EAEF] rounded-md overflow-hidden">
        <div class="px-4 py-2">{{ application.reqMsg }}</div>
      </div>

      <div class="text-[13px] text-[#666] py-3 px-[22px] text-right">
        <span v-if="isGroup">{{ $t("source") }}:{{ joinSource }}</span>
      </div>

      <div class="mb-4 px-4 flex flex-row justify-around items-center">
        <van-button class="w-[160px]" type="default" :text="$t('buttons.reject')" @click="accessApplication(false)" />
        <van-button class="w-[160px]" type="primary" :text="$t('buttons.accept')" @click="accessApplication(true)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from "@/components/Avatar/index.vue";
import {
  ApplicationItemSource,
  ApplicationTypeEnum,
} from "@/components/ApplicationItem/data";
import { GroupJoinSource } from "@/utils/open-im-sdk-wasm/types/enum";
import { IMSDK } from "@/utils/imCommon";
import { feedbackToast } from "@/utils/common";
import { closeToast, showLoadingToast } from "vant";

const friendApplicationTypes = [
  ApplicationTypeEnum.RecivedFriendApplication,
  ApplicationTypeEnum.SentFriendApplication,
];

type ApplicationDetailsProps = {
  type: ApplicationTypeEnum;
  application: ApplicationItemSource
}

const { t } = useI18n();
const router = useRouter();
const props = defineProps<ApplicationDetailsProps>()

const applicationTitle = friendApplicationTypes.includes(props.type) ? t("contactMenu.newFriends") : t("contactMenu.newGroup");

const getTitle = computed(() => {
  switch (props.type) {
    case ApplicationTypeEnum.RecivedFriendApplication:
      return props.application.fromNickname;
    case ApplicationTypeEnum.SentFriendApplication:
      return props.application.toNickname;
    case ApplicationTypeEnum.RecivedGroupApplication:
      return props.application.nickname;
    case ApplicationTypeEnum.SentGroupApplication:
      return props.application.groupName;
    default:
      return "";
  }
});

const getIcon = computed(() => {
  switch (props.type) {
    case ApplicationTypeEnum.RecivedFriendApplication:
      return props.application.fromFaceURL;
    case ApplicationTypeEnum.SentFriendApplication:
      return props.application.toFaceURL;
    case ApplicationTypeEnum.RecivedGroupApplication:
      return props.application.userFaceURL;
    case ApplicationTypeEnum.SentGroupApplication:
      return props.application.groupFaceURL;
    default:
      return "";
  }
});

const isGroup = props.type === ApplicationTypeEnum.SentGroupApplication || props.type === ApplicationTypeEnum.RecivedGroupApplication

const joinSource = computed(() => {
  if (props.application.joinSource === GroupJoinSource.Invitation) {
    return t("groupMemberApply")
  }
  if (props.application.joinSource === GroupJoinSource.Search) {
    return t("searchGroupID")
  }
  return t("scanQrCode")
})

const accessApplication = (isAccept: boolean) => {
  showLoadingToast({
    duration: 0,
    forbidClick: true,
    message: t("loading"),
  });
  const funcName = isGroup ? `${isAccept ? 'accept' : 'refuse'}GroupApplication` : `${isAccept ? 'accept' : 'refuse'}FriendApplication`;
  // @ts-ignore
  IMSDK[funcName]({
    groupID: props.application.groupID!,
    fromUserID: props.application.userID!,
    toUserID: props.application.fromUserID!,
    handleMsg: ''
  }).then(() => {
    feedbackToast({ onClose: router.back })
  }).catch((error: unknown) => feedbackToast({ error }))
    .finally(closeToast)
}
</script>

<style lang="scss" scoped>
:deep(.van-field) {
  background: #eee;
  padding-top: 0;
}

:deep(.van-field__control) {
  font-size: 13px;
  color: #666;
}
</style>
