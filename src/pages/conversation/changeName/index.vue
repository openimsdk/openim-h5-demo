<template>
  <div class="page_container !bg-white">
    <NavBar :title="title">
      <span :disabled="!name" @click="finishChange">{{ t('buttons.save') }}</span>
    </NavBar>

    <div class="mx-3 mt-2">
      <div class="rounded-lg border border-gap-text">
        <van-field
          class="!py-1"
          :maxlength="16"
          v-model="name"
          label=""
          :placeholder="$t('placeholder.pleaseInput')"
        ></van-field>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar/index.vue'
import type {
  GroupItem,
  GroupMemberItem,
} from '@openim/wasm-client-sdk/lib/types/entity'
import { IMSDK } from '@/utils/imCommon'
import { feedbackToast } from '@/utils/common'

const { t } = useI18n()
const router = useRouter()
const props = defineProps<{ originData: GroupItem & GroupMemberItem }>()

const name = ref(props.originData.nickname || props.originData.groupName)

const title = props.originData.groupName
  ? t('changeGroupName')
  : t('changeGroupNickname')

const finishChange = () => {
  let func
  if (props.originData.groupName) {
    func = IMSDK.setGroupInfo({
      groupID: props.originData.groupID,
      groupName: name.value,
    })
  } else {
    func = IMSDK.setGroupMemberInfo({
      groupID: props.originData.groupID,
      userID: props.originData.userID,
      nickname: name.value,
    })
  }
  func
    .then(() =>
      feedbackToast({ message: t('messageTip.changeSuccess'), onClose: router.back }),
    )
    .catch((error) => feedbackToast({ message: t('messageTip.changeFailed'), error }))
}
</script>

<style lang="scss" scoped></style>
