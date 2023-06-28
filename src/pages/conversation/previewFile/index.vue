<template>
  <div class="page_container">
    <NavBar title="" />
    <div class="flex-1 flex flex-col justify-between">
      <div class="mt-[20vh] flex flex-col justify-center items-center text-[#333]">
        <img width="56" :src="file_icon" alt="">
        <div class="mt-4 mb-1 text-xl font-medium truncate max-w-[70vw]">{{fileData.fileName}}</div>
        <div class="text-sm">文件大小：{{fileSize}}</div>
      </div>
      <div class="mb-[20vh] text-center text-[#1B72EC]" @click="download">
        下载
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import { bytesToSize, downloadFile } from '@/utils/common';
import file_icon from '@assets/images/preview_file_icon.png'
import { FileElem } from 'open-im-sdk-wasm/lib/types/entity';

const fileData = JSON.parse(history.state.message).fileElem as FileElem
const fileSize = bytesToSize(fileData.fileSize)

const download = () => {
  downloadFile(fileData.sourceUrl,fileData.fileName)
}
</script>

<style lang='scss' scoped>

</style>