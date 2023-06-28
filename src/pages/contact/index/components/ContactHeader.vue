<template>
  <div class="px-[22px] py-1 flex justify-between items-center bg-white">
    <span class="text-[22px] text-[#1B72EC]">通讯录</span>
    <div>
        <van-icon class="mr-3" size="24" name="search"/>
        <van-icon size="24" name="add-o" @click="$router.push('contactAdd')" />
    </div>
  </div>
</template>

<script setup lang='ts'>

</script>

<style lang='scss' scoped>

</style>