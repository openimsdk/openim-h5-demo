<template>
  <div class="page_container">
    <NavBar :title="$t('userInfo')" />

    <div class="my-2 mx-2 rounded-md overflow-hidden">
      <DetailInfoItem :lable="$t('avatar')">
        <Avatar :size="32" :src="contactStore.storeUserCardData.baseInfo?.faceURL"
          :desc="contactStore.storeUserCardData.baseInfo?.nickname" />
      </DetailInfoItem>
      <DetailInfoItem :lable="$t('name')" :content="contactStore.storeUserCardData.baseInfo?.nickname" />
      <DetailInfoItem :lable="$t('gender')" :content="comptGenderStr" />
      <DetailInfoItem :lable="$t('birthday')" :content="birthStr" />
    </div>

    <div class="mx-2 rounded-md overflow-hidden">
      <DetailInfoItem :lable="$t('cellphone')" :content="contactStore.storeUserCardData.baseInfo?.phoneNumber" />
      <DetailInfoItem :lable="$t('email')" :content="contactStore.storeUserCardData.baseInfo?.email" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import Avatar from '@/components/Avatar/index.vue';
import DetailInfoItem from '@/components/DetailInfoItem/index.vue';
import dayjs from 'dayjs';
import useContactStore from '@/store/modules/contact';

const { t } = useI18n()
const contactStore = useContactStore();

const comptGenderStr = computed(() => {
  if (contactStore.storeUserCardData.baseInfo?.gender === 1) {
    return t('male')
  }
  if (contactStore.storeUserCardData.baseInfo?.gender === 2) {
    return t('female')
  }
  return t('private')
})
const birthStr = contactStore.storeUserCardData.baseInfo?.birth ? dayjs(contactStore.storeUserCardData.baseInfo?.birth).format("YYYY-MM-DD") : '-'

</script>

<style lang='scss' scoped></style>