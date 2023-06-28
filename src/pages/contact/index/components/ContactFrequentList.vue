<template>
  <div class="py-2 ml-[22px] text-[#999] text-xs">
    常用联系人
  </div>
  <virtual-list class="my_scrollbar flex-1 overflow-y-auto bg-white" :data-key="'userID'" :data-sources="dataSource"
    :data-component="GenericListItem" :estimate-size="88" :extra-props="{
      total: dataSource.length
    }" />
</template>

<script setup lang='ts'>
import VirtualList from '@components/VirtualList';
import GenericListItem from '@/components/GenericListItem/index.vue';
import { PublicUserItem } from 'open-im-sdk-wasm/lib/types/entity';

const dataSource = ref<PublicUserItem[]>([])

</script>

<style lang='scss' scoped></style>