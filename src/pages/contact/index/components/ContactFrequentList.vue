<template>
  <div class="py-2 ml-[22px] text-[#999] text-xs">
    {{ $t('contactMenu.frequentContacts') }}
  </div>
  <virtual-list class="my_scrollbar flex-1 overflow-y-auto bg-white" :data-key="'userID'" :data-sources="dataSource"
    :data-component="GenericListItem" :estimate-size="88" :extra-props="{
      total: dataSource.length
    }" />
</template>

<script setup lang='ts'>
import VirtualList from '@components/VirtualList';
import GenericListItem from '@/components/GenericListItem/index.vue';
import { PublicUserItem } from '@/utils/open-im-sdk-wasm/types/entity';
import { getFrequentContacts } from '@/utils/imCommon';

const dataSource = ref<PublicUserItem[]>([])

onActivated(() => {
  dataSource.value = getFrequentContacts()
})

</script>

<style lang='scss' scoped></style>