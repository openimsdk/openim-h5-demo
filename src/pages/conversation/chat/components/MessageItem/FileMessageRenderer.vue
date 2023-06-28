<template>
  <div class="flex justify-center items-center need_bg">
		<div @click="toPreviewFile" class="flex flex-col mr-3 max-w-[180px]">
			<text class="truncate">{{message.fileElem.fileName}}</text>
			<text class="text-xs text-[#999]">{{fileSizeStr}}</text>
		</div>
		<img class="w-[22px] h-[28px]" :src="file_icon" alt=""/>
	</div>
</template>

<script setup lang='ts'>

import { bytesToSize } from '@/utils/common';
import file_icon from '@assets/images/chating_message_file.png'
import { ExedMessageItem } from './data';

type FileMessageRendererProps = {
    message: ExedMessageItem;
	disabled: boolean;
}

const props = defineProps<FileMessageRendererProps>();
const router = useRouter()

const fileSizeStr = bytesToSize(props.message.fileElem.fileSize)

const toPreviewFile = () => {
	if(props.disabled){
        return;
    }
	router.push({
		path: 'previewFile',
		state: {
			message: JSON.stringify(props.message)
		}
	})
}

</script>

<style lang='scss' scoped>

</style>