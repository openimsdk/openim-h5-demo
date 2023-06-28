<template>
    <div class="bg-white">
        <ContactMenuListItem v-for="(menu,idx) in contactMenuList" :icon="menu.icon" :title="menu.text"
            :no-border="idx===contactMenuList.length-1" @click="menuClick(idx)" />
    </div>
</template>

<script setup lang='ts'>
import ContactMenuListItem from './ContactMenuListItem.vue';
import contact_new_friend from '@assets/images/contact_new_friend.png'
import contact_new_group from '@assets/images/contact_new_group.png'
import contact_my_friend from '@assets/images/contact_my_friend.png'
import contact_my_group from '@assets/images/contact_my_group.png'

enum ContactMenuEnum {
    NewFriend,
    NewGroup,
    MyFriend,
    MyGroup
}

const contactMenuList = [
    {
        text: '新的好友',
        icon: contact_new_friend,
    },
    {
        text: '群通知',
        icon: contact_new_group,
    },
    {
        text: '我的好友',
        icon: contact_my_friend,
    },
    {
        text: '我的群组',
        icon: contact_my_group,
    },
]

const router = useRouter()

const menuClick = (idx: ContactMenuEnum) => {
    console.log('menuClick');
    switch (idx) {
        case ContactMenuEnum.MyFriend:
            router.push('/myFriend')
            break;
        case ContactMenuEnum.MyGroup:
            router.push('/myGroup')
            break;
        case ContactMenuEnum.NewFriend:
            router.push('/newFriend')
            break;
        case ContactMenuEnum.NewGroup:
            router.push('/newGroup')
            break;
        default:
            break;
    }
}
</script>

<style lang='scss' scoped>

</style>