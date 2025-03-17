<template>
  <div class="page_container">
    <NavBar :title="$t('contactMenu.myGoodFriend')" />
    <div
      v-if="newList.length > 0"
      class="relative flex-1 overflow-y-auto overflow-x-hidden"
    >
      <AlphabetIndex :newList="newList" @scrollToIndex="scrollToIndex" />
      <virtual-list
        ref="vsl"
        class="my_scrollbar h-full overflow-y-auto"
        :data-key="'userID'"
        :data-sources="newList"
        :data-component="
          (item: FriendUserItem | IndexItem) =>
            (item as IndexItem).title === undefined ? GenericListItem : LetterSection
        "
        :estimate-size="88"
        :extra-props="
          (item: FriendUserItem) => ({
            onClick: () => toUserCard(item),
            letterStr: (item as unknown as IndexItem).title,
          })
        "
      />
    </div>
    <CommonEmpty v-else />
  </div>
</template>

<script setup lang="ts">
import useContactStore from '@/store/modules/contact'
import { formatContacts } from '@/utils/common'
import CommonEmpty from '@/components/CommonEmpty/index.vue'
import VirtualList from '@components/VirtualList'
import AlphabetIndex from './AlphabetIndex.vue'
import LetterSection from './LetterSection.vue'
import type { FriendUserItem } from '@openim/wasm-client-sdk/lib/types/entity'
import GenericListItem from '@/components/GenericListItem/index.vue'

type IndexItem = {
  title: string
  userID: string
}

const vsl = ref()
const contactStore = useContactStore()

const renderList = computed(() => formatContacts(contactStore.storeFriendList))

const newList: (FriendUserItem | IndexItem)[] = []

renderList.value.indexList.map((_, i) => {
  newList.push({
    title: renderList.value.indexList[i],
    userID: renderList.value.indexList[i],
  })
  newList.push(...renderList.value.dataList[i])
})

const toUserCard = (friend: FriendUserItem) => {
  contactStore.setUserCardData({
    baseInfo: friend,
  })
}

const scrollToIndex = (index: number) => {
  vsl.value.scrollToIndex(index)
}
</script>

<style lang="scss" scoped>
:deep(.van-index-anchor--sticky) {
  transform: translate3d(0px, 103px, 0px) !important;
}
</style>
