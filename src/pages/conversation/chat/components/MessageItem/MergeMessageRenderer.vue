<template>
  <div
    @click="toPreview"
    class="need_bg w-[220px] border border-[#E8EAEF] !bg-white !p-0"
  >
    <div class="border-b border-solid border-b-[#E8EAEF] px-2.5 py-2">
      <span class="break-words">{{ title }}</span>
    </div>
    <div class="flex flex-col px-2.5 pt-0.5 pb-1.5 text-xs text-sub-text">
      <template v-for="(item, idx) in message.mergeElem?.abstractList">
        <text v-if="idx < 4" :key="idx" class="mt-1 break-all line-clamp-3">
          {{ item }}
        </text>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SessionType } from '@openim/wasm-client-sdk'
import { ExedMessageItem } from './data'

type MergeMessageRendererProps = {
  message: ExedMessageItem
  disabled: boolean
}

const props = defineProps<MergeMessageRendererProps>()
const router = useRouter()

const title = computed(() => {
  const sessionType = props.message.mergeElem?.multiMessage[0].sessionType
  if (sessionType === SessionType.Single) {
    return props.message.senderNickname + props.message.mergeElem?.title
  }
  return props.message.mergeElem?.title
})

const toPreview = () => {
  if (props.disabled || !props.message.mergeElem?.multiMessage) {
    return
  }
  router.push({
    path: 'previewMergeMessage/' + Date.now(),
    state: {
      mergeData: JSON.stringify(props.message.mergeElem),
    },
  })
}
</script>

<style lang="scss" scoped></style>
