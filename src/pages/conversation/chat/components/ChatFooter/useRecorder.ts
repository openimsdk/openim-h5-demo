import Recorder from 'js-audio-recorder'
import { onBeforeRouteLeave } from 'vue-router'

export default function useRecorder() {
  const isRecording = ref(false)

  let recorder: Recorder | null = null

  const requestPermission = () => {
    // @ts-ignore
    return Recorder.getPermission()
  }

  const startRecord = () => {
    recorder = new Recorder()
    recorder.start().then(
      () => {
        isRecording.value = true
      },
      (error: Error) => {
        console.error(`recorder error ,${error.name}:${error.message}`)
      },
    )
  }

  const stopRcord = async () => {
    isRecording.value = false
    const blob = recorder?.getWAVBlob()
    const duration = Math.floor(recorder?.duration ?? 0)
    const size = recorder?.fileSize ?? 0
    const file = new File([blob], `${Date.now()}_record.wav`, {
      type: blob?.type,
      lastModified: Date.now(),
    })
    try {
      await destroyRecorder()
    } catch (error) {}
    return {
      file,
      duration,
      size,
    }
  }

  const cancelRecord = async () => {
    isRecording.value = false
    await destroyRecorder()
  }

  const destroyRecorder = async () => {
    if (!recorder) return
    try {
      await recorder.destroy()
    } catch (error) {
      console.error('destroyRecorder failed')
    }
    recorder = null
  }

  onBeforeRouteLeave(() => cancelRecord())

  onUnmounted(() => {
    cancelRecord()
  })

  return {
    isRecording,
    requestPermission,
    startRecord,
    stopRcord,
    cancelRecord,
  }
}
