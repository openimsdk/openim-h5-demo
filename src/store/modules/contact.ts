import { IMSDK } from "@/utils/imCommon";
import {
  FriendItem,
  GroupItem,
  BlackItem,
  FriendApplicationItem,
  GroupApplicationItem,
  TotalUserStruct,
  GroupMemberItem,
  PublicUserItem,
} from "open-im-sdk-wasm/lib/types/entity";
import { defineStore } from "pinia";
import store from "../index";
import { feedbackToast } from "@/utils/common";
import router from "@/router";

interface StateType {
  friendList: FriendItem[];
  groupList: GroupItem[];
  blackList: BlackItem[];
  recvFriendApplicationList: FriendApplicationItem[];
  sendFriendApplicationList: FriendApplicationItem[];
  recvGroupApplicationList: GroupApplicationItem[];
  sendGroupApplicationList: GroupApplicationItem[];
  userCardData: UserCardData;
}

export interface UserCardData {
  baseInfo?: FriendItem & PublicUserItem;
  groupMemberInfo?: GroupMemberItem;
}

const useStore = defineStore("contact", {
  state: (): StateType => ({
    friendList: [],
    groupList: [],
    blackList: [],
    recvFriendApplicationList: [],
    sendFriendApplicationList: [],
    recvGroupApplicationList: [],
    sendGroupApplicationList: [],
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
    storeUserCardData: (store) => store.userCardData,
  },
  actions: {
    async getFriendListFromReq() {
      try {
        const { data } = await IMSDK.getFriendList();
        this.friendList = data.map((user: TotalUserStruct) => user.friendInfo);
      } catch (error) {
        console.error(error);
      }
    },
    updateFriendList(item: FriendItem, isRemove = false) {
      const idx = this.friendList.findIndex(
        (friend: FriendItem) => friend.userID === item.userID
      );
      if (idx !== -1) {
        if (isRemove) {
          this.friendList.splice(idx, 1);
          return;
        }
        this.friendList[idx] = { ...item };
      }

      if (item.userID === this.userCardData.baseInfo?.userID) {
        this.userCardData.baseInfo = { ...item };
      }
    },
    pushNewFriend(item: FriendItem) {
      this.friendList.push(item);
    },
    async getGroupListFromReq() {
      try {
        const { data } = await IMSDK.getJoinedGroupList();
        this.groupList = data;
      } catch (error) {
        console.error(error);
      }
    },
    updateGroupList(item: GroupItem, isRemove = false) {
      const idx = this.groupList.findIndex(
        (group: GroupItem) => group.groupID === item.groupID
      );
      if (idx !== -1) {
        if (isRemove) {
          this.groupList.splice(idx, 1);
          return;
        }
        this.groupList[idx] = { ...item };
      }
    },
    pushNewGroup(item: GroupItem) {
      this.groupList.push(item);
    },
    async getBlackListFromReq() {
      try {
        const { data } = await IMSDK.getBlackList();
        this.blackList = data;
      } catch (error) {
        console.error(error);
      }
    },
    updateBlackList(item: BlackItem, isRemove = false) {
      const idx = this.blackList.findIndex(
        (user: BlackItem) => user.userID === item.userID
      );
      if (idx !== -1) {
        if (isRemove) {
          this.blackList.splice(idx, 1);
          return;
        }
        this.blackList[idx] = { ...item };
      }
    },
    pushNewBlack(item: BlackItem) {
      this.blackList.push(item);
    },
    async getRecvFriendApplicationListFromReq() {
      try {
        const { data } = await IMSDK.getRecvFriendApplicationList();
        this.recvFriendApplicationList = data;
      } catch (error) {
        console.error(error);
      }
    },
    updateRecvFriendApplicationList(item: FriendApplicationItem) {
      const idx = this.recvFriendApplicationList.findIndex(
        (application: FriendApplicationItem) =>
          application.fromUserID === item.fromUserID
      );
      if (idx !== -1) {
        this.recvFriendApplicationList[idx] = { ...item };
      }
    },
    pushNewRecvFriendApplication(item: FriendApplicationItem) {
      const idx = this.recvFriendApplicationList.findIndex(
        (application) => application.fromUserID === item.fromUserID
      );
      if (idx > -1) {
        this.recvFriendApplicationList[idx] = { ...item };
      } else {
        this.recvFriendApplicationList.push(item);
      }
    },
    async getSendFriendApplicationListFromReq() {
      try {
        const { data } = await IMSDK.getSendFriendApplicationList();
        this.sendFriendApplicationList = data;
      } catch (error) {
        console.error(error);
      }
    },
    updateSendFriendApplicationList(item: FriendApplicationItem) {
      const idx = this.sendFriendApplicationList.findIndex(
        (application: FriendApplicationItem) =>
          application.toUserID === item.toUserID
      );
      if (idx !== -1) {
        this.sendFriendApplicationList[idx] = { ...item };
      }
    },
    pushNewSendFriendApplication(item: FriendApplicationItem) {
      const idx = this.sendFriendApplicationList.findIndex(
        (application) => application.toUserID === item.toUserID
      );
      if (idx > -1) {
        this.sendFriendApplicationList[idx] = { ...item };
      } else {
        this.sendFriendApplicationList.push(item);
      }
    },
    async getRecvGroupApplicationListFromReq() {
      try {
        const { data } = await IMSDK.getRecvGroupApplicationList();
        this.recvGroupApplicationList = data;
      } catch (error) {
        console.error(error);
      }
    },
    updateRecvGroupApplicationList(item: GroupApplicationItem) {
      const idx = this.recvGroupApplicationList.findIndex(
        (application: GroupApplicationItem) =>
          application.userID === item.userID
      );
      if (idx !== -1) {
        this.recvGroupApplicationList[idx] = { ...item };
      }
    },
    pushNewRecvGroupApplication(item: GroupApplicationItem) {
      const idx = this.recvGroupApplicationList.findIndex(
        (application) => application.userID === item.userID
      );
      if (idx > -1) {
        this.recvGroupApplicationList[idx] = { ...item };
      } else {
        this.recvGroupApplicationList.push(item);
      }
    },
    async getSendGroupApplicationListFromReq() {
      try {
        const { data } = await IMSDK.getSendGroupApplicationList();
        this.sendGroupApplicationList = data;
      } catch (error) {
        console.error(error);
      }
    },
    updateSendGroupApplicationList(item: GroupApplicationItem) {
      const idx = this.sendGroupApplicationList.findIndex(
        (application: GroupApplicationItem) =>
          application.groupID === item.groupID
      );
      if (idx !== -1) {
        this.sendGroupApplicationList[idx] = { ...item };
      }
    },
    pushNewSendGroupApplication(item: GroupApplicationItem) {
      const idx = this.sendGroupApplicationList.findIndex(
        (application) => application.groupID === item.groupID
      );
      if (idx > -1) {
        this.sendGroupApplicationList[idx] = { ...item };
      } else {
        this.sendGroupApplicationList.push(item);
      }
    },
    setUserCardData(data: UserCardData) {
      this.userCardData = { ...data };
      router.push("userCard");
    },
    updateUserCardMemberInfo(item: GroupMemberItem) {
      if (
        item.userID !== this.userCardData.groupMemberInfo?.userID ||
        item.groupID !== this.userCardData.groupMemberInfo?.groupID
      )
        return;
      this.userCardData.groupMemberInfo = { ...item };
    },
    async getUserCardData(sourceID: string, groupID?: string) {
      let baseInfo: (FriendItem & PublicUserItem) | undefined;
      let groupMemberInfo: GroupMemberItem | undefined;
      baseInfo = this.friendList.find((item) => item.userID === sourceID);
      if (!baseInfo) {
        const { data } = await IMSDK.getUsersInfo([sourceID]);
        baseInfo = data[0]?.friendInfo ?? data[0]?.publicInfo;
      }
      if (groupID) {
        const { data } = await IMSDK.getGroupMembersInfo({
          groupID,
          userIDList: [sourceID],
        });
        groupMemberInfo = data[0];
      }
      this.userCardData = {
        baseInfo,
        groupMemberInfo,
      };
      if (!baseInfo) {
        feedbackToast({
          error: "获取用户信息失败！",
          message: "获取用户信息失败！",
        });
        return;
      }
      router.push("userCard");
    },
  },
});

export default function useContactStore() {
  return useStore(store);
}
