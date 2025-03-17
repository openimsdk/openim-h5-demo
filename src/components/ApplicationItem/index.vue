<template>
  <div class="flex items-start border-b border-b-gap-text px-[22px] py-3">
    <Avatar
      :src="getIcon"
      :size="iconSize"
      :is-group="isGroup"
      :desc="source.toNickname"
    />
    <div class="relative ml-4 flex h-full w-full items-center justify-between">
      <div>
        <div>{{ getTitle }}</div>
        <div v-if="isGroup" class="flex flex-col text-xs text-[#666]">
          <div class="my-1">
            <span>{{ $t('applyJoin') }}</span>
            <span class="ml-1 text-primary">{{ source.groupName }}</span>
          </div>
          <div>{{ $t('groupApplyDesc') }}{{ source.reqMsg || '' }}</div>
        </div>
        <div v-else class="text-[13px] text-[#999]">
          {{ source.reqMsg || '&nbsp;' }}
        </div>
      </div>
      <div class="flex items-center">
        <img v-if="isSend" class="h-5 w-5" :src="send" alt="" />
        <span v-if="!showActionBtn" class="text-xs text-[#898989]">{{ stateStr }}</span>
        <van-button v-else size="small" hairline type="primary" @click="toDetails">{{
          $t('buttons.toDetail')
        }}</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from '../Avatar/index.vue'
import send from '@assets/images/contact/send.png'
import { ApplicationItemSource, ApplicationTypeEnum } from './data'

type ApplicationItemProps = {
  source: Partial<ApplicationItemSource>
  type: ApplicationTypeEnum
  iconSize?: number
  index?: number
  total?: number
}

const { t } = useI18n()
const router = useRouter()
const props = withDefaults(defineProps<ApplicationItemProps>(), {
  iconSize: 42,
})

const isSend =
  props.type === ApplicationTypeEnum.SentFriendApplication ||
  props.type === ApplicationTypeEnum.SentGroupApplication
const isGroup =
  props.type === ApplicationTypeEnum.SentGroupApplication ||
  props.type === ApplicationTypeEnum.RecivedGroupApplication

const getTitle = computed(() => {
  switch (props.type) {
    case ApplicationTypeEnum.RecivedFriendApplication:
      return props.source.fromNickname
    case ApplicationTypeEnum.SentFriendApplication:
      return props.source.toNickname
    case ApplicationTypeEnum.RecivedGroupApplication:
      return props.source.nickname
    case ApplicationTypeEnum.SentGroupApplication:
      return props.source.groupName
    default:
      return ''
  }
})

const getIcon = computed(() => {
  switch (props.type) {
    case ApplicationTypeEnum.RecivedFriendApplication:
      return props.source.fromFaceURL
    case ApplicationTypeEnum.SentFriendApplication:
      return props.source.toFaceURL
    case ApplicationTypeEnum.RecivedGroupApplication:
      return props.source.userFaceURL
    case ApplicationTypeEnum.SentGroupApplication:
      return props.source.groupFaceURL
    default:
      return ''
  }
})

const showActionBtn = computed(() => {
  return (
    props.source.handleResult === 0 &&
    (props.type === ApplicationTypeEnum.RecivedFriendApplication ||
      props.type === ApplicationTypeEnum.RecivedGroupApplication)
  )
})

const stateStr = computed(() => {
  if (props.source.handleResult === 1) {
    return t('buttons.approved')
  }
  if (props.source.handleResult === -1) {
    return t('buttons.rejected')
  }
  return t('buttons.pending')
})

const toDetails = () => {
  router.push({
    path: 'applicationDetails',
    query: {
      application: JSON.stringify(props.source),
      type: props.type,
    },
  })
}
</script>

<style lang="scss" scoped></style>
