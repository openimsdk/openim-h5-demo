<template>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
</template>

<script setup lang="ts">

</script>

<style lang="scss">

</style>
