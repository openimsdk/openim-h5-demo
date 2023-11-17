<template>
  <div class="flex items-center pl-5 pr-3 py-2 bg-white justify-between">
    <div class="w-20 min-w-[200px] h-8 mr-3 flex items-center">
      <text :class="{ 'text-error-text': danger }">{{ lable }}</text>
    </div>
    <div class="flex items-center">
      <slot>
        <span class="max-w-[160px] truncate">{{ content }}</span>
      </slot>
      <img v-if="arrow" class="w-[24px] h-[24px] ml-1" :src="back" />
    </div>
  </div>
</template>
  
<script setup lang='ts'>
import back from '@assets/images/profile/back.png'

type DetailInfoItemProps = {
  lable: string;
  content?: string;
  arrow?: boolean;
  danger?: boolean;
}
const props = defineProps<DetailInfoItemProps>();

</script>
  
<style lang='scss' scoped></style>