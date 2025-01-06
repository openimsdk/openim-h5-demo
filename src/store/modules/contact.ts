import { IMSDK } from '@/utils/imCommon'
import type {
  FriendUserItem,
  GroupItem,
  BlackUserItem,
  FriendApplicationItem,
  GroupApplicationItem,
  GroupMemberItem,
} from '@openim/wasm-client-sdk/lib/types/entity'
import { defineStore } from 'pinia'
import store from '../index'
import { feedbackToast } from '@/utils/common'
import router from '@/router'
import { BusinessUserInfo } from '@/api/data'
import { i18nt } from '@/i18n'
import { getBusinessInfo } from '@/api/user'

interface StateType {
  friendList: FriendUserItem[]
  groupList: GroupItem[]
  blackList: BlackUserItem[]
  recvFriendApplicationList: FriendApplicationItem[]
  sendFriendApplicationList: FriendApplicationItem[]
  recvGroupApplicationList: GroupApplicationItem[]
  sendGroupApplicationList: GroupApplicationItem[]
  unHandleFriendApplicationNum: number
  unHandleGroupApplicationNum: number
  userCardData: UserCardData
}

export interface UserCardData {
  baseInfo?: Partial<FriendUserItem & BusinessUserInfo>
  groupMemberInfo?: GroupMemberItem
}

