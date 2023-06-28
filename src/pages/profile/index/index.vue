<template>
  <div class="page_container !bg-white">
    <div class="profile_top">
      <Avatar :size="72" :src="userStore.storeSelfInfo.faceURL" :desc="userStore.storeSelfInfo.nickname" />
      <div class="max-w-[60vw] truncate mt-4 mb-2">{{ userStore.storeSelfInfo.nickname }}
      </div>
      <div class="flex items-center mb-6">
        <div class="max-w-[200px] truncate">{{ `ID: ${userStore.storeSelfInfo.userID}` }}</div>
        <img class="w-[18px] h-[18px] mx-2" width="18" :src="profile_top_qr" alt="">
        <van-icon name="arrow" />
      </div>
    </div>

    <div v-for="(menu, idx) in profileMenus" :key="idx" class="flex items-center justify-between px-[22px] py-4"
      @click="menuClick(menu.route)">
      <div class="flex">
        <img width="22" :src="menu.icon" alt="" />
        <span class="ml-3">{{ menu.title }}</span>
      </div>
      <van-icon name="arrow" color="#999" size="16" />
    </div>

  </div>
</template>

<script name="profile" setup lang='ts'>
import Avatar from '@/components/Avatar/index.vue';
import profile_top_qr from '@assets/images/profile_top_qr.png'
import profile_menu_info from '@assets/images/profile_menu_info.png'
import profile_menu_notice from '@assets/images/profile_menu_notice.png'
import profile_menu_account from '@assets/images/profile_menu_account.png'
import profile_menu_about from '@assets/images/profile_menu_about.png'
import profile_menu_logout from '@assets/images/profile_menu_logout.png'
import { showConfirmDialog } from 'vant';
import useUserStore from '@/store/modules/user';
import { IMSDK } from '@/utils/imCommon';
import { clearIMProfile } from '@/utils/storage';

enum ProfileMenuEnum {
  MyInfo,
  NotificationSetting,
  AccountSetting,
  About,
  Logout,
}

const profileMenus = [
  {
    icon: profile_menu_info,
    title: '我的信息',
    route: 'selfInfoDetails'
  },
  {
    icon: profile_menu_notice,
    title: '新消息通知',
    route: 'notificationSettings'
  },
  {
    icon: profile_menu_account,
    title: '账号设置',
    route: 'accountSettings'
  },
  {
    icon: profile_menu_about,
    title: '关于我们',
    route: 'about'
  },
  {
    icon: profile_menu_logout,
    title: '退出登录'
  },
]

const router = useRouter()
const userStore = useUserStore()


const menuClick = (route?: string) => {
  if (route) {
    router.push(route)
  } else {
    tryLogout()
  }

}

const tryLogout = () => {
  showConfirmDialog({
    message: '确定要退出登录吗？',
    beforeClose: (action: string) => {
      return new Promise((resolve) => {
        if (action !== 'confirm') {
          resolve(true);
          return
        }
        IMSDK.logout().finally(() => {
          resolve(true)
          clearIMProfile();
          router.push('login')
        })
      })
    }
  }).catch(() => { })
}

</script>

<style lang='scss' scoped>
.profile_top {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 220px;
  margin-bottom: 12px;
  background-image: url("@assets/images/profile_top_bg.png");
  background-repeat: round;
  color: #fff;
}
</style>