<template>
    <div class="page_container">
        <NavBar :title="isGroup? '群聊验证' : '好友验证'">
            <van-button :disabled="!reqMessage" :loading="loading" class="!px-2" type="primary" :text="'发送'" size="mini" @click="sendApplication" />
        </NavBar>

        <div class="pl-[22px] my-2 text-sm text-[#999]">发送申请</div>
        <div>
            <van-field v-model="reqMessage" :autosize="{minHeight:112}" type="textarea" maxlength="20"
                show-word-limit />
        </div>
    </div>
</template>

<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import { feedbackToast } from '@/utils/common';
import { IMSDK, toSpecifiedConversation } from '@/utils/imCommon';
import { GroupJoinSource, SessionType } from 'open-im-sdk-wasm/lib/types/enum';

type SendApplicationProps = {
    isGroup: Boolean;
    sourceID: string;
    isScan: Boolean;
    notNeedVerification: Boolean;
    sessionType: SessionType;
}

const router = useRouter()
const props = defineProps<SendApplicationProps>()

const reqMessage = ref('')
const loading = ref(false)

const sendApplication = () => {
    loading.value = true;
    let func
    if (props.isGroup) {
        func = IMSDK.joinGroup({
            groupID: props.sourceID,
            reqMsg: reqMessage.value,
            joinSource: props.isScan ? GroupJoinSource.QrCode : GroupJoinSource.Search
        })
    } else {
        func = IMSDK.addFriend({
            toUserID: props.sourceID,
            reqMsg: reqMessage.value
        })
    }
    func.then(() => {
        feedbackToast({message:props.notNeedVerification ? '你已加入该群' : '发送成功'})
        setTimeout(() => {
            if (props.notNeedVerification) {
                toSpecifiedConversation(props.sourceID, props.sessionType)
                    .catch((error) => feedbackToast({message: '获取会话信息失败',error}))
            } else {
                router.back()
            }
        }, 1000)
    }).catch((error) => feedbackToast({message: '发送失败！',error})).finally(()=>loading.value = false)
}

</script>

<style lang='scss' scoped>

</style>