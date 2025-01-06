<template>
  <div class="relative h-full">
    <div class="absolute left-3 right-3 top-3 z-10 flex justify-between text-2xl">
      <van-icon name="arrow-left" @click="$router.back" />
      <van-button type="primary" size="mini" @click="sendLocation">{{
        $t('buttons.send')
      }}</van-button>
    </div>
    <el-amap :center="center" :zoom="12" @init="init" />
  </div>
</template>

<script setup lang="ts">
import useSendMessage from '@/hooks/useSendMessage'
import { ExMessageItem } from '@/store/modules/message'
import { IMSDK } from '@/utils/imCommon'

const center = [history.state.lng, history.state.lat]

const { t } = useI18n()
const router = useRouter()
const { sendMessage } = useSendMessage()

const init = (e: any) => {
  // @ts-ignore
  const marker = new AMap.Marker({
    position: center,
  })
  e.add(marker)
}

const sendLocation = () => {
  const options = {
    name: t('myLocation'),
    latng: `${center[1]},${center[0]}`,
    addr: '',
    city: '',
    module: 'locationPicker',
    latitude: center[1],
    longitude: center[0],
    url: `https://restapi.amap.com/v3/staticmap?size=600*300&markers=-1,https://cache.amap.com/lbs/static/cuntom_marker1.png,0:${center[0]},${center[1]}&key=${process.env.AMAP_SNAP_KEY}`,
  }
  IMSDK.createLocationMessage({
    description: JSON.stringify(options),
    longitude: center[0],
    latitude: center[1],
  }).then(({ data }) => {
    sendMessage({ message: data as ExMessageItem })
    router.back()
  })
}
</script>

<style lang="scss" scoped></style>
