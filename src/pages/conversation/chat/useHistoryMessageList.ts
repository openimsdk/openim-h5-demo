import useConversationStore from "@/store/modules/conversation";
import useMessageStore from "@/store/modules/message";
import emitter from "@/utils/events";
import { useThrottleFn } from "@vueuse/core";

const messageStore = useMessageStore();
const conversationStore = useConversationStore();

type UseHistoryMessageListProps = {
  cancelMultiple: () => void;
};

export default function useHistoryMessageList({
  cancelMultiple,
}: UseHistoryMessageListProps) {
  const vsl = ref();
  const overflow = ref(false);
  const isFirstPage = ref(true);
  const loadState = reactive({
    loading: false,
    lastMinSeq: 0,
  });
  const initLoading = ref(false);
  const notScroll = ref(false);

  const unReadCount = computed(
    () =>
      messageStore.storeHistoryMessageList.filter(
        (message) => message.isAppend === true
      ).length
  );

  const onScoll = useThrottleFn(() => {
    notScroll.value =
      vsl.value.getScrollSize() - vsl.value.getOffset() >
      vsl.value.getClientSize() * 1.3;
  }, 500);

  const onTotop = async () => {
    if (messageStore.storeHistoryMessageHasMore && !loadState.loading) {
      const { messageIDList } = await getMessageData();
      await nextTick();
      getOffset(messageIDList);
    }
  };

  const getMessageData = async () => {
    loadState.loading = true;
    const data = await messageStore.getHistoryMessageListFromReq({
      conversationID: conversationStore.storeCurrentConversation.conversationID,
      userID: "",
      groupID: "",
      count: 20,
      startClientMsgID:
        messageStore.storeHistoryMessageList[0]?.clientMsgID ?? "",
      lastMinSeq: isFirstPage.value ? 0 : loadState.lastMinSeq,
    });
    if (data.lastMinSeq) {
      loadState.lastMinSeq = data.lastMinSeq;
    }
    return data;
  };

  const onItemRendered = () => {
    if (!vsl.value || !isFirstPage.value) {
      return;
    }
    const els = Array.from(document.querySelectorAll(".need_preload_message"));
    const idx = els.findIndex((el) => el.clientHeight < 2);

    if (idx === -1) {
      // first page items are all mounted, scroll to bottom
      setTimeout(() => {
        setVirtualListToBottom();
        initLoading.value = false;
        loadState.loading = false;
      });
      isFirstPage.value = false;
      checkOverFlow();
    }
  };

  const getOffset = (clientMsgIDList: string[]) => {
    const offset = clientMsgIDList.reduce((previousValue, currentSid) => {
      const previousSize =
        typeof previousValue === "string" && previousValue !== 0
          ? vsl.value.getSize(previousValue)
          : previousValue;
      return previousSize + vsl.value.getSize(currentSid);
    }, 0);
    setVirtualListToOffset(Number(offset));
  };

  const setVirtualListToOffset = (offset: number) => {
    if (vsl.value) {
      vsl.value.scrollToOffset(offset);
      nextTick(() => (loadState.loading = false));
    }
  };

  const checkOverFlow = () => {
    if (vsl.value) {
      overflow.value = vsl.value.getScrollSize() > vsl.value.getClientSize();
    }
  };

  const setVirtualListToBottom = (isAppend?: boolean) => {
    if (isAppend && notScroll.value) {
      return;
    }
    if (vsl.value) {
      nextTick(() => vsl.value.scrollToBottom());
    }
  };

  const setVirtualListToIndex = (idx: number) => {
    if (vsl.value) {
      vsl.value.scrollToIndex(idx);
    }
  };

  const scroll2ClientMsgID = (clientMsgID: string) => {
    const idx = messageStore.storeHistoryMessageList.findIndex(
      (message) => message.clientMsgID === clientMsgID
    );
    if (idx > -1) {
      messageStore.storeHistoryMessageList[idx].jump = true;
      setTimeout(() => {
        messageStore.storeHistoryMessageList[idx].jump = false;
      }, 3000);
      setVirtualListToIndex(idx);
    }
  };

  const scrollToUnread = () => {
    const idx = messageStore.storeHistoryMessageList.findIndex(
      (message) => message.isAppend === true && !message.isRead
    );
    console.log(idx);

    if (idx > -1) {
      setVirtualListToIndex(idx);
    }
  };

  // events
  const setEventListener = () => {
    emitter.on("CHAT_MAIN_SCROLL_TO_BOTTOM", setVirtualListToBottom);
    emitter.on("CHAT_MAIN_SCROLL_TO_CLIENTMSGID", scroll2ClientMsgID);
  };

  const disposeEvemtListener = () => {
    emitter.off("CHAT_MAIN_SCROLL_TO_BOTTOM", setVirtualListToBottom);
    emitter.off("CHAT_MAIN_SCROLL_TO_CLIENTMSGID", scroll2ClientMsgID);
  };

  onMounted(() => {
    setEventListener();
  });
  onUnmounted(() => {
    disposeEvemtListener();
  });

  watch(
    () => conversationStore.storeCurrentConversation.conversationID,
    async (newVal) => {
      if (newVal) {
        cancelMultiple();
        isFirstPage.value = true;
        messageStore.resetHistoryMessageList();
        initLoading.value = true;
        const { messageIDList } = await getMessageData();
        if (messageIDList.length === 0) {
          isFirstPage.value = false;
          initLoading.value = false;
          loadState.loading = false;
        }
      }
    },
    {
      immediate: true,
    }
  );

  return {
    vsl,
    overflow,
    initLoading,
    loadState,
    notScroll,
    unReadCount,
    onTotop,
    onItemRendered,
    onScoll,
    scrollToUnread,
  };
}
