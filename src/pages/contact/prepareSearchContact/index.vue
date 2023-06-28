<template>
    <div class="page_container">
        <NavBar :title="isGroup ? '添加群聊' : '添加好友'" />
        <van-search readonly :placeholder="isGroup ? '通过群ID搜索添加' : '通过手机号/ID搜索添加'" @click-input="clickInput"  />
        <AddMenuItem v-if="!isGroup" class="mt-3" :icon="contact_add_qr" :title="'我的二维码'" :sub-title="'邀请对方扫码，添加好友'" border />
        <AddMenuItem :icon="contact_add_scan" :title="'扫一扫'" :sub-title="'扫描二维码名片'"/>
    </div>
</template>

<script setup lang='ts'>
import AddMenuItem from '../contactAdd/components/AddMenuItem.vue';
import contact_add_qr from '@assets/images/contact_add_qr.png'
import contact_add_scan from '@assets/images/contact_add_scan.png'

type PrepareSearchContactProps = {
    isGroup: boolean;
}

const router = useRouter();
const props = defineProps<PrepareSearchContactProps>()

const clickInput = () => {
    router.push({
        path: 'searchToJoin',
        query: {
            isGroup: props.isGroup+''
        }
    })
}

</script>

<style lang='scss' scoped>

</style>