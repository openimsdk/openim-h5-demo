<template>
    <div class="page_container">
        <NavBar :title="'添加'" />

        <div class="text-[#999] text-xs my-2 ml-[22px]">创建或加入群聊</div>
        <AddMenuItem :icon="contact_add_create_group" :title="'创建群聊'" :sub-title="'创建群聊，全面使用司聊'" border
            @click="chooseGroupType" />
        <AddMenuItem :icon="contact_add_join_group" :title="'加入群聊'" :sub-title="'与成员一起沟通协作'"
            @click="$router.push('switchJoinGroup')" />

        <div class="text-[#999] text-xs my-2 ml-[22px]">添加好友</div>
        <AddMenuItem :icon="contact_add_search_user" :title="'搜索好友'" :sub-title="'通过手机号/ID搜索添加'" border
            @click="$router.push({path:'searchToJoin',query:{isGroup:'false'}})" />
        <AddMenuItem :icon="contact_add_scan" :title="'扫一扫'" :sub-title="'扫描二维码名片'" />

    </div>
</template>

<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import AddMenuItem from './components/AddMenuItem.vue';
import contact_add_create_group from '@assets/images/contact_add_create_group.png'
import contact_add_join_group from '@assets/images/contact_add_join_group.png'
import contact_add_search_user from '@assets/images/contact_add_search_user.png'
import contact_add_scan from '@assets/images/contact_add_scan.png'

const router = useRouter()

const chooseGroupType = () => {
    router.push('createGroup')
}

</script>

<style lang='scss' scoped>

</style>