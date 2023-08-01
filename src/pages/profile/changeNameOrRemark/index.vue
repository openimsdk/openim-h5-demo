<template>
    <div class="page_container !bg-white">
        <NavBar class="shadow-md" :title="friendInfo ? '设置备注':'修改昵称'" />

        <div class="mx-6 mt-10 border-b border-[#999]">
            <van-field class="!px-0 !pb-1" v-model="value" label="" placeholder="请输入">
                <template #button>
                    <van-button size="small" type="primary" :disabled="!value&&!friendInfo" @click="saveChange">保存
                    </van-button>
                </template>
            </van-field>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { updateBusinessInfo } from '@/api/user';
import useUserStore from '@/store/modules/user';
import { feedbackToast } from '@/utils/common';
import { IMSDK } from '@/utils/imCommon';
import { FriendUserItem } from 'open-im-sdk-wasm/lib/types/entity';


const props = defineProps<{ friendInfo?: FriendUserItem, }>();

const userStore = useUserStore();
const router = useRouter();

const value = ref(props.friendInfo?.remark || userStore.storeSelfInfo.nickname)

const saveChange = () => {
    let func
    if (props.friendInfo) {
        func = IMSDK.setFriendRemark({
            toUserID: props.friendInfo.userID,
            remark: value.value,
        })
    } else {
        func = updateBusinessInfo({
            nickname: value.value,
            userID: userStore.storeSelfInfo.userID,
        })
    }
    func.then(() => feedbackToast({ message: '修改成功！',onClose: router.back}))
        .catch((error) => feedbackToast({ message: '修改失败！', error }))
}

</script>

<style lang='scss' scoped>
:deep(.van-field__body) {
    align-items: flex-end;
}
</style>