<template>
  <div
    @click="toDetails"
    class="w-[222px] rounded-md border border-solid border-[#e6e6e6] bg-[#fff]"
  >
    <div class="px-3 py-3 text-[#333]">
      <div class="truncate">
        {{ locationData.name }}
      </div>
      <div class="truncate">
        {{ locationData.addr }}
      </div>
    </div>
    <van-image width="222" height="111" fit="contain" :src="locationData.url" />
  </div>
</template>

<script setup lang="ts">
import { ExedMessageItem } from './data'

type LocationMessageRendererProps = {
  message: ExedMessageItem
  disabled: boolean
}

const router = useRouter()
const props = defineProps<LocationMessageRendererProps>()
const locationData = computed(() => {
  let info = {} as any
  try {
    info = JSON.parse(props.message.locationElem?.description!)
  } catch (e) {}
  return info
})

const toDetails = () => {
  if (props.disabled) {
    return
  }

  router.push({
    path: 'previewLocation',
    state: {
      message: JSON.stringify(props.message),
    },
  })
}
</script>

<style lang="scss" scoped></style>
