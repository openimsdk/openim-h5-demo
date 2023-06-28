import useConversationStore from "@/store/modules/conversation";
import { feedbackToast } from "@/utils/common";
import { IMSDK } from "@/utils/imCommon";
import { CbEvents } from "open-im-sdk-wasm/lib/constant";
import { GroupMemberItem, WSEvent } from "open-im-sdk-wasm/lib/types/entity";

const conversationStore = useConversationStore();

export type FetchStateType = {
  offset: number;
  count: number;
  loading: boolean;
  hasMore: boolean;
  groupMemberList: GroupMemberItem[];
};

export default function useGroupMemberList(
  groupID?: string,
  needRefresh = false
) {
  const { t } = useI18n();

  const fetchState = reactive<FetchStateType>({
    offset: 0,
    count: 20,
    loading: false,
    hasMore: true,
    groupMemberList: [],
  });

  const getMemberData = () => {
    fetchState.loading = true;
    IMSDK.getGroupMemberList({
      groupID: groupID ?? conversationStore.storeCurrentGroupInfo.groupID,
      offset: fetchState.offset,
      count: 20,
      filter: 0,
    })
      .then(({ data }) => {
        fetchState.groupMemberList = [...fetchState.groupMemberList, ...data];
        fetchState.hasMore = data.length === fetchState.count;
        fetchState.offset += 20;
        console.log(fetchState.groupMemberList);
      })
      .catch((error) =>
        feedbackToast({
          message: t("getMemberFailed"),
          error,
        })
      )
      .finally(() => (fetchState.loading = false));
  };

  const groupMemberInfoChangedHandler = ({ data }: any) => {
    const member = JSON.parse(data as string);
    if (member.groupID === fetchState.groupMemberList[0]?.groupID) {
      const idx = fetchState.groupMemberList.findIndex(
        (item) => item.userID === member.userID
      );
      fetchState.groupMemberList[idx] = { ...member };
    }
  };

  const groupMemberCountHandler = ({ data }: any) => {
    if (!needRefresh) {
      return;
    }
    const member = JSON.parse(data);
    if (member.groupID === fetchState.groupMemberList[0]?.groupID) {
      fetchState.offset = 0;
      fetchState.groupMemberList = [];
      getMemberData();
    }
  };

  const setIMListener = () => {
    IMSDK.on(CbEvents.ONGROUPMEMBERINFOCHANGED, groupMemberInfoChangedHandler);
    IMSDK.on(CbEvents.ONGROUPMEMBERADDED, groupMemberCountHandler);
    IMSDK.on(CbEvents.ONGROUPMEMBERDELETED, groupMemberCountHandler);
  };

  const disposeIMListener = () => {
    IMSDK.off(CbEvents.ONGROUPMEMBERINFOCHANGED, groupMemberInfoChangedHandler);
    IMSDK.off(CbEvents.ONGROUPMEMBERADDED, groupMemberCountHandler);
    IMSDK.off(CbEvents.ONGROUPMEMBERDELETED, groupMemberCountHandler);
  };

  onMounted(() => {
    setIMListener();
  });

  onUnmounted(() => {
    disposeIMListener();
  });

  watch(
    () => conversationStore.storeCurrentGroupInfo.groupID,
    (newVal) => {
      if (newVal) {
        fetchState.groupMemberList = [];
        fetchState.offset = 0;
        fetchState.loading = false;
        fetchState.hasMore = true;
        getMemberData();
      }
    },
    {
      immediate: true,
    }
  );

  return {
    fetchState,
    getMemberData,
  };
}
