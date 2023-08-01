<template>
    <div class="page_container">
        <NavBar :title="'消息通知'" />

        <DetailInfoItem class="mt-3" :lable="'新消息通知'">
            <van-switch size="20" :loading="false" :model-value="checked" @update:model-value="onUpdateValue" />
        </DetailInfoItem>
    </div>
</template>
  
<script setup lang='ts'>
import { BusinessAllowType } from '@/api/data';
import { updateBusinessInfo } from '@/api/user';
import DetailInfoItem from '@/components/DetailInfoItem/index.vue';
import useUserStore from '@/store/modules/user';
import { feedbackToast } from '@/utils/common';

const userStore = useUserStore();

const checked = computed(()=>userStore.storeSelfInfo.allowBeep === BusinessAllowType.Allow)
const onUpdateValue = (newValue: boolean) => {
    updateBusinessInfo({
        allowBeep: newValue ? BusinessAllowType.Allow : BusinessAllowType.NotAllow,
        userID: userStore.storeSelfInfo.userID,
    }).then(() => userStore.getSelfInfoFromReq())
        .catch(error => feedbackToast({ error }))
}

</script>
  
<style lang='scss' scoped>

</style>