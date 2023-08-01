<template>
    <div class="page_container">
        <NavBar :title="'账号设置'" />

        <DetailInfoItem class="mt-3" :lable="'勿扰模式'">
            <van-switch size="20" :loading="false" :model-value="checked" @update:model-value="onUpdateValue" />
        </DetailInfoItem>
        <DetailInfoItem arrow :lable="'通讯录黑名单'" @click="$router.push('blackList')" />
    </div>
</template>
  
<script setup lang='ts'>
import DetailInfoItem from '@/components/DetailInfoItem/index.vue';
import useUserStore from '@/store/modules/user';
import { IMSDK } from '@/utils/imCommon';
import { MessageReceiveOptType } from 'open-im-sdk-wasm/lib/types/enum';
import { showToast } from 'vant';

const userStore = useUserStore();
const checked = computed(()=>userStore.storeSelfInfo.globalRecvMsgOpt !== MessageReceiveOptType.Nomal)
const onUpdateValue = (newValue: boolean) => {
    IMSDK.setGlobalRecvMessageOpt(newValue ? MessageReceiveOptType.NotNotify : MessageReceiveOptType.Nomal).then(() => showToast('设置成功！'))
        .catch(err => showToast(err.errMsg || '设置失败！'))
}

</script>
  
<style lang='scss' scoped>

</style>