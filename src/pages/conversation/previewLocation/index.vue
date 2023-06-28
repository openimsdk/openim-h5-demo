<template>
  <div class="h-full relative">
    <div class="absolute left-3 top-3 z-10 text-2xl" @click="$router.back"><van-icon name="arrow-left" /></div>
    <el-amap
      :center="center"
      :zoom="12"
      @init="init"
    />
  </div>
</template>

<script setup lang='ts'>
import { LocationElem } from 'open-im-sdk-wasm/lib/types/entity';


const locationData = JSON.parse(history.state.message).locationElem as LocationElem
const center = [locationData.longitude,locationData.latitude]

const init = (e:any) => {
  // @ts-ignore
  const marker = new AMap.Marker({
    position: center
  });
  e.add(marker);
}
</script>

<style lang='scss' scoped>

</style>