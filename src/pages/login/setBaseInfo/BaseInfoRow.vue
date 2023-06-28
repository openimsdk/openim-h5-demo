<template>
    <div class="flex justify-between items-center py-3 border-b border-b-[#D8D8D8]">
        <div>{{title}}</div>
        <div class="flex items-center">
            <slot></slot>
            <van-icon name="arrow" />
        </div>
    </div>
</template>

<script setup lang='ts'>

interface BaseInfoRowProps {
    title: string;
}

const emit = defineEmits([]);
const props = defineProps<BaseInfoRowProps>();

</script>

<style lang='scss' scoped>

</style>