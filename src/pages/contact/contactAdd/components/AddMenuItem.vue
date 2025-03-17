<template>
  <div class="flex h-[68px] items-center bg-white px-[22px]">
    <slot>
      <img width="28" :src="icon" alt="" />
    </slot>
    <div
      class="ml-5 flex h-full flex-1 items-center justify-between border-b border-[#F1F1F1]"
      :class="{ '!border-0': !border }"
    >
      <div>
        <div class="mb-1 font-medium">{{ title }}</div>
        <div class="text-xs text-[#999]">{{ subTitle }}</div>
      </div>
      <van-icon name="arrow" color="#999" size="20" />
    </div>
  </div>
</template>

<script setup lang="ts">
type AddMenuItemProps = {
  icon?: string
  title: string
  subTitle: string
  border?: boolean
}
const props = defineProps<AddMenuItemProps>()
</script>

<style lang="scss" scoped></style>
