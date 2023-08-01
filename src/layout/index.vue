<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 overflow-hidden">
      <router-view v-slot="{ Component }">
        <transition>
          <keep-alive include="profile,contact,conversation">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
    <van-tabbar :border="false" fixed safe-area-inset-bottom placeholder route>
      <van-tabbar-item to="/conversation">
        <span>{{ $t('chats') }}</span>
        <template #icon="props">
          <img :src="props.active ? cve_checked : cve" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/contact">
        <span>{{ $t('contact') }}</span>
        <template #icon="props">
          <img :src="props.active ? contact_checked : contact" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/profile">
        <span>{{ $t('profile') }}</span>
        <template #icon="props">
          <img :src="props.active ? profile_checked : profile" /> </template>
      </van-tabbar-item>
    </van-tabbar>

    <div class="absolute">
      <van-overlay class-name="loading_bg" :show="showOverlay">
        <div class="h-full w-full flex items-center justify-center" @click.stop>
          <div class="loader"></div>
        </div>
      </van-overlay>
    </div>
  </div>
</template>

<script name="tabbar" setup lang='ts'>
import cve from "@assets/images/tabbar_cve.png";
import cve_checked from "@assets/images/tabbar_cve_checked.png";
import contact from "@assets/images/tabbar_contact.png";
import contact_checked from "@assets/images/tabbar_contact_checked.png";
import profile from "@assets/images/tabbar_profile.png";
import profile_checked from "@assets/images/tabbar_profile_checked.png";
import { useGlobalEvent } from "./useGlobalEvent";
import { IMSDK, initStore } from "@/utils/imCommon";
import { getIMToken, getIMUserID } from "@/utils/storage";

const router = useRouter();
const showOverlay = ref(false);

useGlobalEvent()

onMounted(() => {
  console.log('onMounted');
  loginCheck();
})

const loginCheck = () => {
  IMSDK.getLoginStatus()
    .then((res) => {
      if (res.data !== 3) {
        tryLogin();
      }
    })
    .catch(tryLogin);
};

const tryLogin = async () => {
  const IMToken = getIMToken();
  const IMUserID = getIMUserID();
  if (IMToken && IMUserID) {
    showOverlay.value = true;
    IMSDK.login({
      userID: IMUserID,
      token: IMToken,
      apiAddr: process.env.API_URL!,
      wsAddr: process.env.WS_URL!,
      platformID: 5,
    }).then(() => {
      showOverlay.value = false
      initStore();
    }).catch((error) => {
      router.push('login');
    })
  }
}

</script>

<style lang='scss' scoped>
:deep(.van-tabbar) {
  border-top: 1px solid #EAEAEA;
}

.loading_bg {
  margin: 0;
  padding: 0;
  font-family: "montserrat";
  background-image: linear-gradient(125deg, #e4ffcd, #6dd5fa, #2980b9, #e4ffcd);
  background-size: 400%;
  // animation: bganimation 15s infinite;
}

@keyframes bganimation {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}


.loader {
  position: relative;
  width: 2.5em;
  height: 2.5em;
  transform: rotate(165deg);
}

.loader:before,
.loader:after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 0.5em;
  height: 0.5em;
  border-radius: 0.25em;
  transform: translate(-50%, -50%);
}

.loader:before {
  animation: before 2s infinite;
}

.loader:after {
  animation: after 2s infinite;
}

@keyframes before {
  0% {
    width: 0.5em;
    box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
  }

  35% {
    width: 2.5em;
    box-shadow: 0 -0.5em rgba(225, 20, 98, 0.75), 0 0.5em rgba(111, 202, 220, 0.75);
  }

  70% {
    width: 0.5em;
    box-shadow: -1em -0.5em rgba(225, 20, 98, 0.75), 1em 0.5em rgba(111, 202, 220, 0.75);
  }

  100% {
    box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
  }
}

@keyframes after {
  0% {
    height: 0.5em;
    box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);
  }

  35% {
    height: 2.5em;
    box-shadow: 0.5em 0 rgba(61, 184, 143, 0.75), -0.5em 0 rgba(233, 169, 32, 0.75);
  }

  70% {
    height: 0.5em;
    box-shadow: 0.5em -1em rgba(61, 184, 143, 0.75), -0.5em 1em rgba(233, 169, 32, 0.75);
  }

  100% {
    box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);
  }
}

.loader {
  position: absolute;
  top: calc(50% - 1.25em);
  left: calc(50% - 1.25em);
}</style>