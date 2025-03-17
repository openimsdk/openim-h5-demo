<template>
  <div class="flex h-[66px] items-center bg-white px-[22px]">
    <Avatar :src="icon" :size="42" />
    <div class="ml-4 flex h-full w-full items-center justify-between">
      <div>{{ title }}</div>
      <div class="flex items-center">
        <van-badge class="mr-1" :content="badge" :show-zero="false" max="99" />
        <van-icon size="16" name="arrow" color="#999" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from '@/components/Avatar/index.vue'

type ContactMenuProps = {
  icon: string
  title: string
  badge?: number
}

const props = defineProps<ContactMenuProps>()
</script>

<style lang="scss" scoped>
:deep(.van-badge--top-right) {
  transform: translate(0, 0);
}
</style>
