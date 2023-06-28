<template>
  <div class="page_container">
    <NavBar title="新的好友" />
    <van-search background="#fff" placeholder="通过手机号/ID号搜索" />
    <div class="flex-1 overflow-hidden">
      <van-tabs v-model:active="active">
        <van-tab title="好友请求">
          <div class="py-2 px-[22px] text-xs text-[#999]">新的好友请求</div>
          <virtual-list v-if="comptRecvApplications.length>0" class="my_scrollbar overflow-y-auto bg-white"
            :data-key="'fromUserID'" :data-sources="comptRecvApplications.slice(0,3)" :data-component="ApplicationItem"
            :estimate-size="88" :extra-props="{
              total: comptRecvApplications.length,
              type: ApplicationTypeEnum.RecivedFriendApplication,
            }" />
          <CommonEmpty v-else />
          <div v-if="comptRecvApplications.length>3" class="mt-3">
            <van-button class="w-full !text-[#1D6BED] !border-0" plain type="default" text="查看全部申请"
              @click="toAll(ApplicationTypeEnum.RecivedFriendApplication)" />
          </div>

        </van-tab>
        <van-tab title="我的请求">
          <div class="py-2 px-[22px] text-xs text-[#999]">我的好友请求</div>
          <virtual-list v-if="comptSentApplications.length>0" class="my_scrollbar overflow-y-auto bg-white"
            :data-key="'toUserID'" :data-sources="comptSentApplications.slice(0,3)" :data-component="ApplicationItem"
            :estimate-size="88" :extra-props="{
              total: comptSentApplications.length,
              type: ApplicationTypeEnum.SentFriendApplication,
            }" />
          <CommonEmpty v-else />
          <div v-if="comptSentApplications.length>3" class="mt-3">
            <van-button class="w-full !text-[#1D6BED] !border-0" plain type="default" text="查看全部申请"
              @click="toAll(ApplicationTypeEnum.SentFriendApplication)" />
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import VirtualList from '@components/VirtualList';
import ApplicationItem from "@/components/ApplicationItem/index.vue";
import { ApplicationTypeEnum } from "@/components/ApplicationItem/data";
import useContactStore from '@/store/modules/contact';
import CommonEmpty from '@/components/CommonEmpty/index.vue';

const router = useRouter();
const contactStore = useContactStore();

const comptRecvApplications = computed(() => contactStore.storeRecvFriendApplicationList.sort((a, b) => (a.handleResult === 0 ? -1 : 1)).slice(0, 4))
const comptSentApplications = computed(() => contactStore.storeSendFriendApplicationList.sort((a, b) => (a.handleResult === 0 ? -1 : 1)).slice(0, 4))

const active = ref(0);

const toAll = (type: ApplicationTypeEnum) => {
  router.push({
    path: '/applicationList',
    query: {
      type
    }
  })
}

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
