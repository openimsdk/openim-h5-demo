<template>
  <div class="flex items-center justify-between bg-white py-2 pl-5 pr-3">
    <div class="mr-3 flex h-8 w-20 min-w-[160px] items-center">
      <text :class="{ 'text-error-text': danger }">{{ lable }}</text>
    </div>
    <div class="flex items-center">
      <slot>
        <span class="max-w-[160px] truncate">{{ content }}</span>
      </slot>
      <img v-if="arrow" class="ml-1 h-[24px] w-[24px]" :src="back" />
    </div>
  </div>
</template>

<script setup lang="ts">
import back from '@assets/images/profile/back.png'

type DetailInfoItemProps = {
  lable: string
  content?: string
  arrow?: boolean
  danger?: boolean
}
const props = defineProps<DetailInfoItemProps>()
</script>

<style lang="scss" scoped></style>
