<template>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
</template>

<script setup lang="ts">
import useUserStore from "./store/modules/user";

const userStore = useUserStore()

onMounted(() => {
  // window.onbeforeunload = function () {
  //   localStorage.setItem("IMUserID", userStore.getSelfInfo.userID);
  // };
});
</script>

<style lang="scss">

</style>
