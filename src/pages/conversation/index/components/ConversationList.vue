<template>
  <van-pull-refresh v-model="loadState.pullLoading" :disabled="pullDisabled" @refresh="onRefresh">
    <virtual-list ref="vsl" class="my_scrollbar h-full overflow-y-auto" :data-key="'conversationID'"
      :data-sources="conversationStore.storeConversationList" :data-component="ConversationListItemVue"
      :estimate-size="88" @tobottom="onBottom" @scroll="onScoll" />
  </van-pull-refresh>
</template>

<script setup lang='ts'>
import useConversationStore from '@/store/modules/conversation';
import VirtualList from '@components/VirtualList';
import ConversationListItemVue from './ConversationListItem.vue';

const emit = defineEmits([]);
const props = defineProps();

const conversationStore = useConversationStore();
const loadState = reactive({
  loading: false,
  pullLoading: false,
  hasMore: true
});
const pullDisabled = ref(false)

const onBottom = async () => {
  if (loadState.hasMore && !loadState.loading) {
    loadState.loading = true
    loadState.hasMore = await conversationStore.getConversationListFromReq(true)
    loadState.loading = false
  }
}

const onScoll = (e: any) => {
  pullDisabled.value = e.target.scrollTop > 0
}

const onRefresh = async () => {
  await conversationStore.getConversationListFromReq()
  loadState.pullLoading = false
}

</script>

<style lang='scss' scoped>
.van-pull-refresh {
  flex: 1;
}
</style>