<template>
    <div class="page_container">
        <NavBar :title="'我的信息'" />
        <DetailInfoItem arrow class="mt-3" :lable="'头像'" @click="chooseAvatar">
            <Avatar :size="36" :src="userStore.storeSelfInfo.faceURL" :desc="userStore.storeSelfInfo.nickname" />
        </DetailInfoItem>
        <DetailInfoItem arrow :lable="'昵称'" :content="userStore.storeSelfInfo.nickname"
            @click="$router.push('changeNameOrRemark')" />
        <DetailInfoItem arrow :lable="'性别'" :content="comptGenderStr" @click="showGenderPicker = true" />
        <DetailInfoItem arrow :lable="'生日'" :content="comptBirthStr" />
        <DetailInfoItem :lable="'手机号码'" :content="userStore.storeSelfInfo.phoneNumber" />
        <DetailInfoItem :lable="'邮箱'" :content="userStore.storeSelfInfo.email" />
        <DetailInfoItem arrow :lable="'二维码名片'">
            <img class="w-[22px] h-[23px]" :src="self_info_qr" alt="">
        </DetailInfoItem>
        <DetailInfoItem arrow :lable="'ID'" :content="userStore.storeSelfInfo.userID" @click="copyUserID" />

        <van-uploader v-show="false" ref="uploaderRef" accept="image/*" capture="camcorder" :preview-image="false"
            :multiple="false" :after-read="afterReadFile" />

        <van-action-sheet v-model:show="showGenderPicker" :actions="genderActions" cancel-text="取消" close-on-click-action
            @cancel="showGenderPicker = false" @select="genderSelect" />
    </div>
</template>

<script setup lang='ts'>
import DetailInfoItem from '@/components/DetailInfoItem/index.vue';
import NavBar from '@/components/NavBar/index.vue';
import Avatar from '@/components/Avatar/index.vue';
import useUserStore from '@/store/modules/user';
import self_info_qr from '@assets/images/self_info_qr.png'
import dayjs from 'dayjs';
import { useClipboard } from '@vueuse/core';
import { closeToast, showLoadingToast, showToast, UploaderFileListItem, UploaderInstance } from 'vant';
import { feedbackToast } from '@/utils/common';
import { updateBusinessInfo } from '@/api/user';
import { BusinessUserInfo } from '@/api/data';
import { IMSDK } from '@/utils/imCommon';
import { v4 as uuidV4 } from "uuid";

const genderActions = [
    {
        name: '保密'
    },
    {
        name: '男'
    },
    {
        name: '女'
    },
]

const userStore = useUserStore()
const { copy, isSupported } = useClipboard()
const uploaderRef = ref<UploaderInstance>()
const showGenderPicker = ref(false)


const comptGenderStr = computed(() => {
    if (userStore.storeSelfInfo.gender === 1) {
        return '男'
    }
    if (userStore.storeSelfInfo.gender === 2) {
        return '女'
    }
    return '保密'
})
const comptBirthStr = computed(() => userStore.storeSelfInfo.birth ? dayjs(userStore.storeSelfInfo.birth * 1000).format("YYYY-MM-DD") : '-')

const copyUserID = () => {
    if (isSupported) {
        copy(userStore.storeSelfInfo.userID)
    }
    showToast(isSupported ? '复制成功' : '当前浏览器不支持复制')
}

const chooseAvatar = () => {
    uploaderRef.value?.chooseFile()
}

const updateUserInfo = (info: Partial<BusinessUserInfo>) => {
    updateBusinessInfo({
        ...info,
        userID: userStore.storeSelfInfo.userID,
    }).then(() => userStore.getSelfInfoFromReq())
        .catch(error => feedbackToast({ error }))
}

const afterReadFile = (data: UploaderFileListItem | UploaderFileListItem[]) => {
  const fileData = Array.isArray(data) ? data[0] : data;
  showLoadingToast({
    message: "上传中",
    forbidClick: true,
    duration: 0,
  });
  IMSDK.uploadFile({
    name: fileData.file?.name ?? "",
    contentType: fileData.file?.type!,
    uuid: uuidV4(),
    file: fileData.file as File,
  })
    .then((res) => {
      updateUserInfo({
        faceURL: res.data.url,
      });
    })
    .finally(closeToast);
};

const genderSelect = (_: unknown, gender: number) => {
    updateUserInfo({
        gender
    })
}

</script>

<style lang='scss' scoped></style>