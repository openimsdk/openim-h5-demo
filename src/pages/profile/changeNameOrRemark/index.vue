<template>
  <div class="page_container !bg-white">
    <NavBar :title="title">
      <span :disabled="!value && !friendInfo" @click="saveChange">{{
        t('buttons.save')
      }}</span>
    </NavBar>

    <div class="mx-6 mt-10">
      <div class="rounded-lg border border-gap-text">
        <van-field
          class="!py-1"
          v-model="value"
          :maxlength="16"
          label=""
          :placeholder="$t('placeholder.pleaseInput')"
        ></van-field>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar/index.vue'
import { updateBusinessInfo } from '@/api/user'
import useUserStore from '@/store/modules/user'
import { feedbackToast } from '@/utils/common'
import { IMSDK } from '@/utils/imCommon'
import type { FriendUserItem } from '@openim/wasm-client-sdk/lib/types/entity'

const props = defineProps<{ friendInfo?: FriendUserItem }>()

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()

const value = ref(
  props.friendInfo ? props.friendInfo?.remark : userStore.storeSelfInfo.nickname,
)
const title = props.friendInfo ? t('remark') : t('updateNickName')

const saveChange = () => {
  let func
  if (props.friendInfo) {
    func = IMSDK.setFriendRemark({
      toUserID: props.friendInfo.userID,
      remark: value.value,
    })
  } else {
    func = updateBusinessInfo({
      nickname: value.value,
      userID: userStore.storeSelfInfo.userID,
    })
  }
  func
    .then(() => {
      userStore.getSelfInfoFromReq()
      feedbackToast({ message: t('messageTip.nomalSuccess'), onClose: router.back })
    })
    .catch((error) => feedbackToast({ message: t('messageTip.nomalFailed'), error }))
}
</script>

<style lang="scss" scoped></style>
