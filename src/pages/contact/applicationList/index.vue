<template>
  <div class="page_container">
    <NavBar :title="applicationTitle" />
    <virtual-list class="my_scrollbar overflow-y-auto flex-1 bg-white" :data-key="'toUserID'" :data-sources="renderData"
      :data-component="ApplicationItem" :estimate-size="88" :extra-props="{
        total: renderData.length,
        type: Number(route.query.type),
      }" />
  </div>
</template>

<script setup lang="ts">
import VirtualList from '@components/VirtualList';
import ApplicationItem from "@/components/ApplicationItem/index.vue";
import { ApplicationTypeEnum } from "@/components/ApplicationItem/data";
import useContactStore from '@/store/modules/contact';

const { t } = useI18n();
const route = useRoute();
const contactStore = useContactStore();

const renderData = computed(() => {
  switch (Number(route.query.type)) {
    case ApplicationTypeEnum.RecivedFriendApplication:
      return contactStore.storeRecvFriendApplicationList.sort((a, b) => (a.handleResult === 0 ? -1 : 1))
    case ApplicationTypeEnum.SentFriendApplication:
      return contactStore.storeSendFriendApplicationList.sort((a, b) => (a.handleResult === 0 ? -1 : 1))
    case ApplicationTypeEnum.RecivedGroupApplication:
      return contactStore.storeRecvGroupApplicationList.sort((a, b) => (a.handleResult === 0 ? -1 : 1))
    case ApplicationTypeEnum.SentGroupApplication:
      return contactStore.storeSendGroupApplicationList.sort((a, b) => (a.handleResult === 0 ? -1 : 1))
    default:
      return [];
  }
})

const applicationTitle = computed(() => {
  if (
    Number(route.query.type) === ApplicationTypeEnum.RecivedFriendApplication
  ) {
    return t('contactMenu.newFriends');
  }
  if (
    Number(route.query.type) === ApplicationTypeEnum.RecivedGroupApplication
  ) {
    return t('contactMenu.applyGroup');
  }
  return t("contactMenu.myApply");
});
</script>

<style lang="scss" scoped></style>
