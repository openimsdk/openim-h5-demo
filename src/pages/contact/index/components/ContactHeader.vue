<template>
  <div class="flex items-center justify-between bg-white px-[22px] py-1">
    <span class="text-[22px] font-semibold">{{ $t('contact') }}</span>
    <div class="flex flex-row">
      <img
        class="mr-2 h-7 w-7"
        :src="search"
        @click="$router.push('globalSearch')"
        alt="search"
      />
      <img class="h-7 w-7" :src="add" @click="$router.push('contactAdd')" alt="add" />
    </div>
  </div>
</template>

<script setup lang="ts">
import add from '@/assets/images/contact/add.png'
import search from '@/assets/images/contact/search.png'
</script>

<style lang="scss" scoped></style>
