import { ref, onUnmounted, watch } from 'vue'
import {
  Room,
  MediaDeviceFailure,
  RoomEvent,
  ConnectionState,
  RoomConnectOptions,
  AudioCaptureOptions,
  RoomOptions,
  ScreenShareCaptureOptions,
  VideoCaptureOptions,
} from 'livekit-client'
import { log, setupLiveKitRoom } from '@livekit/components-core'

interface RefConfig {
  serverUrl: string | undefined
  token: string | undefined
  audio?: AudioCaptureOptions | boolean
  video?: VideoCaptureOptions | boolean
  screen?: ScreenShareCaptureOptions | boolean
  connect: boolean
}

export interface LiveKitRoomProps {
  refConfig: RefConfig
  options?: RoomOptions
  connectOptions?: RoomConnectOptions
  onConnected?: () => void
  onDisconnected?: () => void
  onError?: (error: Error) => void
  onMediaDeviceFailure?: (failure?: MediaDeviceFailure) => void
  onEncryptionError?: (error: Error) => void
  room?: Room
  simulateParticipants?: number | undefined
}

export function useRoom(props: LiveKitRoomProps) {
  const room = ref<Room | undefined>()
  const htmlProps = ref({})

  const {
    options,
    room: passedRoom,
    connectOptions,
    onConnected,
    onDisconnected,
    onError,
    onMediaDeviceFailure,
    onEncryptionError,
    simulateParticipants,
  } = props

  // const connectRef = toRef(props, "connect");

  const onSignalConnected = () => {
    console.log('onSignalConnected')

    const localP = room.value?.localParticipant

    log.debug('trying to publish local tracks')
    Promise.all([
      localP?.setMicrophoneEnabled(
        !!props.refConfig.audio,
        typeof props.refConfig.audio !== 'boolean' ? props.refConfig.audio : undefined,
      ),
      localP?.setCameraEnabled(
        !!props.refConfig.video,
        typeof props.refConfig.video !== 'boolean' ? props.refConfig.video : undefined,
      ),
      localP?.setScreenShareEnabled(
        !!props.refConfig.screen,
        typeof props.refConfig.screen !== 'boolean'
          ? props.refConfig.screen
          : undefined,
      ),
    ]).catch((e) => {
      log.warn(e)
      onError?.(e)
    })
  }

  const handleMediaDeviceError = (e: Error) => {
    const mediaDeviceFailure = MediaDeviceFailure.getFailure(e)
    onMediaDeviceFailure?.(mediaDeviceFailure)
  }

  const handleEncryptionError = (e: Error) => {
    onEncryptionError?.(e)
  }

  const connectionStateChangeListener = (state: ConnectionState) => {
    switch (state) {
      case ConnectionState.Disconnected:
        onDisconnected?.()
        break
      case ConnectionState.Connected:
        onConnected?.()
        break
      default:
        break
    }
  }

  watch(
    props.refConfig,
    (newConfig) => {
      room.value = passedRoom ?? new Room(options)

      const { className } = setupLiveKitRoom()
      htmlProps.value = { className }

      if (!room.value) return

      room.value
        .on(RoomEvent.SignalConnected, onSignalConnected)
        .on(RoomEvent.MediaDevicesError, handleMediaDeviceError)
        .on(RoomEvent.EncryptionError, handleEncryptionError)
        .on(RoomEvent.ConnectionStateChanged, connectionStateChangeListener)

      if (simulateParticipants) {
        room.value.simulateParticipants({
          participants: {
            count: simulateParticipants,
          },
          publish: {
            audio: true,
            useRealTracks: true,
          },
        })
      }

      if (!newConfig.token) {
        log.debug('no token yet')
        return
      }

      if (!newConfig.serverUrl) {
        log.warn('no livekit url provided')
        onError?.(Error('no livekit url provided'))
        return
      }

      if (newConfig.connect) {
        log.debug('connecting')
        room.value
          .connect(newConfig.serverUrl, newConfig.token, connectOptions)
          .catch((e: Error) => {
            log.warn(e)
            onError?.(e)
          })
      } else {
        log.debug('disconnecting because connect is false')
        room.value.disconnect()
      }
    },
    {
      immediate: true,
    },
  )

  onUnmounted(() => {
    if (room.value) {
      log.info('disconnecting on unmount')
      room.value.disconnect()
      room.value
        .off(RoomEvent.SignalConnected, onSignalConnected)
        .off(RoomEvent.MediaDevicesError, handleMediaDeviceError)
        .off(RoomEvent.EncryptionError, handleEncryptionError)
        .off(RoomEvent.ConnectionStateChanged, connectionStateChangeListener)
    }
  })

  return room
}
