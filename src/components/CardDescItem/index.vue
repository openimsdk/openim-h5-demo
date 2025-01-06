<template>
  <div
    class="flex items-center bg-white px-[22px] py-2"
    :class="{ 'justify-between': arrow }"
  >
    <div class="mr-3 flex h-8 w-20 min-w-[180px] items-center">
      <text :class="{ 'text-sub-text': content }">{{ lable }}</text>
    </div>
    <div class="flex max-w-[160px] items-center truncate">
      <text>{{ content }}</text>
    </div>
    <slot>
      <van-icon v-if="arrow" name="arrow" color="#999" size="20" />
    </slot>
  </div>
</template>

<script setup lang="ts">
type CardDescItemProps = {
  arrow?: boolean
  lable: string
  content?: string
}
const props = defineProps<CardDescItemProps>()
</script>

<style lang="scss" scoped></style>
