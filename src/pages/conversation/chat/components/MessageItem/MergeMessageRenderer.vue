<template>
  <div @click="toPreview" class="need_bg">
		<div class="px-1 py-1 border-b border-solid border-b-[#cdd8e7]">
			<span class="truncate">{{message.mergeElem.title}}</span>
		</div>
		<div class="flex flex-col px-1 py-1 text-xs text-[#666]">
			<text v-for="(item,idx) in message.mergeElem.abstractList" :key="idx" class="line-clamp-2 py-1 break-all">{{item}}</text>
		</div>
	</div>
</template>

<script setup lang='ts'>
import { ExedMessageItem } from './data';

    
type MergeMessageRendererProps = {
    message: ExedMessageItem;
	disabled: boolean;
}

const props = defineProps<MergeMessageRendererProps>();

const toPreview = () => {
	
}

</script>

<style lang='scss' scoped>

</style>