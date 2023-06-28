<template>
    <div class="page_container">
        <NavBar :title="'发起群聊'" />

        <div class="flex px-[22px] py-3 my-3 bg-white">
            <Avatar :size="44" :src="groupBaseInfo.groupFaceUrl" is-group @click="chooseAvatar" />
            <van-field class="ml-2" maxlength="20" v-model="groupBaseInfo.groupName" placeholder="请输入群名称" />
        </div>

        <div class="my-2 px-[22px] py-4 bg-white" @click="toChooseMember">
            <div class="flex items-center justify-between">
                <span>群成员</span>
                <span class="text-xs text-[#ADADAD] ml-3">{{ checkedUserList.length }}人</span>
            </div>
            <div class="mt-3 flex">
                <Avatar class="mr-2 last:mr-0" v-for="member in checkedUserList.slice(0, 6)" :key="member.userID"
                    :src="member.faceURL" :desc="member.nickname" :size="42" />
                <div v-show="checkedUserList.length > 6"
                    class="bg-[#5496EB] w-[42px] h-[42px] flex justify-center items-center rounded-md">
                    <van-icon name="ellipsis" size="28" color="#fff" />
                </div>
            </div>
        </div>

        <div class="flex-1 flex flex-col-reverse">
            <van-button :loading="createLoading" :disabled="comptBtnDisabled" square class="w-full !border-0" type="primary"
                text="完成创建" @click="createGroup" />
        </div>

        <van-uploader v-show="false" ref="uploaderRef" accept="image/*" capture="camcorder" :preview-image="false"
            :multiple="false" :after-read="afterReadFile" />
    </div>
</template>

<script setup lang='ts'>
import Avatar from '@/components/Avatar/index.vue';
import { feedbackToast, switchUpload } from '@/utils/common';
import { IMSDK, toSpecifiedConversation } from '@/utils/imCommon';
import { PublicUserItem } from 'open-im-sdk-wasm/lib/types/entity';
import { GroupRole, GroupType, SessionType } from 'open-im-sdk-wasm/lib/types/enum';
import { ContactChooseEnum } from '../chooseUser/data';
import NavBar from '@/components/NavBar/index.vue';
import { UploaderFileListItem, UploaderInstance, showLoadingToast } from 'vant';

type CreateGroupProps = {
    groupType: GroupType
}
const props = defineProps<CreateGroupProps>();

const router = useRouter()
const route = useRoute()

const groupBaseInfo = ref({
    groupName: '',
    groupFaceUrl: '',
})
const checkedUserList = ref<PublicUserItem[]>([])
const createLoading = ref(false)
const uploaderRef = ref<UploaderInstance>()
const comptBtnDisabled = computed(() => !groupBaseInfo.value.groupName || checkedUserList.value.length === 0)

const toChooseMember = () => {
    router.push({
        path: 'chooseUser',
        state: {
            extraData: JSON.stringify(groupBaseInfo.value),
            chooseType: ContactChooseEnum.LaunchGroup,
            prevCheckedUserList: JSON.stringify(checkedUserList.value)
        }
    })
}

const createGroup = () => {
    createLoading.value = true
    const baseInfo = {
        groupType: props.groupType,
        groupName: groupBaseInfo.value.groupName,
        faceURL: groupBaseInfo.value.groupFaceUrl,
    }
    const memberList = checkedUserList.value.map(member => ({
        userID: member.userID,
        roleLevel: GroupRole.Nomal
    }))
    IMSDK.createGroup({
        groupBaseInfo: baseInfo,
        memberList
    }).then(({ data }) => {
        feedbackToast({ message: '创建成功！' })
        toSpecifiedConversation(data.groupID, props.groupType === GroupType.NomalGroup ? SessionType.Group : SessionType.SuperGroup)
    }).catch(error => feedbackToast({ error }))
        .finally(() => createLoading.value = false)
}

const afterReadFile = (data: UploaderFileListItem | UploaderFileListItem[]) => {
    data = Array.isArray(data) ? data[0] : data
    const uploadToast = showLoadingToast({
        message: '上传中',
        forbidClick: true,
        duration: 0
    })
    switchUpload(data.file!).then(({ data: { URL } }) => {
        groupBaseInfo.value.groupFaceUrl = URL
    }).catch(() => uploadToast.message = "上传失败！").finally(() => uploadToast.close())
}

const chooseAvatar = () => {
    uploaderRef.value?.chooseFile()
}

onBeforeMount(() => {
    const state = history.state
    if (state.extraData) {
        groupBaseInfo.value = JSON.parse(state.extraData)
    }
    checkedUserList.value = state.prevCheckedUserList ? JSON.parse(state.prevCheckedUserList) : []

})

</script>

<style lang='scss' scoped></style>