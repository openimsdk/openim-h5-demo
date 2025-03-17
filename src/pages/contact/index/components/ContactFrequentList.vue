<template>
  <div class="ml-[22px] py-2 text-xs text-[#999]">
    {{ $t('contactMenu.frequentContacts') }}
  </div>
  <virtual-list
    class="my_scrollbar flex-1 overflow-y-auto bg-white"
    :data-key="'userID'"
    :data-sources="dataSource"
    :data-component="GenericListItem"
    :estimate-size="88"
    :extra-props="{
      total: dataSource.length,
    }"
  />
</template>

<script setup lang="ts">
import VirtualList from '@components/VirtualList'
import GenericListItem from '@/components/GenericListItem/index.vue'
import type { PublicUserItem } from '@openim/wasm-client-sdk/lib/types/entity'
import { getFrequentContacts } from '@/utils/imCommon'

const dataSource = ref<PublicUserItem[]>([])

onActivated(() => {
  dataSource.value = getFrequentContacts()
})
</script>

<style lang="scss" scoped></style>
