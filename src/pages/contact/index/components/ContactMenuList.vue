<template>
  <ContactMenuListItem
    v-for="menu in contactMenuList"
    :icon="menu.icon"
    :title="menu.text"
    :badge="menu.badge"
    @click="menuClick(menu.id)"
  />

  <div class="mt-[10px]">
    <ContactMenuListItem
      v-for="menu in myMenuList"
      :icon="menu.icon"
      :title="menu.text"
      :badge="menu.badge"
      @click="menuClick(menu.id)"
    />
  </div>
</template>

<script setup lang="ts">
import new_friends from '@assets/images/contact/new_friends.png'
import new_groups from '@assets/images/contact/new_groups.png'
import my_friends from '@assets/images/contact/my_friends.png'
import my_groups from '@assets/images/contact/my_groups.png'
import useContactStore from '@/store/modules/contact'

import ContactMenuListItem from './ContactMenuListItem.vue'

enum ContactMenuEnum {
  NewFriend,
  NewGroup,
  MyFriend,
  MyGroup,
}

const { t } = useI18n()
const router = useRouter()
const contactStore = useContactStore()

const contactMenuList = computed(() => [
  {
    id: ContactMenuEnum.NewFriend,
    text: t('contactMenu.newFriends'),
    icon: new_friends,
    badge: contactStore.recvFriendApplicationList.filter(
      (item) => item.handleResult === 0,
    ).length,
  },
  {
    id: ContactMenuEnum.NewGroup,
    text: t('contactMenu.newGroup'),
    icon: new_groups,
    badge: contactStore.recvGroupApplicationList.filter(
      (item) => item.handleResult === 0,
    ).length,
  },
])

const myMenuList = computed(() => [
  {
    id: ContactMenuEnum.MyFriend,
    text: t('contactMenu.myGoodFriend'),
    icon: my_friends,
    badge: 0,
  },
  {
    id: ContactMenuEnum.MyGroup,
    text: t('contactMenu.myGroup'),
    icon: my_groups,
    badge: 0,
  },
])

const menuClick = (idx: ContactMenuEnum) => {
  console.log('menuClick')
  switch (idx) {
    case ContactMenuEnum.MyFriend:
      router.push('/myFriend')
      break
    case ContactMenuEnum.MyGroup:
      router.push('/myGroup')
      break
    case ContactMenuEnum.NewFriend:
      router.push('/newFriend')
      break
    case ContactMenuEnum.NewGroup:
      router.push('/newGroup')
      break
    default:
      break
  }
}
</script>

<style lang="scss" scoped></style>
