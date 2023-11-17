<template>
  <div class="flex items-center px-[22px] h-[68px] bg-white">
    <slot>
      <img width="28" :src="icon" alt="" />
    </slot>
    <div class="flex-1 flex items-center justify-between ml-5 h-full border-b border-[#F1F1F1]"
      :class="{ '!border-0': !border }">
      <div>
        <div class="font-medium mb-1">{{ title }}</div>
        <div class="text-xs text-[#999]">{{ subTitle }}</div>
      </div>
      <van-icon name="arrow" color="#999" size="20" />
    </div>
  </div>
</template>

<script setup lang='ts'>

type AddMenuItemProps = {
  icon?: string;
  title: string;
  subTitle: string;
  border?: boolean;
}
const props = defineProps<AddMenuItemProps>();

</script>

<style lang='scss' scoped></style>