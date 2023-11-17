<template>
  <div class="flex flex-col justify-center items-center h-full bg-black">
    <div id="video_player" class="flex-1">
    </div>
    <div class="flex justify-between w-full px-4 pb-4 pt-2">
      <van-icon name="close" size="24" color="#fff" @click="closeModal" />
      <van-icon name="down" size="24" color="#fff" @click="closeModal" />
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import Player from "xgplayer/dist/core_player";
import play from "xgplayer/dist/controls/play";
import fullscreen from "xgplayer/dist/controls/fullscreen";
import progress from "xgplayer/dist/controls/progress";
import volume from "xgplayer/dist/controls/volume";
import pip from "xgplayer/dist/controls/pip";
import flex from "xgplayer/dist/controls/flex";
import enter from "xgplayer/dist/controls/enter";
import loading from "xgplayer/dist/controls/loading";
import memoryPlay from "xgplayer/dist/controls/memoryPlay";
import replay from "xgplayer/dist/controls/replay";
import playbackRate from "xgplayer/dist/controls/playbackRate";

type VideoPlayerProps = {
  url: string;
  poster: string
}

const router = useRouter();
const props = defineProps<VideoPlayerProps>()

const player = ref()

const createPlay = () => {
  player.value = new Player({
    id: "video_player",
    url: props.url,
    poster: props.poster,
    controlPlugins: [play, fullscreen, progress, volume, pip, flex, enter, loading, memoryPlay, replay, playbackRate],
    pip: true,
    fluid: true,
    autoplay: true,
    videoInit: true,
    lang: "zh-cn",
    playbackRate: [0.5, 0.75, 1, 1.5, 2],
  });
}

const closeModal = () => {
  router.back();
  // emit('closePlayer')
}

onMounted(() => {
  nextTick(() => {
    createPlay();
  })
})

onUnmounted(() => {
  try {
    player.value?.destroy();
  } catch (error) { }
})

</script>

<style lang="scss" scoped></style>