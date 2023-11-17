<template>
  <div class="page_container">
    <NavBar :title="$t('profileMenu.aboutUs')" />

    <div class="flex flex-col items-center pt-6 bg-white mt-2 mx-3 rounded-md overflow-hidden">
      <img class="w-[55px] h-[78px]" :src="about_logo" alt="" />
      <div class="mt-3 text-sm">{{ version }}</div>
      <DetailInfoItem arrow class="mt-3 border-t w-[96%]" :lable="$t('profileMenu.uploadLog')" :content="''" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import DetailInfoItem from "@/components/DetailInfoItem/index.vue";
import about_logo from '@assets/images/profile/about_logo.png'

const version = process.env.VERSION

</script>

<style lang='scss' scoped></style>