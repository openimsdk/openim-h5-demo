<template>
  <div class="canvasBox bg-[#333]">
    <template v-if="cmpData.isUse">
      <div class="box">
        <div class="line"></div>
        <div class="angle"></div>
      </div>
      <div class="box2" v-if="cmpData.isUseTorch">
        <div class="track" @click="openTrack">
          <svg t="1653920715959" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="1351" width="32" height="32">
            <path
              d="M651.353043 550.479503H378.752795L240.862609 364.315031c-3.688944-4.897391-5.660621-10.876025-5.660621-17.045466v-60.040745c0-15.773416 12.847702-28.621118 28.621118-28.621118h502.459627c15.773416 0 28.621118 12.847702 28.621118 28.621118v59.977143c0 6.105839-1.971677 12.084472-5.660621 17.045466l-137.890187 186.228074zM378.752795 598.308571v398.024348c0 15.328199 12.402484 27.667081 27.667081 27.667081h217.266087c15.328199 0 27.667081-12.402484 27.66708-27.667081V598.308571H378.752795z m136.300124 176.942112c-14.564969 0-26.331429-11.76646-26.331428-26.331428v-81.283975c0-14.564969 11.76646-26.331429 26.331428-26.331429 14.564969 0 26.331429 11.76646 26.331429 26.331429v81.283975c0 14.564969-11.76646 26.331429-26.331429 26.331428zM512 222.608696c-17.554286 0-31.801242-14.246957-31.801242-31.801243V31.801242c0-17.554286 14.246957-31.801242 31.801242-31.801242s31.801242 14.246957 31.801242 31.801242v159.006211c0 17.554286-14.246957 31.801242-31.801242 31.801243zM280.932174 205.881242c-9.47677 0-18.889938-4.197764-25.122981-12.275279L158.242981 67.991056a31.864845 31.864845 0 0 1 5.597019-44.648944 31.864845 31.864845 0 0 1 44.648944 5.597018l97.502609 125.551305a31.864845 31.864845 0 0 1-5.597019 44.648944c-5.787826 4.579379-12.656894 6.741863-19.46236 6.741863zM723.987081 205.881242c-6.805466 0-13.674534-2.162484-19.462361-6.678261a31.794882 31.794882 0 0 1-5.597018-44.648944l97.566211-125.551304a31.794882 31.794882 0 0 1 44.648944-5.597019 31.794882 31.794882 0 0 1 5.597019 44.648944l-97.566211 125.551305c-6.360248 8.077516-15.709814 12.27528-25.186584 12.275279z"
              fill="#ffffff" p-id="1352"></path>
          </svg>
          {{ cmpData.trackStatus ? $t('offFlash') : $t('onFlash') }}
        </div>
      </div>

      <div class="mask1 mask" :style="'height:' + cmpData.maskHeight + 'px;'"></div>
      <div class="mask2 mask"
        :style="'width:' + cmpData.maskWidth + 'px;top:' + cmpData.maskHeight + 'px;height:' + cmpData.canvasHeight + 'px'">
      </div>
      <div class="mask3 mask" :style="'height:' + cmpData.maskHeight + 'px;'"></div>
      <div class="mask4 mask"
        :style="'width:' + cmpData.maskWidth + 'px;top:' + cmpData.maskHeight + 'px;height:' + cmpData.canvasHeight + 'px'">
      </div>
    </template>
  </div>
</template>

<script setup lang='ts'>
import jsQR from 'jsqr'

interface QrScanerProps {
  continue?: boolean;
  exact?: string;
  size?: string;
  definition?: boolean;
}

const props = withDefaults(defineProps<QrScanerProps>(), {
  continue: false,
  exact: 'environment',
  size: 'whole',
  definition: true
})

const cmpData = reactive({
  windowWidth: 0,
  windowHeight: 0,
  video: null as HTMLVideoElement | null,
  canvas2d: null as CanvasRenderingContext2D | null,
  canvas2d2: null as CanvasRenderingContext2D | null,
  canvasWidth: 200,
  canvasHeight: 200,
  maskWidth: 0,
  maskHeight: 0,
  inter: 0,

  track: null as MediaStreamTrack | null,
  isUseTorch: false,
  trackStatus: false,

  isParse: false,
  isUse: true
})

