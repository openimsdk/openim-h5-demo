<template>
    <div
        class="flex items-center px-[22px] py-4 bg-white justify-between border-b border-b-[rgba(153,153,153,0.2)] last:border-0">
        <div class="w-24 min-w-[96px] mr-3">
            <text>{{lable}}</text>
        </div>
        <div class="flex items-center">
            <slot>
                <span class="max-w-[160px] truncate text-[#999]">{{content}}</span>
            </slot>
            <van-icon v-if="arrow" class="ml-2" name="arrow" color="#999" size="16" />
        </div>
    </div>
</template>
  
<script setup lang='ts'>

type DetailInfoItemProps = {
    lable: string;
    content?: string;
    arrow?: boolean;
}
const props = defineProps<DetailInfoItemProps>();

</script>
  
<style lang='scss' scoped>

</style>