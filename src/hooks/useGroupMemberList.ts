import useConversationStore from "@/store/modules/conversation";
import { feedbackToast } from "@/utils/common";
import { IMSDK } from "@/utils/imCommon";
import { CbEvents } from "@/utils/open-im-sdk-wasm/constant";
import { GroupMemberItem, WSEvent } from "@/utils/open-im-sdk-wasm/types/entity";

const conversationStore = useConversationStore();

export type FetchStateType = {
  offset: number;
  searchOffset: number;
  count: number;
  loading: boolean;
  hasMore: boolean;
  groupMemberList: GroupMemberItem[];
  searchMemberList: GroupMemberItem[];
};

export default function useGroupMemberList(
  groupID?: string,
  needRefresh = false
) {
  const { t } = useI18n();

  const fetchState = reactive<FetchStateType>({
    offset: 0,
    searchOffset: 0,
    count: 20,
    loading: false,
    hasMore: true,
    groupMemberList: [],
    searchMemberList: [],
  });

  const searchMember = (keyword: string) => {
    fetchState.loading = true;
    IMSDK.searchGroupMembers<GroupMemberItem[]>({
      groupID: groupID ?? conversationStore.storeCurrentGroupInfo.groupID,
      offset: fetchState.searchOffset,
      count: 20,
      keywordList: [keyword],
      isSearchMemberNickname: true,
      isSearchUserID: false,
    })
      .then(({ data }) => {
        fetchState.searchMemberList = [...fetchState.searchMemberList, ...data];
        fetchState.hasMore = data.length === fetchState.count;
        fetchState.searchOffset += 20;
        console.log(fetchState.searchMemberList);
      })
      .catch((error) =>
        feedbackToast({
          message: t("getMemberFailed"),
          error,
        })
      )
      .finally(() => (fetchState.loading = false));
  };

  const getMemberData = () => {
    fetchState.loading = true;
    IMSDK.getGroupMemberList<GroupMemberItem[]>({
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
    const member = data;
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
    const member = data;
    if (member.groupID === fetchState.groupMemberList[0]?.groupID) {
      fetchState.offset = 0;
      fetchState.groupMemberList = [];
      getMemberData();
    }
  };

  const setIMListener = () => {
    IMSDK.on(CbEvents.OnGroupMemberInfoChanged, groupMemberInfoChangedHandler);
    IMSDK.on(CbEvents.OnGroupMemberAdded, groupMemberCountHandler);
    IMSDK.on(CbEvents.OnGroupMemberDeleted, groupMemberCountHandler);
  };

  const disposeIMListener = () => {
    IMSDK.off(CbEvents.OnGroupMemberInfoChanged, groupMemberInfoChangedHandler);
    IMSDK.off(CbEvents.OnGroupMemberAdded, groupMemberCountHandler);
    IMSDK.off(CbEvents.OnGroupMemberDeleted, groupMemberCountHandler);
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
    searchMember,
  };
}
