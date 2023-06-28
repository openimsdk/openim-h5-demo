<template>
    <div class="page_container">
        <NavBar :title="'加入群聊'" />
        <AddMenuItem :title="'扫码加入'" :sub-title="'扫描群二维码'" border>
            <div class="flex justify-center items-center w-[44px] h-[44px] bg-[#5496EB] rounded-[9999px]">
                <img width="22" :src="switch_join_qr" alt="" />
            </div>
        </AddMenuItem>
        <AddMenuItem :icon="switch_join_id" :title="'群ID号加入'" :sub-title="'向管理员或团队成员询问ID'" @click="$router.push({path:'searchToJoin',query:{isGroup:'true'}})" >
            <div class="flex justify-center items-center w-[44px] h-[44px] bg-[#FFC563] rounded-[9999px]">
                <img width="22" :src="switch_join_id" alt="" />
            </div>
        </AddMenuItem>
    </div>
</template>

<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import AddMenuItem from '../contactAdd/components/AddMenuItem.vue';
import switch_join_qr from '@assets/images/switch_join_qr.png'
import switch_join_id from '@assets/images/switch_join_id.png'

</script>

<style lang='scss' scoped>

</style>