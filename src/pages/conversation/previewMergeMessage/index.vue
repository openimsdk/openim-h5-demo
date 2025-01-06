<template>
  <div class="page_container">
    <NavBar :title="mergeData.title" />
    <div class="pt-4 pb-1 text-center text-xs text-[#999]">{{ messageTimeLine }}</div>
    <div class="flex-1 overflow-y-auto">
      <NomalMessageItem
        v-for="(message, idx) in mergeData.multiMessage"
        :key="message.clientMsgID"
        :source="message"
        @click="clickMessageItem(message)"
        :noBorder="idx === mergeData.multiMessage.length - 1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar/index.vue'
import dayjs from 'dayjs'
import type {
  MergeElem,
  MessageItem,
  PublicUserItem,
} from '@openim/wasm-client-sdk/lib/types/entity'
import { MessageType } from '@openim/wasm-client-sdk'
import { showImagePreview } from 'vant'
import { onBeforeRouteUpdate } from 'vue-router'
import NomalMessageItem from './NomalMessageItem.vue'
import useContactStore from '@/store/modules/contact'

const router = useRouter()
const contactStore = useContactStore()

const mergeData = ref(JSON.parse(history.state.mergeData) as MergeElem)

const startTime = mergeData.value.multiMessage[0].sendTime
const endTime =
  mergeData.value.multiMessage[mergeData.value.multiMessage.length - 1].sendTime
const messageTimeLine = dayjs(startTime).isSame(endTime, 'day')
  ? dayjs(startTime).format('YYYY/M/D')
  : `${dayjs(startTime).format('YYYY/M.D')}-${dayjs(endTime).format('YYYY/M/D')}`

onBeforeRouteUpdate((to, from, next) => {
  setTimeout(() => {
    mergeData.value = JSON.parse(history.state.mergeData)
  })
  next()
})

const clickMessageItem = (message: MessageItem) => {
  if (message.contentType === MessageType.VideoMessage) {
    router.push({
      path: '/previewVideo',
      query: {
        url: message.videoElem?.videoUrl,
        poster: message.videoElem?.snapshotUrl,
      },
    })
  }
  if (message.contentType === MessageType.PictureMessage) {
    showImagePreview({
      images: [message.pictureElem?.sourcePicture.url!],
      loop: false,
    })
  }
  if (message.contentType === MessageType.CardMessage) {
    let cardData = {} as PublicUserItem
    try {
      cardData = JSON.parse(message.content)
    } catch (error) {
      return
    }
    contactStore.getUserCardData(cardData.userID)
  }
  if (message.contentType === MessageType.MergeMessage) {
    router.push({
      path: '/previewMergeMessage/' + Date.now(),
      state: {
        mergeData: JSON.stringify(message.mergeElem),
      },
    })
  }
}
</script>

<style lang="scss" scoped>
.page_container {
  background: #f8f9fa;
}
</style>
