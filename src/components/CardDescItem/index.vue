<template>
  <div class="flex items-center px-[22px] py-4 bg-white" :class="{'justify-between':arrow}">
		<div class="w-24 min-w-[96px] mr-3">
			<text>{{lable}}</text>
		</div>
		<div class="max-w-[160px] truncate">
			<text>{{content}}</text>
		</div>
		<slot>
            <van-icon  v-if="arrow" name="arrow" color="#999" size="20" />
		</slot>
	</div>
</template>

<script setup lang='ts'>

type CardDescItemProps = {
    arrow?: boolean;
    lable: string;
    content?: string;
}
const props = defineProps<CardDescItemProps>();

</script>

<style lang='scss' scoped>

</style>