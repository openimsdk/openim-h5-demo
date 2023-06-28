<template>
    <van-empty class="mt-[10vh]" :image="common_empty" image-size="80" :description="description" />
</template>

<script setup lang='ts'>
import common_empty from '@assets/images/common_empty.png'

type CommonEmptyProps = {
    description?: string;
    image?: string;
}

withDefaults(defineProps<CommonEmptyProps>(), {
    description: "暂无数据",
    image: common_empty
})


</script>

<style lang='scss' scoped>

</style>