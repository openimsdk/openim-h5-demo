<template>
  <div
    @click="toUserInfo"
    class="card_message_container w-[220px] border border-[#E8EAEF] !bg-white"
  >
    <div class="card_info">
      <Avatar :src="cardData.faceURL" :desc="cardData.nickname" :size="44" />
      <span class="ml-3 truncate">{{ cardData.nickname }}</span>
    </div>
    <div class="pl-5 text-[#999]">
      <span class="text-xs">{{ $t('contactCard') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from '@/components/Avatar/index.vue'
import type { PublicUserItem } from '@openim/wasm-client-sdk/lib/types/entity'
import { ExedMessageItem } from './data'
import useContactStore from '@/store/modules/contact'

type CardMessageRendererProps = {
  message: ExedMessageItem
  disabled: boolean
}

const router = useRouter()
const contactStore = useContactStore()
const props = defineProps<CardMessageRendererProps>()

const cardData = computed(() => {
  let info = {} as PublicUserItem
  try {
    info = props.message.cardElem!
  } catch (error) {}
  return info
})

const toUserInfo = () => {
  if (props.disabled) {
    return
  }
  contactStore.getUserCardData(cardData.value.userID)
}
</script>

<style lang="scss" scoped>
.card_message_container {
  display: flex;
  flex-direction: column;
  background-color: #fbfbfb;
  // box-shadow: 3px 3px 8px 1px rgba(81, 94, 112, 0.1);
  border-radius: 6px;
  width: 222px;
  border: 1px solid #ececec;

  .card_info {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #e9e9e9;
  }
}
</style>
