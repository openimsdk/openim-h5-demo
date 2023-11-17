<template>
  <van-nav-bar :title="title" placeholder fixed left-arrow :clickable="false" :border="false" @click-left="back">
    <template #left>
      <slot name="left">
        <img class="h-[23px] min-w-[23px] mr-4" :src="arrows_left" alt="" />
      </slot>
    </template>

    <template #right>
      <slot></slot>
    </template>
  </van-nav-bar>
</template>

<script setup lang='ts'>
import arrows_left from '@/assets/images/chatHeader/arrows_left.png'

type NavBarProps = {
  title?: string;
  router?: boolean;
}

type NavBarEmits = {
  (event: 'leftClick'): void;
}

const emit = defineEmits<NavBarEmits>();
const props = withDefaults(defineProps<NavBarProps>(), {
  router: true
})

const router = useRouter();

const back = () => {
  if (props.router) {
    router.back();
  } else {
    emit('leftClick')
  }
}

</script>

<style lang='scss' scoped></style>