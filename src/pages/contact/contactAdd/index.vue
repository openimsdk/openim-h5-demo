<template>
  <div class="page_container">
    <NavBar :title="$t('add')" />

    <div class="mt-[10px]"></div>
    <AddMenuItem :icon="add_scan" :title="$t('scanQr')" :sub-title="$t('scanQrCodeDesc')" @click="$router.push('scanPage')" border />
    <AddMenuItem :icon="add_search_user" :title="$t('addFriend')" :sub-title="$t('addFriendDesc')" border
      @click="$router.push({ path: 'searchToJoin', query: { isGroup: 'false' } })" />
    <AddMenuItem :icon="add_create_group" :title="$t('createGroup')" :sub-title="$t('createGroupDesc')" border
      @click="chooseGroupType" />
    <AddMenuItem :icon="add_join_group" :title="$t('joinGroup')" :sub-title="$t('joinGroupDesc')"
      @click="$router.push({ path: 'searchToJoin', query: { isGroup: 'true' } })" />
  </div>
</template>

<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import AddMenuItem from './components/AddMenuItem.vue';
import add_create_group from '@assets/images/contact/add_create_group.png'
import add_join_group from '@assets/images/contact/add_join_group.png'
import add_search_user from '@assets/images/contact/add_search_user.png'
import add_scan from '@assets/images/contact/add_scan.png'
import { GroupType } from '@/utils/open-im-sdk-wasm/types/enum';

const router = useRouter()

const chooseGroupType = () => {
  router.push({
    path: 'createGroup',
    query: {
      groupType: GroupType.WorkingGroup
    }
  })
}

</script>

<style lang='scss' scoped></style>