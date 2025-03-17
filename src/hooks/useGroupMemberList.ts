import useConversationStore from '@/store/modules/conversation'
import { feedbackToast } from '@/utils/common'
import { IMSDK } from '@/utils/imCommon'
import { CbEvents } from '@openim/wasm-client-sdk'
import type { GroupMemberItem, WSEvent } from '@openim/wasm-client-sdk/lib/types/entity'

const conversationStore = useConversationStore()

export type FetchStateType = {
  offset: number
  searchOffset: number
  count: number
  loading: boolean
  hasMore: boolean
  groupMemberList: GroupMemberItem[]
}

export default function useGroupMemberList(groupID?: string, needRefresh = false) {
  const { t } = useI18n()

  const fetchState = reactive<FetchStateType>({
    offset: 0,
    searchOffset: 0,
    count: 500,
    loading: false,
    hasMore: true,
    groupMemberList: [],
  })

  const getMemberData = () => {
    fetchState.loading = true
    IMSDK.getGroupMemberList({
      groupID: groupID ?? conversationStore.storeCurrentGroupInfo.groupID,
      offset: fetchState.offset,
      count: 500,
      filter: 0,
    })
      .then(({ data }) => {
        fetchState.groupMemberList = [...fetchState.groupMemberList, ...data]
        fetchState.hasMore = data.length === 500
        fetchState.offset += 500
        console.log(fetchState.groupMemberList)
      })
      .catch((error) =>
        feedbackToast({
          message: t('getMemberFailed'),
          error,
        }),
      )
      .finally(() => (fetchState.loading = false))
  }

  const groupMemberInfoChangedHandler = ({ data }: WSEvent<GroupMemberItem>) => {
    const member = data
    if (member.groupID === fetchState.groupMemberList[0]?.groupID) {
      const idx = fetchState.groupMemberList.findIndex(
        (item) => item.userID === member.userID,
      )
      fetchState.groupMemberList[idx] = { ...member }
    }
  }

  const groupMemberCountHandler = ({ data }: any) => {
    if (!needRefresh) {
      return
    }
    const member = data
    if (member.groupID === fetchState.groupMemberList[0]?.groupID) {
      fetchState.offset = 0
      fetchState.groupMemberList = []
      setTimeout(() => {
        getMemberData()
      }, 200)
    }
  }

  const setIMListener = () => {
    IMSDK.on(CbEvents.OnGroupMemberInfoChanged, groupMemberInfoChangedHandler)
    IMSDK.on(CbEvents.OnGroupMemberAdded, groupMemberCountHandler)
    IMSDK.on(CbEvents.OnGroupMemberDeleted, groupMemberCountHandler)
  }

  const disposeIMListener = () => {
    IMSDK.off(CbEvents.OnGroupMemberInfoChanged, groupMemberInfoChangedHandler)
    IMSDK.off(CbEvents.OnGroupMemberAdded, groupMemberCountHandler)
    IMSDK.off(CbEvents.OnGroupMemberDeleted, groupMemberCountHandler)
  }

  onMounted(() => {
    setIMListener()
  })

  onUnmounted(() => {
    disposeIMListener()
  })

  watch(
    () => conversationStore.storeCurrentGroupInfo.groupID,
    (newVal) => {
      if (newVal) {
        fetchState.groupMemberList = []
        fetchState.offset = 0
        fetchState.loading = false
        fetchState.hasMore = true
        getMemberData()
      }
    },
    {
      immediate: true,
    },
  )

  return {
    fetchState,
    getMemberData,
  }
}
