<template>
  <van-overlay :show="overlayVisible">
    <div class="record_container">
      <div
        :data-tip="
          !isCancelActive ? $t('buttons.releaseSend') : $t('buttons.releaseCancel')
        "
        ref="recordAreaRef"
        class="record_area"
      >
        <img :src="recording_icon" alt="" />
      </div>

      <div class="layer_container">
        <div class="prompt-layer prompt-layer-1">
          <div class="prompt-loader">
            <div class="em" v-for="(item, index) in 20" :key="index"></div>
          </div>
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<script setup lang="ts">
import recording_icon from '@assets/images/chating_footer_recording.png'
import { useElementBounding } from '@vueuse/core'
import { showToast } from 'vant'
import useRecorder from './useRecorder'

type RecordingEmits = {
  (event: 'recordFinish', blob: File, duration: number): void
}

const emit = defineEmits<RecordingEmits>()

const recordAreaRef = ref()
const { t } = useI18n()
const { top } = useElementBounding(recordAreaRef)

const overlayVisible = ref(false)
const isCancelActive = ref(false)

const { requestPermission, startRecord, stopRcord } = useRecorder()

const touchMoveSpeech = (event: TouchEvent) => {
  const touches = event.touches[0]
  isCancelActive.value = touches.pageY < top.value
}

const checkStopType = async () => {
  // stop recording
  const { duration, size, file } = await stopRcord()
  if (isCancelActive.value) {
    showToast(t('messageTip.messageTip'))
  } else {
    if (duration < 1) {
      showToast(t('messageTip.recordingTooShort'))
    } else {
      console.log(duration, size, file)

      emit('recordFinish', file, duration)
    }
  }
  isCancelActive.value = false
}

const isShowOverlay = (flag = true) => {
  if (!flag) {
    checkStopType()
  } else {
    startRecord()
  }
  overlayVisible.value = flag
}

defineExpose({
  isShowOverlay,
  touchMoveSpeech,
  requestPermission,
})
</script>

<style lang="scss" scoped>
.prompt-layer {
  border-radius: 8px;
  background: #fff;
  padding: 30px 16px;
  box-sizing: border-box;
  position: relative;
  // position: absolute;
  // left: 50%;
  // transform: translateX(-50%);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.prompt-layer::after {
  content: '';
  display: block;
  border: 12px solid rgba(0, 0, 0, 0);
  border-top-color: #fff;
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
}

.prompt-layer-1 {
  font-size: 12px;
  width: 170px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: -160px;
}

.prompt-layer-1 .p {
  color: #000;
}

.prompt-layer-1 .span {
  color: rgba(0, 0, 0, 0.6);
}

/* prompt------------- */
.prompt-loader {
  width: 130px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.prompt-loader .em {
  display: block;
  background: #3a65cc;
  width: 1px;
  height: 10%;
  margin-right: 2.5px;
  float: left;
}

.prompt-loader .em:last-child {
  margin-right: 0px;
}

.prompt-loader .em:nth-child(1) {
  animation: load 2.5s 1.4s infinite linear;
}

.prompt-loader .em:nth-child(2) {
  animation: load 2.5s 1.2s infinite linear;
}

.prompt-loader .em:nth-child(3) {
  animation: load 2.5s 1s infinite linear;
}

.prompt-loader .em:nth-child(4) {
  animation: load 2.5s 0.8s infinite linear;
}

.prompt-loader .em:nth-child(5) {
  animation: load 2.5s 0.6s infinite linear;
}

.prompt-loader .em:nth-child(6) {
  animation: load 2.5s 0.4s infinite linear;
}

.prompt-loader .em:nth-child(7) {
  animation: load 2.5s 0.2s infinite linear;
}

.prompt-loader .em:nth-child(8) {
  animation: load 2.5s 0s infinite linear;
}

.prompt-loader .em:nth-child(9) {
  animation: load 2.5s 0.2s infinite linear;
}

.prompt-loader .em:nth-child(10) {
  animation: load 2.5s 0.4s infinite linear;
}

.prompt-loader .em:nth-child(11) {
  animation: load 2.5s 0.6s infinite linear;
}

.prompt-loader .em:nth-child(12) {
  animation: load 2.5s 0.8s infinite linear;
}

.prompt-loader .em:nth-child(13) {
  animation: load 2.5s 1s infinite linear;
}

.prompt-loader .em:nth-child(14) {
  animation: load 2.5s 1.2s infinite linear;
}

.prompt-loader .em:nth-child(15) {
  animation: load 2.5s 1.4s infinite linear;
}

.prompt-loader .em:nth-child(16) {
  animation: load 2.5s 1.6s infinite linear;
}

.prompt-loader .em:nth-child(17) {
  animation: load 2.5s 1.8s infinite linear;
}

.prompt-loader .em:nth-child(18) {
  animation: load 2.5s 2s infinite linear;
}

.prompt-loader .em:nth-child(19) {
  animation: load 2.5s 2.2s infinite linear;
}

.prompt-loader .em:nth-child(20) {
  animation: load 2.5s 2.4s infinite linear;
}

@keyframes load {
  0% {
    height: 10%;
  }

  50% {
    height: 100%;
  }

  100% {
    height: 10%;
  }
}

.record_container {
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
  width: 100%;

  .record_area {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 130px;
    width: 150%;
    background-color: #dfdfdf;
    border-radius: 50% / 100% 100% 0 0;
    position: relative;
    left: -25%;

    image {
      width: 36px;
      height: 36px;
    }

    &:after {
      content: attr(data-tip);
      font-size: 13px;
      color: #bebebe;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -32px;
    }
  }

  .record_action_bar {
    display: flex;
    width: 80%;
    min-height: 100px;
    justify-content: space-between;
    margin-left: 10%;
    margin-bottom: 24px;

    .record_action {
      height: 72px;
      width: 72px;
      border-radius: 50%;
      background-color: #484848;
      color: #8e8e8e;
      transition: all 0.25s;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28px;
      font-weight: 500;
      transform: rotate(-24deg);
      position: relative;

      &:after {
        content: attr(data-tip);
        position: absolute;
        font-size: 13px;
        color: #bebebe;
        transform: rotate(24deg);
        top: -50%;
        left: 50%;
        width: 60px;
        text-align: center;
      }

      &:last-child {
        transform: rotate(24deg);

        &:after {
          transform: rotate(-24deg);
          left: auto;
          right: 40%;
        }
      }

      &_cancling {
        transform: rotate(-24deg) scale(1.2);
        background-color: #eeedf0;
        color: #696768;
      }

      &_translating {
        transform: rotate(24deg) scale(1.2) !important;
        background-color: #eeedf0;
        color: #696768;
      }
    }
  }

  .layer_container {
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>
