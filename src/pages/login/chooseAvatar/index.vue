<template>
  <div class="page_container !bg-white">
    <NavBar title="默认头像" />

    <div class="flex mx-5 flex-wrap w-full">
      <img v-for="(avatar,idx) in avatarList" :src="avatar.src" :key="idx" class="avatar" alt=""
        @click="chooseAvatar(avatar.name)">
    </div>
  </div>
</template>

<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import { avatarList } from '@/constants/avatar'

const router = useRouter();

const chooseAvatar = (name: string) => {
  router.replace({
    path: 'setBaseInfo',
    state: {
      avatar: name,
    },
    query: {
      baseData: history.state.baseData
    }
  })
  router.go(-1)
}

</script>

<style lang='scss' scoped>
.avatar {
  width: calc(25% - 22px);
  margin-right: 16px;
  margin-top: 20px;

  &:nth-child(4) {
    margin-right: 0;
  }
}
</style>