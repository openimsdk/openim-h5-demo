<template>
  <div class="px-[22px] py-3 flex items-start">
    <Avatar :src="getIcon" :size="iconSize" :is-group="showGroupAvatar" />
    <div class="flex justify-between items-start w-full h-full ml-4 relative">
      <div>
        <div>{{ getTitle }}</div>
        <div v-if="isGroup" class="flex flex-col text-xs text-[#666]">
          <div class="mt-[6px] mb-3">
            <span>申请加入</span>
            <span class="text-[#418AE5] ml-1">{{ source.groupName }}</span>
          </div>
          <div class="mb-1">申请理由：</div>
        </div>
        <div class="text-[#999] text-[13px]">{{ source.reqMsg || '无' }}</div>
      </div>
      <div class="absolute right-0">
        <span v-if="showStateStr" class="text-xs text-[#898989]">{{ stateStr }}</span>
        <span v-if="showGreeting" class="text-xs text-[#418AE5]">打招呼</span>
        <van-button v-if="showActionBtn" size="small" plain hairline type="primary" @click.stop="acceptApplication">同意
        </van-button>
      </div>
      <div v-if="!noBorder" class="h-[1px] w-full bg-[#F1F1F1] absolute -bottom-3" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { feedbackToast } from "@/utils/common";
import { IMSDK } from "@/utils/imCommon";
import Avatar from "../Avatar/index.vue";
import { ApplicationItemSource, ApplicationTypeEnum } from "./data";

type ApplicationItemProps = {
  source: Partial<ApplicationItemSource>;
  type: ApplicationTypeEnum;
  iconSize?: number;
  index?: number;
  total?: number;
};

const recivedTypes = [
  ApplicationTypeEnum.RecivedFriendApplication,
  ApplicationTypeEnum.RecivedGroupApplication,
];

const props = withDefaults(defineProps<ApplicationItemProps>(), {
  iconSize: 42,
});

const accessLoading = ref(false)


const noBorder = computed(() => {
  if (props.index !== undefined && props.total !== undefined) {
    return props.index === props.total - 1;
  }
  return false;
});

const isGroup = props.type === ApplicationTypeEnum.SentGroupApplication || props.type === ApplicationTypeEnum.RecivedGroupApplication
const showGroupAvatar = props.type === ApplicationTypeEnum.SentGroupApplication

const getTitle = computed(() => {
  switch (props.type) {
    case ApplicationTypeEnum.RecivedFriendApplication:
      return props.source.fromNickname;
    case ApplicationTypeEnum.SentFriendApplication:
      return props.source.toNickname;
    case ApplicationTypeEnum.RecivedGroupApplication:
      return props.source.nickname;
    case ApplicationTypeEnum.SentGroupApplication:
      return props.source.groupName;
    default:
      return "";
  }
});

const getIcon = computed(() => {
  switch (props.type) {
    case ApplicationTypeEnum.RecivedFriendApplication:
      return props.source.fromFaceURL;
    case ApplicationTypeEnum.SentFriendApplication:
      return props.source.toFaceURL;
    case ApplicationTypeEnum.RecivedGroupApplication:
      return props.source.userFaceURL;
    case ApplicationTypeEnum.SentGroupApplication:
      return props.source.groupFaceURL;
    default:
      return "";
  }
});

const showGreeting = computed(
  () => !isGroup && props.source.handleResult === 1
);

const isRecv = recivedTypes.includes(props.type)

const showStateStr = computed(() => {
  if (
    (isRecv && props.source.handleResult === 0) ||
    showGreeting.value
  ) {
    return false;
  }
  return true;
});

const showActionBtn = computed(() => props.source.handleResult === 0 && isRecv)

const stateStr = computed(() => {
  if (props.source.handleResult === 1) {
    return "已同意";
  }
  if (props.source.handleResult === -1) {
    return "已拒绝";
  }
  return "处理中";
});

const acceptApplication = () => {
  accessLoading.value = true
  const funcName = isGroup ? 'acceptGroupApplication' : 'acceptFriendApplication';
  IMSDK[funcName]({
    groupID: props.source.groupID!,
    fromUserID: props.source.userID!,
    toUserID: props.source.fromUserID!,
    handleMsg: ''
  }).catch((error) => feedbackToast({ error }))
    .finally(() => accessLoading.value = false)
}

</script>

<style lang="scss" scoped></style>
