<template>
  <div class="page_container !bg-white">
    <NavBar title=""/>
    <div class="mt-16 flex flex-col justify-center items-center">
        <div class="text-xl mb-3 font-medium">{{title}}</div>
        <div class="w-[80%] text-center">{{subTitle}}</div>

        <div class="flex items-center py-2 border-[rgba(51,51,51,.4)] border-t border-b mt-8 w-[80%]">
            <Avatar :src="originData.faceURL" :desc="originData.nickname" :is-group="!!originData.groupName" />
            <van-field v-model="name" label="" :placeholder="originData.groupName ? '请输入群名称' : '请输入用户名'" />
        </div>
    </div>

    <div class="mt-[30vh] flex justify-center">
        <van-button class="min-w-[30vw]" type="primary" size="small" @click="finishChange">完成</van-button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import Avatar from '@/components/Avatar/index.vue';
import { GroupItem, GroupMemberItem } from 'open-im-sdk-wasm/lib/types/entity';
import { IMSDK } from '@/utils/imCommon';
import { feedbackToast } from '@/utils/common';

const router = useRouter();
const props = defineProps<{originData:GroupItem&GroupMemberItem}>()

const name = ref(props.originData.nickname||props.originData.groupName);

const title = props.originData.groupName ? '修改群聊名称' : '我在群里的昵称'
const subTitle = props.originData.groupName ? '修改群聊名称后，将在群内通知其他成员。' : '昵称修改后，只会在此群内显示，群内成员都能看见。'

const finishChange = () => {
    let func
    if(props.originData.groupName){
        func = IMSDK.setGroupInfo({
            groupID: props.originData.groupID,
            groupName: name.value
        })
    }else {
        func = IMSDK.setGroupMemberNickname({
            groupID: props.originData.groupID,
            userID: props.originData.userID,
            groupMemberNickname: name.value
        })
    }
    func.then(()=>feedbackToast({message:'修改成功！',onClose:router.back})).catch((error)=>feedbackToast({message:'修改失败！',error}))
}
</script>

<style lang='scss' scoped>

</style>