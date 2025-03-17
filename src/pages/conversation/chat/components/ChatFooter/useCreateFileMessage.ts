import { getPicInfo } from '@/utils/common'
import { v4 as uuidV4 } from 'uuid'
import { MessageType } from '@openim/wasm-client-sdk'
import { IMSDK } from '@/utils/imCommon'
import type { MessageItem } from '@openim/wasm-client-sdk/lib/types/entity'

export default function useCreateFileMessage() {
  const { t } = useI18n()

  const getFileData = (data: Blob): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.onload = function () {
        resolve(reader.result as ArrayBuffer)
      }
      reader.readAsArrayBuffer(data)
    })
  }

  const getImageMessage = async (file: File): Promise<MessageItem> => {
    const { width, height } = await getPicInfo(file)
    const baseInfo = {
      uuid: uuidV4(),
      type: file.type,
      size: file.size,
      width,
      height,
      url: URL.createObjectURL(file),
    }
    const options = {
      sourcePicture: baseInfo,
      bigPicture: baseInfo,
      snapshotPicture: baseInfo,
      sourcePath: '',
      file,
    }
    return (await IMSDK.createImageMessageByFile(options)).data
  }

  const createFileMessage = async (file: File, messageType: MessageType) => {
    switch (messageType) {
      case MessageType.PictureMessage:
        return {
          message: await getImageMessage(file),
          buffer: await getFileData(file),
        }
      default:
        return {
          error: 'message type error',
        }
    }
  }

  return {
    createFileMessage,
  }
}
