<template>
  <div class="page_container">
    <img :src="bg" mode="" />

    <view
      class="mx-auto mt-[-60px] flex h-[98px] w-[90%] items-center rounded-md bg-white pl-4 pr-2"
    >
      <Avatar
        :size="46"
        :src="userStore.storeSelfInfo.faceURL"
        :desc="userStore.storeSelfInfo.nickname"
      />

      <view
        class="id_row ml-2 flex h-[46px] flex-1 flex-col items-start justify-between"
      >
        <text class="nickname">{{ userStore.storeSelfInfo.nickname }}</text>
        <view class="flex items-center" @click="copyUserID">
          <text class="text-sm text-sub-text">{{
            userStore.storeSelfInfo.userID
          }}</text>
          <img style="width: 16px; height: 16px" :src="copy_icon" mode="" />
        </view>
      </view>
    </view>

    <div class="mx-auto mt-[10px] w-[90%] rounded-md bg-white">
      <div
        v-for="(menu, idx) in profileMenus"
        :key="idx"
        class="flex items-center justify-between p-4"
        @click="menuClick(menu.route)"
      >
        <div class="flex">
          <img width="24" :src="menu.icon" alt="" />
          <span class="ml-3">{{ menu.title }}</span>
        </div>
        <img :src="back" width="24" alt="back" />
      </div>
    </div>
  </div>
</template>

<script name="profile" setup lang="ts">
import Avatar from '@/components/Avatar/index.vue'
import info from '@assets/images/profile/info.png'
import settings from '@assets/images/profile/settings.png'
import about from '@assets/images/profile/about.png'
import logout from '@assets/images/profile/logout.png'
import back from '@assets/images/profile/back.png'
import copy_icon from '@assets/images/profile/copy.png'
import bg from '@assets/images/profile/bg.png'

import { showConfirmDialog, showToast } from 'vant'
import useUserStore from '@/store/modules/user'
import { useClipboard } from '@vueuse/core'

const { copy, isSupported } = useClipboard()
const { t, locale } = useI18n()

const profileMenus = [
  {
    icon: info,
    title: t('profileMenu.personalInformation'),
    route: 'selfInfoDetails',
  },
  {
    icon: settings,
    title: t('profileMenu.accountSetting'),
    route: 'accountSettings',
  },
  {
    icon: about,
    title: t('profileMenu.aboutUs'),
    route: 'about',
  },
  {
    icon: logout,
    title: t('profileMenu.logOut'),
  },
]

watch(locale, () => {
  profileMenus[0].title = t('profileMenu.personalInformation')
  profileMenus[1].title = t('profileMenu.accountSetting')
  profileMenus[2].title = t('profileMenu.aboutUs')
  profileMenus[3].title = t('profileMenu.logOut')
})

const router = useRouter()
const userStore = useUserStore()

const menuClick = (route?: string) => {
  if (route) {
    router.push(route)
  } else {
    tryLogout()
  }
}

const copyUserID = () => {
  if (isSupported) {
    copy(userStore.storeSelfInfo.userID)
  }
  showToast(
    isSupported ? t('messageTip.copySuccess') : t('messageTip.environmentNotSupported'),
  )
}

const tryLogout = () => {
  showConfirmDialog({
    message: t('messageTip.tryLogout'),
    beforeClose: (action: string) => {
      return new Promise((resolve) => {
        if (action !== 'confirm') {
          resolve(true)
          return
        }
        userStore.userLogout().finally(() => {
          resolve(true)
          router.push('/login')
        })
      })
    },
  }).catch(() => {})
}
</script>

<style lang="scss" scoped></style>
