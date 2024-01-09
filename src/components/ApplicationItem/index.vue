<template>
  <div class="px-[22px] py-3 flex items-start border-b border-b-gap-text">
    <Avatar :src="getIcon" :size="iconSize" :is-group="showGroupAvatar" />
    <div class="flex justify-between items-center w-full h-full ml-4 relative">
      <div>
        <div>{{ getTitle }}</div>
        <div v-if="isGroup" class="flex flex-col text-xs text-[#666]">
          <div class="my-1">
            <span>{{ $t('applyJoin') }}</span>
            <span class="text-primary ml-1">{{ source.groupName }}</span>
          </div>
          <div>{{ $t('groupApplyDesc') }}{{ source.reqMsg || '' }}</div>
        </div>
        <div v-else class="text-[#999] text-[13px]">{{ source.reqMsg || '' }}</div>
      </div>
      <div>
        <span v-if="!showActionBtn" class="text-xs text-[#898989]">{{ stateStr }}</span>
        <van-button v-else size="small" hairline type="primary" @click="toDetails">{{ $t('buttons.toDetail') }}</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from "../Avatar/index.vue";
import { ApplicationItemSource, ApplicationTypeEnum } from "./data";

type ApplicationItemProps = {
  source: Partial<ApplicationItemSource>;
  type: ApplicationTypeEnum;
  iconSize?: number;
  index?: number;
  total?: number;
};

const { t } = useI18n()
const router = useRouter();
const props = withDefaults(defineProps<ApplicationItemProps>(), {
  iconSize: 42,
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

const showActionBtn = computed(() => props.source.handleResult === 0)

const stateStr = computed(() => {
  if (props.source.handleResult === 1) {
    return t('approved');
  }
  if (props.source.handleResult === -1) {
    return t('rejected');
  }
});

const toDetails = () => {
  router.push({
    path: 'applicationDetails',
    query: {
      application: JSON.stringify(props.source),
      type: props.type
    }
  })
}

</script>

<style lang="scss" scoped></style>
