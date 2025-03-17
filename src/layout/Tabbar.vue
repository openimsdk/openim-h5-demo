<template>
  <van-tabbar :border="false" fixed safe-area-inset-bottom placeholder route>
    <van-tabbar-item
      to="/conversation"
      :badge="conversationStore.storeUnReadCount"
      :badge-props="{ max: 99, showZero: false }"
    >
      <span>OpenIM</span>
      <template #icon="props">
        <img :src="props.active ? conversation_active : conversation" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item
      to="/contact"
      :badge="unHandleApplicationCount"
      :badge-props="{ max: 99, showZero: false }"
    >
      <span>{{ $t('contact') }}</span>
      <template #icon="props">
        <img :src="props.active ? contacts_active : contacts" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/workbench">
      <span>{{ $t('workbench') }}</span>
      <template #icon="props">
        <img :src="props.active ? workbench_active : workbench" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/profile">
      <span>{{ $t('profile') }}</span>
      <template #icon="props">
        <img :src="props.active ? profile_active : profile" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import conversation from '@assets/images/tabbar/conversation.png'
import conversation_active from '@assets/images/tabbar/conversation_active.png'

import contacts from '@assets/images/tabbar/contacts.png'
import contacts_active from '@assets/images/tabbar/contacts_active.png'

import workbench from '@assets/images/tabbar/workbench.png'
import workbench_active from '@assets/images/tabbar/workbench_active.png'

import profile from '@assets/images/tabbar/profile.png'
import profile_active from '@assets/images/tabbar/profile_active.png'

import useConversationStore from '@/store/modules/conversation'
import useContactStore from '@/store/modules/contact'

const conversationStore = useConversationStore()
const contactStore = useContactStore()

const unHandleApplicationCount = computed(() => {
  const recvFriendNum = contactStore.recvFriendApplicationList.filter(
    (item) => item.handleResult === 0,
  ).length
  const recvGroupNum = contactStore.recvGroupApplicationList.filter(
    (item) => item.handleResult === 0,
  ).length
  return recvFriendNum + recvGroupNum
})
</script>

<style lang="scss" scoped>
:deep(.van-tabbar) {
  height: 66px;
  border-top: 1px solid #eaeaea;
}

:deep(.van-tabbar-item__icon img) {
  height: 28px;
}

:deep(.van-tabbar-item) {
  color: #8e9ab0;
}

:deep(.van-tabbar-item--active) {
  color: var(--van-tabbar-item-active-color);
}

:deep(.van-tabbar-item__text) {
  font-size: 10px;
}
</style>
