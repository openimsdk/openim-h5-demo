<template>
  <div class="global_wrap">
    <router-view v-slot="{ Component }">
      <transition>
        <keep-alive include="tabbar,chat,singleSetting,groupSetting">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang='ts'>
import useUserStore from '@/store/modules/user'
import { checkIsSafari } from '@/utils/common';
import emitter from '@/utils/events';

const innerHeight = ref(`${window.visualViewport?.height ?? window.innerHeight}px`)
const userStore = useUserStore();

const resizeHandler = () => {
  innerHeight.value = `${checkIsSafari() ? window.innerHeight : window.visualViewport?.height ?? window.innerHeight}px`
}

onMounted(() => {
  window.addEventListener('resize', resizeHandler)
  emitter.on("KEYBOARD_UPDATE",resizeHandler)
  userStore.getAppConfigFromReq()
})

onUnmounted(()=>{
  window.removeEventListener('resize', resizeHandler)
  emitter.off("KEYBOARD_UPDATE",resizeHandler)
})




</script>

<style lang='scss' scoped>
.global_wrap {
  display: flex;
  flex-direction: column;
  // height: 100vh;
  height: v-bind(innerHeight);
  overflow: hidden;
}
</style>