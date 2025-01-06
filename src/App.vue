<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script setup lang="ts">
import { initializeAudio } from './utils/common'
import { IMSDK } from '@/utils/imCommon'

initializeAudio()

document.addEventListener('contextmenu', function (event) {
  event.preventDefault()
})

document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible') {
    IMSDK.setAppBackgroundStatus(false)
  }
  if (document.visibilityState === 'hidden') {
    IMSDK.setAppBackgroundStatus(true)
  }
})
</script>

<style lang="scss"></style>
