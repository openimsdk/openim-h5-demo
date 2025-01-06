<template>
  <div class="page_container">
    <NavBar :title="isGroup ? $t('groupVerificationDesc') : $t('friendVerification')">
      <span class="px-2" @click="sendApplication">{{ $t('buttons.send') }}</span>
    </NavBar>

    <div class="my-2 pl-[22px] text-sm text-[#999]">
      {{ $t('buttons.sendVerification') }}
    </div>
    <div class="bg-white">
      <van-field
        v-model="reqMessage"
        :autosize="{ minHeight: 112 }"
        type="textarea"
        maxlength="20"
        show-word-limit
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar/index.vue'
import useConversationToggle from '@/hooks/useConversationToggle'
import { feedbackToast } from '@/utils/common'
import { IMSDK } from '@/utils/imCommon'
import { GroupJoinSource, SessionType } from '@openim/wasm-client-sdk'

type SendApplicationProps = {
  isGroup: Boolean
  sourceID: string
  isScan: Boolean
  notNeedVerification: Boolean
  sessionType: SessionType
}

const { t } = useI18n()
const router = useRouter()
const props = defineProps<SendApplicationProps>()

const { toSpecifiedConversation } = useConversationToggle()

const reqMessage = ref('')
const loading = ref(false)

const sendApplication = () => {
  loading.value = true
  let func
  if (props.isGroup) {
    func = IMSDK.joinGroup({
      groupID: props.sourceID,
      reqMsg: reqMessage.value,
      joinSource: props.isScan ? GroupJoinSource.QrCode : GroupJoinSource.Search,
    })
  } else {
    func = IMSDK.addFriend({
      toUserID: props.sourceID,
      reqMsg: reqMessage.value,
    })
  }
  func
    .then(() => {
      feedbackToast({
        message: props.notNeedVerification
          ? t('messageTip.joinedGroup')
          : t('messageTip.sendSuccess'),
      })
      setTimeout(() => {
        if (props.notNeedVerification) {
          toSpecifiedConversation({
            sourceID: props.sourceID,
            sessionType: props.sessionType,
          })
        } else {
          router.back()
        }
      }, 1000)
    })
    .catch((error) => feedbackToast({ message: t('messageTip.sendFailed'), error }))
    .finally(() => (loading.value = false))
}
</script>

<style lang="scss" scoped></style>
