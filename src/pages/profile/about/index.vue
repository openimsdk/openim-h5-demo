<template>
  <div class="page_container">
    <NavBar :title="$t('profileMenu.aboutUs')" />

    <div
      class="mx-3 my-2 flex flex-col items-center overflow-hidden rounded-md bg-white py-6"
    >
      <img class="h-[78px] w-[55px]" :src="about_logo" alt="" />
      <div class="mt-3 text-sm">{{ version }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import about_logo from '@assets/images/profile/about_logo.png'

const version = process.env.VERSION
</script>

<style lang="scss" scoped></style>
