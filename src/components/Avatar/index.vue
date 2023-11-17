<template>
  <van-image class="my_avator" :style="{ 'min-width': `${size}px` }" :width="size" fit="cover" :height="size"
    :radius="radius" :src="getAvatorUrl" @error="errorState = true" />
</template>

<script setup lang='ts'>
import defaultGroupIcon from '@assets/images/contact/my_groups.png'
import { genAvatar } from '@/utils/common';

type AvatarProps = {
  size?: number,
  radius?: number,
  src?: string,
  desc?: string,
  isGroup?: boolean,
  isNotification?: boolean,
}

const emit = defineEmits([]);
const props = withDefaults(defineProps<AvatarProps>(), {
  size: 36,
  radius: 6,
  isGroup: false,
  isNotification: false,
});

const errorState = ref(false)

const getErrorUrl = computed(() => {
  if (props.isGroup) {
    return defaultGroupIcon
  }
  return genAvatar(props.desc ?? "", props.size)
})

const getAvatorUrl = computed(() => {
  if (errorState.value) {
    return getErrorUrl.value
  }

  if (props.isNotification) {
    return props.src
  }

  if (props.isGroup) {
    return props.src || defaultGroupIcon
  }

  if (props.src) {
    return props.src
  }

  return genAvatar(props.desc ?? "", props.size)
})

</script>

<style lang='scss' scoped></style>