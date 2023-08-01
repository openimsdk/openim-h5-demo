<template>
    <div class="page_container">
        <NavBar title="我的好友" />
        <van-search background="#fff" placeholder="搜索好友" readonly />
        <div v-if="renderList.dataList.length>0" class="flex-1 overflow-y-auto relative">
            <van-index-bar :index-list="renderList.indexList">
                <template v-for="(item,idx) in renderList.indexList">
                    <van-index-anchor :index="item" />
                    <GenericListItem class="bg-white" v-for="(friend,index) in renderList.dataList[idx]"
                        :key="friend.userID" :source="friend" :total="renderList.dataList[idx].length" :index="index"
                        @click="toUserCard(friend)" />
                </template>
            </van-index-bar>
        </div>
        <CommonEmpty v-else />
    </div>
</template>

<script setup lang='ts'>
import GenericListItem from '@/components/GenericListItem/index.vue';
import useContactStore from '@/store/modules/contact';
import { formatContacts } from '@/utils/common';
import { FriendUserItem } from 'open-im-sdk-wasm/lib/types/entity';
import CommonEmpty from '@/components/CommonEmpty/index.vue';

const contactStore = useContactStore()

const renderList = computed(() => formatContacts(contactStore.storeFriendList))

const toUserCard = (friend: FriendUserItem) => {
    contactStore.setUserCardData({
        baseInfo: friend
    })

}

</script>

<style lang='scss' scoped>
:deep(.van-index-anchor--sticky) {
    transform: translate3d(0px, 103px, 0px) !important;
}
</style>