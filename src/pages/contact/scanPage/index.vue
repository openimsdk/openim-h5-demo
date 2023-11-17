<template>
  <div class="page_container">
    <NavBar :title="$t('scanQrCode')" />
    <qr-stream @decode="onDecode" class="mb">
      <div class="box">
        <div class="line"></div>
        <div class="angle"></div>
      </div>
    </qr-stream>
  </div>
</template>

<script setup lang='ts'>
// @ts-ignore
import { QrStream } from 'vue3-qr-reader'
import { AddFriendQrCodePrefix, AddGroupQrCodePrefix, IMSDK } from '@/utils/imCommon';
import useContactStore from '@/store/modules/contact';
import useConversationStore from '@/store/modules/conversation';
import { feedbackToast } from '@/utils/common';
import { GroupItem } from '@/utils/open-im-sdk-wasm/types/entity';

const { t } = useI18n()
const router = useRouter();
const contactStore = useContactStore();
const conversationStore = useConversationStore();

const onDecode = async (data: string) => {
  if (data.includes(AddFriendQrCodePrefix)) {
    contactStore.getUserCardData(data.replace(AddFriendQrCodePrefix, ''));
    return
  }
  if (data.includes(AddGroupQrCodePrefix)) {
    const groupID = data.replace(AddGroupQrCodePrefix, '')
    try {
      let info = contactStore.storeGroupList.find(item => item.groupID === groupID)
      if (!info) {
        const { data } = await IMSDK.getSpecifiedGroupsInfo<GroupItem[]>([groupID])
        info = data[0]
      }
      if (info) {
        conversationStore.updateCurrentGroupInfo(info)
        router.push({
          path: 'groupCard'
        })
      }
    } catch (error) { }
    return
  }

  feedbackToast({ error: t('messageTip.unknownContent'), message: t('messageTip.unknownContent') })
}

</script>

<style lang='scss' scoped>
.stream {
  max-height: 500px;
  max-width: 500px;
  margin: auto;
}

.box {
  border-style: solid;
  border-width: 2px;
  border-color: rgba(0, 255, 51, 0.2);
  height: 200px;
  width: 200px;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  margin: auto;
  overflow: hidden;
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
</style>