const openScan = () => {
  const videoParam = {
    audio: false,
    video: true
    // video: {
    //     facingMode: { exact: props.exact },
    //     width,
    //     height
    // }
  }
  navigator.mediaDevices
    .getUserMedia(videoParam)
    .then(stream => {
      cmpData.video = document.createElement('video')

      const canvas = document.createElement('canvas')
      canvas.id = 'canvas'
      canvas.width = transtion(cmpData.canvasWidth)
      canvas.height = transtion(cmpData.canvasHeight)
      // @ts-ignore
      canvas.style = 'position:absolute;top:0;'
      // canvas.style = 'display:none;'
      cmpData.canvas2d = canvas.getContext('2d')

      const canvasBox = document.querySelector('.canvasBox')
      canvasBox?.append(cmpData.video)
      canvasBox?.append(canvas)

      const canvas2 = document.createElement('canvas')
      canvas2.id = 'canvas2'
      canvas2.width = cmpData.canvasWidth
      canvas2.height = cmpData.canvasHeight
      // @ts-ignore
      canvas2.style = 'position: absolute;top: 50%;left: 50%;z-index: 20;transform: translate(-50%, -50%);'
      cmpData.canvas2d2 = canvas2.getContext('2d')
      canvasBox?.append(canvas2)

      cmpData.video.srcObject = stream
      cmpData.video.setAttribute('playsinline', 'true')
      cmpData.video.play()
      tick()
      // @ts-ignore
      cmpData.track = stream.getVideoTracks()[0]
      setTimeout(() => {
        // @ts-ignore
        cmpData.isUseTorch = cmpData.track?.getCapabilities().torch || null
      }, 500)
    })
    .catch(err => {
      console.log(err);

      cmpData.isUse = false
      // cmpData.$emit('error', err)
    })
}

const closeCamera = () => {
  cmpData.isParse = false
  if (cmpData.video && cmpData.video.srcObject) {
    // @ts-ignore
    cmpData.video.srcObject.getTracks().forEach(track => {
      track.stop()
    })
  }
}

const tick = () => {
  if (!cmpData.isParse) return
  if (cmpData.video?.readyState === cmpData.video?.HAVE_ENOUGH_DATA) {
    cmpData.canvas2d?.drawImage(
      cmpData.video!,
      cmpData.maskWidth * 4.8,
      cmpData.maskHeight * 0.8,
      transtion(200),
      transtion(200),
      0,
      0,
      transtion(cmpData.canvasWidth),
      transtion(cmpData.canvasHeight)
    )

    const imageData = cmpData.canvas2d?.getImageData(
      0,
      0,
      transtion(cmpData.canvasWidth),
      transtion(cmpData.canvasHeight)
    )

    const code = jsQR(imageData!.data, imageData!.width, imageData!.height, {
      inversionAttempts: 'dontInvert'
    })

    cmpData.canvas2d2?.clearRect(0, 0, cmpData.canvasWidth, cmpData.canvasHeight)

    if (code) {
      drawLine(code.location.topLeftCorner, code.location.topRightCorner)
      drawLine(code.location.topRightCorner, code.location.bottomRightCorner)
      drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner)
      drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner)
      if (code.data) {
        getData(code.data)
      }
    }
  }
  requestAnimationFrame(tick)
}
const drawLine = (begin: any, end: any, color = '#FF3B58') => {
  cmpData.canvas2d2!.beginPath()
  cmpData.canvas2d2!.moveTo(nutranstion(begin.x), nutranstion(begin.y))
  cmpData.canvas2d2!.lineTo(nutranstion(end.x), nutranstion(end.y))
  cmpData.canvas2d2!.lineWidth = 4
  cmpData.canvas2d2!.strokeStyle = color
  cmpData.canvas2d2!.stroke()
}

const getData = (data: any) => {
  // cmpData.$emit('success', data)
  console.log(data);

  if (!props.continue) {
    closeCamera()
  }
}

