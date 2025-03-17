<template>
  <div class="page_container">
    <NavBar :title="$t('profileMenu.accountSetting')" />
    <div class="mx-3 mt-2 overflow-hidden rounded-md">
      <DetailInfoItem
        arrow
        :lable="$t('profileMenu.blacklist')"
        @click="$router.push('blackList')"
      />
      <DetailInfoItem
        arrow
        :lable="$t('profileMenu.language')"
        @click="$router.push('/language')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar/index.vue'
import DetailInfoItem from '@/components/DetailInfoItem/index.vue'
</script>

<style lang="scss" scoped></style>
