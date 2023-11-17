<template>
  <div class="page_container">
    <NavBar :title="$t('contactMenu.newFriends')" />
    <div class="mt-[10px]">
      <virtual-list v-if="contactStore.storeSendFriendApplicationList.length > 0"
        class="my_scrollbar overflow-y-auto bg-white" :data-key="'toUserID'"
        :data-sources="contactStore.storeSendFriendApplicationList" :data-component="ApplicationItem" :estimate-size="88"
        :extra-props="{
          total: contactStore.storeSendFriendApplicationList.length,
          type: ApplicationTypeEnum.SentFriendApplication,
        }" />
      <virtual-list v-if="contactStore.storeRecvFriendApplicationList.length > 0"
        class="my_scrollbar overflow-y-auto bg-white" :data-key="'toUserID'"
        :data-sources="contactStore.storeRecvFriendApplicationList" :data-component="ApplicationItem" :estimate-size="88"
        :extra-props="{
          total: contactStore.storeRecvFriendApplicationList.length,
          type: ApplicationTypeEnum.RecivedFriendApplication,
        }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import VirtualList from '@components/VirtualList';
import ApplicationItem from "@/components/ApplicationItem/index.vue";
import { ApplicationTypeEnum } from "@/components/ApplicationItem/data";
import useContactStore from '@/store/modules/contact';
import { getAccessedFriendApplication, setAccessedFriendApplication } from '@/utils/storage';

const contactStore = useContactStore();

const storeAccessedApplication = () => {
  const accessedFriendApplications = getAccessedFriendApplication();

  let unHandleFriendApplication = contactStore.storeRecvFriendApplicationList.filter(
    (application) =>
      application.handleResult === 0 &&
      !accessedFriendApplications.includes(
        `${application.fromUserID}_${application.createTime}`
      )
  );
  if (unHandleFriendApplication.length === 0) {
    return;
  }
  unHandleFriendApplication.map(application => {
    accessedFriendApplications.push(
      `${application.fromUserID}_${application.createTime}`
    );
  })
  setAccessedFriendApplication(accessedFriendApplications);
  contactStore.updateUnHandleFriendApplicationNum(0)
}

onMounted(() => {
  storeAccessedApplication()
})

</script>

<style lang="scss" scoped>
:deep(.van-tabs) {
  height: 100%;
  display: flex;
  flex-direction: column;

  .van-tabs__wrap {
    min-height: var(--van-tabs-line-height);
  }

  .van-tabs__content {
    flex: 1;
    overflow: hidden;

    .van-tab__panel {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
