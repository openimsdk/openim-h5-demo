<template>
    <div class="page_container">
        <van-search v-model="keyword" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" />
        <div v-show="!empty && !searching" class="flex items-center px-[22px] pt-1 pb-4 bg-white" @click="onSearch">
            <img class="mr-2 h-[22px]" width="21" :src="isGroup ? contact_add_join_group : contact_add_search_user"
                alt="" />
            <span class="truncate">{{ `搜索：${keyword}` }}</span>
        </div>

        <div v-show="searching" class="flex justify-center px-[22px] pt-1 pb-4 bg-white text-[#999]">
            <van-loading size="24" type="spinner" />
        </div>
        <div v-show="empty" class="flex justify-center px-[22px] pt-1 pb-4 bg-white text-[#999]">
            <span v-show="empty">无搜索结果</span>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { searchUserInfoByBusiness } from '@/api/user';
import useContactStore from '@/store/modules/contact';
import useConversationStore from '@/store/modules/conversation';
import { filterEmptyValue } from '@/utils/common';
import { IMSDK } from '@/utils/imCommon';
import contact_add_join_group from '@assets/images/contact_add_join_group.png'
import contact_add_search_user from '@assets/images/contact_add_search_user.png'

type SearchToJoinProps = {
    isGroup: boolean,
}

const router = useRouter()
const contactStore = useContactStore()
const conversationStore = useConversationStore()
const props = defineProps<SearchToJoinProps>();



const keyword = ref('');
const searching = ref(false);
const empty = ref(false);

const onSearch = async () => {
    if (!keyword.value) return;
    searching.value = true
    if (props.isGroup) {
        await searchGroups();
    } else {
        await searchUsers();
    }
    searching.value = false
}

const searchGroups = async () => {
    try {
        let info = contactStore.storeGroupList.find(item => item.groupID === keyword.value)
        if (!info) {
            const { data } = await IMSDK.getSpecifiedGroupsInfo([keyword.value])
            info = data[0]
        }
        if (info) {
            conversationStore.updateCurrentGroupInfo(info)
            router.push({
                path: 'groupCard'
            })
        } else {
            empty.value = true;
        }
    } catch (error) {

    }
}

const searchUsers = async () => {
  try {
    const { data:{ total, users } } = await searchUserInfoByBusiness(keyword.value);

    if (total > 0) {
      const businessData = users[0];
      const { data } = await IMSDK.getUsersInfo([businessData.userID]);
      const imData = data[0]?.friendInfo ?? data[0]?.publicInfo ?? {};
      const info = {
        ...imData,
        ...businessData,
      };
      contactStore.setUserCardData({
        baseInfo: info,
      });
    } else {
      empty.value = true;
    }
  } catch (error) {}
};

const onCancel = () => {
    router.back();
}

</script>

<style lang='scss' scoped></style>