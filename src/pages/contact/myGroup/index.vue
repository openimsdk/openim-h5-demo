<template>
  <div class="page_container">
    <NavBar :title="$t('contactMenu.myGroup')" />
    <van-search background="#fff" :placeholder="$t('placeholder.search')" readonly
      @click-input="$router.push({ path: 'searchFriendOrGroup', state: { isGroup: 'true' } })" />
    <div class="flex-1 overflow-hidden">
      <van-tabs v-model:active="active">
        <van-tab :title="$t('contactMenu.myCreate')">
          <virtual-list v-if="comptGroupList.createdGroup.length > 0" class="my_scrollbar flex-1 overflow-y-auto bg-white"
            :data-key="'groupID'" :data-sources="comptGroupList.createdGroup" :data-component="GenericListItem"
            :estimate-size="88" :extra-props="{
              subKey: 'memberCount',
              total: comptGroupList.createdGroup.length,
              onClickItem: toGroup,
            }" />
          <CommonEmpty v-else />
        </van-tab>
        <van-tab :title="$t('contactMenu.myJoin')">
          <virtual-list v-if="comptGroupList.joinedGroup.length > 0" class="my_scrollbar flex-1 overflow-y-auto bg-white"
            :data-key="'groupID'" :data-sources="comptGroupList.joinedGroup" :data-component="GenericListItem"
            :estimate-size="88" :extra-props="{
              subKey: 'memberCount',
              total: comptGroupList.joinedGroup.length,
              onClickItem: toGroup,
            }" />
          <CommonEmpty v-else />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup lang='ts'>
import VirtualList from '@components/VirtualList';
import GenericListItem from '@/components/GenericListItem/index.vue';
import useContactStore from '@/store/modules/contact';
import useUserStore from '@/store/modules/user';
import { GroupItem } from '@/utils/open-im-sdk-wasm/types/entity';
import useConversationStore from '@/store/modules/conversation';
import CommonEmpty from '@/components/CommonEmpty/index.vue';

const router = useRouter();
const contactStore = useContactStore();
const conversationStore = useConversationStore();
const userStore = useUserStore();

const active = ref(0);

const comptGroupList = computed(() => {
  const createdGroup = [] as GroupItem[]
  const joinedGroup = [] as GroupItem[]
  contactStore.storeGroupList.map(group => {
    group.ownerUserID === userStore.storeSelfInfo.userID ? createdGroup.push(group) : joinedGroup.push(group)
  })
  return {
    createdGroup,
    joinedGroup
  }
})

const toGroup = (group: GroupItem) => {
  conversationStore.updateCurrentGroupInfo(group)
  router.push({
    path: 'groupCard'
  })
}

</script>

<style lang='scss' scoped>
:deep(.van-search) {
  padding: 12px 22px;
}

:deep(.van-tabs__wrap) {
  border-bottom: 1px solid #E8EAEF;
}

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