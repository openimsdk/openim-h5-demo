<template>
  <div
    class="flex h-[64px] w-[220px] items-center justify-center rounded-md border border-[#E8EAEF] !bg-white"
  >
    <div @click="toPreviewFile" class="mr-3 flex max-w-[140px] flex-1 flex-col">
      <text class="truncate">{{ message.fileElem?.fileName }}</text>
      <text class="text-xs text-[#999]">{{ fileSizeStr }}</text>
    </div>
    <img
      class="h-[44px] w-[38px]"
      :src="getFileIcon(message.fileElem?.fileName as string)"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import { bytesToSize, downloadFile, getFileIcon } from '@/utils/common'
import { ExedMessageItem } from './data'

type FileMessageRendererProps = {
  message: ExedMessageItem
  disabled: boolean
}

const props = defineProps<FileMessageRendererProps>()

const fileSizeStr = bytesToSize(props.message.fileElem?.fileSize!)

const toPreviewFile = () => {
  if (props.disabled) {
    return
  }
  downloadFile(props.message.fileElem?.sourceUrl!, props.message.fileElem?.fileName!)
}
</script>

<style lang="scss" scoped></style>
