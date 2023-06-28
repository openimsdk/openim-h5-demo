<template>
  <div class="page_container">
        <NavBar :title="'关于我们'" />

        <div class="flex flex-col items-center py-6 bg-white mt-3">
            <img width="72" :src="about_logo" alt=""/>
            <div>OpenIM H5</div>
        </div>
  </div>
</template>

<script setup lang='ts'>
import about_logo from '@assets/images/about_logo.png'

</script>

<style lang='scss' scoped>

</style>