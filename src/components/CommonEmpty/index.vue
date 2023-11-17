<template>
  <van-empty class="mt-[10vh]" :image="image" :image-size="size" :description="description ?? $t('noData')" />
</template>

<script setup lang='ts'>
import common_empty from '@assets/images/common_empty.png'

type CommonEmptyProps = {
  description?: string;
  image?: string;
  size?: number
}

withDefaults(defineProps<CommonEmptyProps>(), {
  image: common_empty,
  size: 120
})

</script>

<style lang='scss' scoped></style>