const openTrack = () => {
  cmpData.trackStatus = !cmpData.trackStatus
  cmpData.track?.applyConstraints({
    // @ts-ignore
    advanced: [{ torch: cmpData.trackStatus }]
  })
}

const createMsk = () => {
  cmpData.maskWidth = cmpData.windowWidth / 2 - cmpData.canvasWidth / 2
  cmpData.maskHeight = cmpData.windowHeight / 2 - cmpData.canvasHeight / 2
}

const transtion = (number: number) => {
  return props.definition ? number * 2.8 : number * 1.8
}
const nutranstion = (number: number) => {
  return props.definition ? number / 2.8 : number / 1.8
}

onMounted(() => {
  // if (origin.indexOf('https') === -1) throw

  cmpData.windowWidth = document.documentElement.clientWidth || document.body.clientWidth
  cmpData.windowHeight = document.documentElement.clientHeight || document.body.clientHeight
  cmpData.windowHeight = props.size === 'whole' ? cmpData.windowHeight : cmpData.windowHeight / 2
  cmpData.isParse = true

  nextTick(() => {
    createMsk()
    openScan()
  })
})

onUnmounted(() => {
  closeCamera();
})

</script>

<style lang='scss' scoped>
.canvasBox {
  width: 100vw;
  height: 100%;
  position: relative;

  background-image: linear-gradient(0deg,
      transparent 24%,
      rgba(32, 255, 77, 0.1) 25%,
      rgba(32, 255, 77, 0.1) 26%,
      transparent 27%,
      transparent 74%,
      rgba(32, 255, 77, 0.1) 75%,
      rgba(32, 255, 77, 0.1) 76%,
      transparent 77%,
      transparent),
    linear-gradient(90deg,
      transparent 24%,
      rgba(32, 255, 77, 0.1) 25%,
      rgba(32, 255, 77, 0.1) 26%,
      transparent 27%,
      transparent 74%,
      rgba(32, 255, 77, 0.1) 75%,
      rgba(32, 255, 77, 0.1) 76%,
      transparent 77%,
      transparent);
  background-size: 3rem 3rem;
  background-position: -1rem -1rem;
  z-index: 10;
  background-color: #1110;
}

.box {
  width: 200px;
  height: 200px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  border: 0.1rem solid rgba(0, 255, 51, 0.2);
  z-index: 11;
}

.line {
  height: calc(100% - 2px);
  width: 100%;
  background: linear-gradient(180deg, rgba(0, 255, 51, 0) 43%, #00ff33 211%);
  border-bottom: 3px solid #00ff33;
  transform: translateY(-100%);
  animation: radar-beam 2s infinite alternate;
  animation-timing-function: cubic-bezier(0.53, 0, 0.43, 0.99);
  animation-delay: 1.4s;
}

.box:after,
.box:before,
.angle:after,
.angle:before {
  content: '';
  display: block;
  position: absolute;
  width: 3vw;
  height: 3vw;
  z-index: 12;
  border: 0.2rem solid transparent;
}

.box:after,
.box:before {
  top: 0;
  border-top-color: #00ff33;
}

.angle:after,
.angle:before {
  bottom: 0;
  border-bottom-color: #00ff33;
}

.box:before,
.angle:before {
  left: 0;
  border-left-color: #00ff33;
}

.box:after,
.angle:after {
  right: 0;
  border-right-color: #00ff33;
}

@keyframes radar-beam {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(0);
  }
}

.msg {
  text-align: center;
  padding: 20rpx 0;
}

.box2 {
  width: 300px;
  height: 200px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
}

.track {
  position: absolute;
  bottom: -100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mask {
  position: absolute;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.55);
}

.mask1 {
  top: 0;
  left: 0;
  right: 0;
}

.mask2 {
  right: 0;
}

.mask3 {
  right: 0;
  left: 0;
  bottom: 0;
}

.mask4 {
  left: 0;
}

.error {
  color: #fff;
  padding: 40rpx;
  font-size: 24rpx;
  background-color: #333333;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 550rpx;
  border-radius: 20rpx;
}

.error .on1 {
  font-size: 30rpx;
}

video {
  width: 100%;
  height: 100%;
}
</style>