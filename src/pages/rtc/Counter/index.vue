<template>
  <span class="text-white">{{ secondsToMS(count) }}</span>
</template>

<script lang="ts" setup>
import { useCounter } from '@vueuse/core'

type CounterProps = {
  isConnected: boolean
}
const props = defineProps<CounterProps>()

const { count, inc } = useCounter()
const timer = ref<NodeJS.Timeout | null>(null)

watch(
  () => props.isConnected,
  (newValue) => {
    if (newValue) {
      timer.value = setInterval(() => {
        inc()
      }, 1000)
    }
  },
  {
    immediate: true,
  },
)

const secondsToMS = (duration: number) => {
  let minutes = Math.floor(duration / 60) % 60
  let seconds = (duration % 60).toString()
  minutes = minutes.toString().padStart(2, '0') as unknown as number
  seconds = seconds.length === 1 ? '0' + seconds : seconds
  return `${minutes}:${seconds}`
}

const getTime = () => secondsToMS(count.value)

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})

defineExpose({
  getTime,
})
</script>