const useStore = defineStore('contact', {
  state: (): StateType => ({
    friendList: [],
    groupList: [],
    blackList: [],
    recvFriendApplicationList: [],
    sendFriendApplicationList: [],
    recvGroupApplicationList: [],
    sendGroupApplicationList: [],
    unHandleFriendApplicationNum: 0,
    unHandleGroupApplicationNum: 0,
    userCardData: {},
  }),
  getters: {
    storeFriendList: (store) => store.friendList,
    storeGroupList: (store) => store.groupList,
    storeBlackList: (store) => store.blackList,
    storeRecvFriendApplicationList: (store) => store.recvFriendApplicationList,
    storeSendFriendApplicationList: (store) => store.sendFriendApplicationList,
    storeRecvGroupApplicationList: (store) => store.recvGroupApplicationList,
    storeSendGroupApplicationList: (store) => store.sendGroupApplicationList,
    storeUnHandleFriendApplicationNum: (store) => +store.unHandleFriendApplicationNum,
    storeUnHandleGroupApplicationNum: (store) => store.unHandleGroupApplicationNum,
    storeUserCardData: (store) => store.userCardData,
  },
  actions: {
    async getFriendListFromReq() {
      try {
        let offset = 0
        let tmpList = [] as FriendUserItem[]
        let initialFetch = true
        while (true) {
          const count = initialFetch ? 10000 : 1000
          const { data } = await IMSDK.getFriendListPage({ offset, count })
          tmpList = [...tmpList, ...data]
          offset += count
          if (data.length < count) break
          initialFetch = false
        }
        this.friendList = tmpList
      } catch (error) {
        console.error(error)
      }
    },
    updateFriendList(item: FriendUserItem, isRemove = false) {
      const idx = this.friendList.findIndex(
        (friend: FriendUserItem) => friend.userID === item.userID,
      )
      if (idx !== -1) {
        if (isRemove) {
          this.friendList.splice(idx, 1)
          return
        }
        this.friendList[idx] = { ...item }
      }

      if (item.userID === this.userCardData.baseInfo?.userID) {
        this.userCardData.baseInfo = { ...item }
      }
    },
    pushNewFriend(item: FriendUserItem) {
      this.friendList.push(item)
    },
    async getGroupListFromReq() {
      try {
        let offset = 0
        let tmpList = [] as GroupItem[]
        while (true) {
          const { data } = await IMSDK.getJoinedGroupListPage({ offset, count: 1000 })
          tmpList = [...tmpList, ...data]
          offset += 1000
          if (data.length < 1000) break
        }
        this.groupList = tmpList
      } catch (error) {
        console.error(error)
      }
    },
    updateGroupList(item: GroupItem, isRemove = false) {
      const idx = this.groupList.findIndex(
        (group: GroupItem) => group.groupID === item.groupID,
      )
      if (idx !== -1) {
        if (isRemove) {
          this.groupList.splice(idx, 1)
          return
        }
        this.groupList[idx] = { ...item }
      }
    },
    pushNewGroup(item: GroupItem) {
      this.groupList.push(item)
    },
    async getBlackListFromReq() {
      try {
        const { data } = await IMSDK.getBlackList()
        this.blackList = data
      } catch (error) {
        console.error(error)
      }
    },
    updateBlackList(item: BlackUserItem, isRemove = false) {
      const idx = this.blackList.findIndex(
        (user: BlackUserItem) => user.userID === item.userID,
      )
      if (idx !== -1) {
        if (isRemove) {
          this.blackList.splice(idx, 1)
          return
        }
        this.blackList[idx] = { ...item }
      }
    },
    pushNewBlack(item: BlackUserItem) {
      this.blackList.push(item)
    },
    async getRecvFriendApplicationListFromReq() {
      try {
        const { data } = await IMSDK.getFriendApplicationListAsRecipient()
        this.recvFriendApplicationList = data
      } catch (error) {
        console.error(error)
      }
    },
    updateRecvFriendApplicationList(item: FriendApplicationItem) {
      const idx = this.recvFriendApplicationList.findIndex(
        (application: FriendApplicationItem) =>
          application.fromUserID === item.fromUserID,
      )
      if (idx !== -1) {
        this.recvFriendApplicationList[idx] = { ...item }
      }
    },
    pushNewRecvFriendApplication(item: FriendApplicationItem) {
      const idx = this.recvFriendApplicationList.findIndex(
        (application) => application.fromUserID === item.fromUserID,
      )
      if (idx > -1) {
        this.recvFriendApplicationList[idx] = { ...item }
      } else {
        this.recvFriendApplicationList.push(item)
      }
    },
    async getSendFriendApplicationListFromReq() {
      try {
        const { data } = await IMSDK.getFriendApplicationListAsApplicant()
        this.sendFriendApplicationList = data
      } catch (error) {
        console.error(error)
      }
    },
    updateSendFriendApplicationList(item: FriendApplicationItem) {
      const idx = this.sendFriendApplicationList.findIndex(
        (application: FriendApplicationItem) => application.toUserID === item.toUserID,
      )
      if (idx !== -1) {
        this.sendFriendApplicationList[idx] = { ...item }
      }
    },
    pushNewSendFriendApplication(item: FriendApplicationItem) {
      const idx = this.sendFriendApplicationList.findIndex(
        (application) => application.toUserID === item.toUserID,
      )
      if (idx > -1) {
        this.sendFriendApplicationList[idx] = { ...item }
      } else {
        this.sendFriendApplicationList.push(item)
      }
    },
    async getRecvGroupApplicationListFromReq() {
      try {
        const { data } = await IMSDK.getGroupApplicationListAsRecipient()
        this.recvGroupApplicationList = data
      } catch (error) {
        console.error(error)
      }
    },
    updateRecvGroupApplicationList(item: GroupApplicationItem) {
      const idx = this.recvGroupApplicationList.findIndex(
        (application: GroupApplicationItem) => application.userID === item.userID,
      )
      if (idx !== -1) {
        this.recvGroupApplicationList[idx] = { ...item }
      }
    },
    pushNewRecvGroupApplication(item: GroupApplicationItem) {
      const idx = this.recvGroupApplicationList.findIndex(
        (application) => application.userID === item.userID,
      )
      if (idx > -1) {
        this.recvGroupApplicationList[idx] = { ...item }
      } else {
        this.recvGroupApplicationList.push(item)
      }
    },
    async getSendGroupApplicationListFromReq() {
      try {
        const { data } = await IMSDK.getGroupApplicationListAsApplicant()
        this.sendGroupApplicationList = data
      } catch (error) {
        console.error(error)
      }
    },
    updateSendGroupApplicationList(item: GroupApplicationItem) {
      const idx = this.sendGroupApplicationList.findIndex(
        (application: GroupApplicationItem) => application.groupID === item.groupID,
      )
      if (idx !== -1) {
        this.sendGroupApplicationList[idx] = { ...item }
      }
    },
    pushNewSendGroupApplication(item: GroupApplicationItem) {
      const idx = this.sendGroupApplicationList.findIndex(
        (application) => application.groupID === item.groupID,
      )
      if (idx > -1) {
        this.sendGroupApplicationList[idx] = { ...item }
      } else {
        this.sendGroupApplicationList.push(item)
      }
    },
    updateUnHandleFriendApplicationNum(num: number) {
      this.unHandleFriendApplicationNum = num
    },
    updateUnHandleGroupApplicationNum(num: number) {
      this.unHandleGroupApplicationNum = num
    },
    setUserCardData(data: UserCardData) {
      this.userCardData = { ...data }
      router.push('userCard')
    },
    updateUserCardMemberInfo(item: GroupMemberItem) {
      if (
        item.userID !== this.userCardData.groupMemberInfo?.userID ||
        item.groupID !== this.userCardData.groupMemberInfo?.groupID
      )
        return
      this.userCardData.groupMemberInfo = { ...item }
    },
    async getUserCardData(sourceID: string, groupID?: string) {
      let baseInfo: any
      let groupMemberInfo: GroupMemberItem | undefined
      const friendInfo = this.storeFriendList.find((item) => item.userID === sourceID)
      if (friendInfo) {
        baseInfo = { ...baseInfo, ...friendInfo }
      } else {
        const { data: res } = await IMSDK.getUsersInfo([sourceID])
        baseInfo = { ...baseInfo, ...res[0] }
      }
      const { data } = await getBusinessInfo(sourceID)
      baseInfo = { ...baseInfo, ...data.users[0] }
      if (groupID) {
        const { data } = await IMSDK.getSpecifiedGroupMembersInfo({
          groupID,
          userIDList: [sourceID],
        })
        groupMemberInfo = data[0]
      }
      this.userCardData = {
        baseInfo,
        groupMemberInfo,
      }
      if (!baseInfo) {
        feedbackToast({
          error: i18nt('messageTip.getUserInfoFailed'),
          message: i18nt('messageTip.getUserInfoFailed'),
        })
        return
      }
      router.push('userCard')
    },
    clearContactStore() {
      this.friendList = []
      this.groupList = []
      this.blackList = []
      this.recvFriendApplicationList = []
      this.sendFriendApplicationList = []
      this.recvGroupApplicationList = []
      this.sendGroupApplicationList = []
      this.unHandleFriendApplicationNum = 0
      this.unHandleGroupApplicationNum = 0
      this.userCardData = {}
    },
  },
})

export default function useContactStore() {
  return useStore(store)
}
