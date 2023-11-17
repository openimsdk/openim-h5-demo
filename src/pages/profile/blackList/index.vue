<template>
  <div class="page_container">
    <NavBar :title="$t('profileMenu.blacklist')" />

    <virtual-list v-if="contactStore.storeBlackList.length > 0" class="my_scrollbar flex-1 overflow-y-auto mt-3"
      :data-key="'userID'" :data-sources="contactStore.storeBlackList" :data-component="GenericListItem"
      :estimate-size="88" :extra-props="{
        total: contactStore.storeBlackList.length,
        showRemove: true,
        onRemove: blackRemove
      }" />
    <CommonEmpty v-else />
  </div>
</template>
  
<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import VirtualList from '@components/VirtualList';
import GenericListItem from '@/components/GenericListItem/index.vue';
import { BlackUserItem } from '@/utils/open-im-sdk-wasm/types/entity';
import useContactStore from '@/store/modules/contact';
import CommonEmpty from '@/components/CommonEmpty/index.vue';
import { IMSDK } from '@/utils/imCommon';
import { feedbackToast } from '@/utils/common';

const contactStore = useContactStore();

const blackRemove = ({ userID }: BlackUserItem) => {
  IMSDK.removeBlack(userID).catch((error) => feedbackToast({ error }))
}

</script>
  
<style lang='scss' scoped></style>