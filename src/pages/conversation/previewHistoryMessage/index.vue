<template>
    <div class="page_container !bg-white">
        <NavBar :title="pageState.conversationName" />
        <div class="flex-1 overflow-hidden relative">
            <virtual-list ref="vsl" class="my_scrollbar h-full overflow-y-auto" :data-key="'clientMsgID'" :keeps="50"
                :data-sources="loadState.renderData" :topThreshold="160" :bottomThreshold="160"
                :data-component="(message: MessageItem) => TipTypes.includes(message.contentType) ? SystemNotificationItem : MessageItemVue"
                :extra-props="(message:MessageItem)=>({
                        isPreView: true,
                        isActive: message.clientMsgID === jumpMessage.clientMsgID
                    })" :estimate-size="84" @totop="onTotop" @tobottom="onToBottom" @resized="onItemRendered">
                <template #header>
                    <!-- <div v-if="overflow && !historyMessageInitLoading" class="pt-2">
          <div class="spinner" v-show="messageStore.getHistoryMessageLoading"></div>
          <div class="finished" v-show="!messageStore.getHistoryMessageHasMore">
            {{$t("noMore")}}
          </div>
        </div> -->
                </template>
            </virtual-list>
            <div v-show="loadState.initLoading"
                class="!absolute top-0 h-full w-full flex justify-center items-center bg-white">
                <van-loading type="spinner" />
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { TipTypes } from '@/constants/enum';
import { IMSDK } from '@/utils/imCommon';
import VirtualList from '@components/VirtualList';
import MessageItemVue from '@pages/conversation/chat/components/MessageItem/MessageItem.vue';
import SystemNotificationItem from '@pages/conversation/chat/components/SystemNotificationItem.vue';
import { MessageItem } from 'open-im-sdk-wasm/lib/types/entity';

interface PageState {
    conversationID: string;
    conversationName: string;
}

const pageState: PageState = history.state
const jumpMessage = JSON.parse(history.state.jumpMessage)

const loadState = reactive({
    renderData: [] as MessageItem[],
    initLoading: true,
    initLockFlag: false,
    lastMinSeq: 0,
    jumpMessageIDList: [],
    topHasMore: true,
    topLoading: false,
    bottomHasMore: true,
    bottomLoading: false
})
const vsl = ref()

const initMessageData = () => {
    const options = {
        conversationID: pageState.conversationID,
        userID: "",
        groupID: "",
        count: 20,
        startClientMsgID: jumpMessage.clientMsgID,
        lastMinSeq: jumpMessage.seq,
    }
    const promiseArr = [IMSDK.getAdvancedHistoryMessageList(options), IMSDK.getHistoryMessageListReverse(options)]
    Promise.all(promiseArr).then(res => {
        loadState.renderData = [...res[0].data.messageList, jumpMessage, ...res[1].data]
        loadState.topHasMore = res[0].data.messageList.length === 20
        loadState.bottomHasMore = res[1].data.length === 20
        loadState.lastMinSeq = res[0].data.lastMinSeq
        loadState.jumpMessageIDList = res[0].data.messageList.map((m: MessageItem) => m.clientMsgID)
        console.log(res[1].data);
        
    }).catch(() => loadState.initLoading = false)
}

const onTotop = () => {
    if (loadState.topLoading || !loadState.topHasMore) {
        return
    }
    loadState.topLoading = true
    const options = {
        conversationID: pageState.conversationID,
        userID: "",
        groupID: "",
        count: 20,
        startClientMsgID: loadState.renderData[0].clientMsgID,
        lastMinSeq: loadState.lastMinSeq,
    }
    IMSDK.getAdvancedHistoryMessageList(options)
        .then(({
            data
        }) => {
            loadState.renderData = [...data.messageList, ...loadState.renderData]
            loadState.topHasMore = data.messageList.length === 20
            loadState.lastMinSeq = data.lastMinSeq
            setTimeout(() => getOffset(data.messageList.map((m:MessageItem)=>m.clientMsgID), () => loadState.topLoading = false))
        }).finally(() => loadState.topLoading = false)
}

const onToBottom = () => {
    if (loadState.bottomLoading || !loadState.bottomHasMore) {
        return
    }
    loadState.bottomLoading = true
    const options = {
        conversationID: pageState.conversationID,
        userID: "",
        groupID: "",
        count: 20,
        startClientMsgID: loadState.renderData[loadState.renderData.length - 1].clientMsgID,
    }
    IMSDK.getHistoryMessageListReverse(options)
        .then(({
            data
        }) => {
            loadState.renderData = [...loadState.renderData, ...data]
            loadState.bottomHasMore = data.length === 20
            setTimeout(() => getOffset(data.map((m:MessageItem)=>m.clientMsgID), () => loadState.bottomLoading = false))
        }).finally(() => loadState.bottomLoading = false)
}

const onItemRendered = () => {
    if (!vsl.value || !loadState.initLoading || loadState.initLockFlag) {
        return;
    }
    const els = Array.from(document.querySelectorAll(".need_preload_message"));
    const idx = els.findIndex((el) => el.clientHeight < 2);

    if (idx === -1) {
        loadState.initLockFlag = true
        setTimeout(() => getOffset(loadState.jumpMessageIDList, () => loadState.initLoading = false))
    }
}

const getOffset = (clientMsgIDList: string[], callback: () => void) => {
    const offset = clientMsgIDList.reduce((previousValue, currentSid) => {
        const previousSize =
            typeof previousValue === "string"
                ? (vsl.value.getSize(previousValue) ?? 0)
                : previousValue;
        return previousSize + vsl.value.getSize(currentSid);
    });
    setVirtualListToOffset(Number(offset), callback);
};

const setVirtualListToOffset = (offset: number, callback: () => void) => {
    if (vsl.value) {
        vsl.value.scrollToOffset(offset);
        nextTick(() => callback());
    }
};

onMounted(() => {
    initMessageData()
})

</script>

<style lang='scss' scoped></style>