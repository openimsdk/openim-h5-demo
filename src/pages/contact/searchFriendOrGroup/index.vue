<template>
  <div class="page_container">
    <NavBar :title="$t('placeholder.search')" />
    <van-search v-model="searchState.keyword" background="#fff" :placeholder="$t('placeholder.search')" autofocus
      @search="onSearch" />
    <div v-show="searchState.dataList.length > 0 && !searchState.loading"
      class="flex-1 overflow-y-auto overflow-x-hidden relative">
      <GenericListItem class="bg-white" v-for="(item, index) in searchState.dataList" :key="item.userID || item.groupID"
        :source="item" :total="searchState.dataList.length" :index="index" @click="itemClick(item)" />
    </div>
    <CommonEmpty :description="$t('messageTip.searchEmpty')"
      v-show="searchState.dataList.length === 0 && !searchState.loading" />
    <div v-show="searchState.loading" class="flex justify-center px-[22px] pt-1 pb-4 bg-white text-[#999]">
      <van-loading size="24" type="spinner" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import GenericListItem from '@/components/GenericListItem/index.vue';
import useContactStore from '@/store/modules/contact';
import { GroupItem, SearchedFriendsInfo } from '@/utils/open-im-sdk-wasm/types/entity';
import CommonEmpty from '@/components/CommonEmpty/index.vue';
import { IMSDK } from '@/utils/imCommon';
import { feedbackToast } from '@/utils/common';
import useConversationStore from '@/store/modules/conversation';

type GroupInfo = {
  groupID: string;
  groupName: string;
  faceURL: string;
};

type FriendInfo = {
  nickname: string;
  userID: string;
  faceURL: string;
};

const contactStore = useContactStore()
const conversationStore = useConversationStore();
const router = useRouter();

const searchState = reactive({
  dataList: [] as Partial<GroupItem & SearchedFriendsInfo>[],
  keyword: '',
  loading: false
})

const onSearch = () => {
  searchState.loading = true;
  let func
  if (history.state.isGroup) {
    func = IMSDK.searchGroups<GroupInfo[]>({
      keywordList: [searchState.keyword],
      isSearchGroupID: false,
      isSearchGroupName: true
    })
  } else {
    func = IMSDK.searchFriends<FriendInfo[]>({
      keywordList: [searchState.keyword],
      isSearchUserID: false,
      isSearchNickname: true,
      isSearchRemark: true
    })
  }
  func.then(({ data }) => { searchState.dataList = data }).catch(error => feedbackToast({ error }))
    .finally(() => searchState.loading = false)
}

const itemClick = (item: any) => {
  if (history.state.isGroup) {
    conversationStore.updateCurrentGroupInfo(item)
    router.push({
      path: 'groupCard'
    })
    return;
  }
  contactStore.setUserCardData({
    baseInfo: item
  })
}

</script>

<style lang='scss' scoped></style>