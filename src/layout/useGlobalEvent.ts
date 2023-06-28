import useContactStore from "@store/modules/contact";
import useConversationStore from "@store/modules/conversation";
import useUserStore from "@store/modules/user";
import { conversationSort, IMSDK } from "@/utils/imCommon";
import { CbEvents } from "open-im-sdk-wasm/lib/constant";
import {
  ConversationItem,
  GroupMemberItem,
  FriendApplicationItem,
  GroupApplicationItem,
  MessageItem,
} from "open-im-sdk-wasm/lib/types/entity";
import { MessageType, SessionType } from "open-im-sdk-wasm/lib/types/enum";
import useMessageStore, { ExMessageItem } from "@/store/modules/message";
import emitter from "@/utils/events";
import { showLoadingToast } from "vant";
import { ToastWrapperInstance } from "vant/lib/toast/types";

export function useGlobalEvent() {
  const userStore = useUserStore();
  const conversationStore = useConversationStore();
  const contactStore = useContactStore();
  const messageStore = useMessageStore();

  let syncToast: ToastWrapperInstance | null = null;

  const setIMListener = () => {
    // account
    IMSDK.on(CbEvents.ONSELFINFOUPDATED, selfUpdateHandler);
    IMSDK.on(CbEvents.ONCONNECTING, connectingHandler);
    IMSDK.on(CbEvents.ONCONNECTFAILED, connectFailedHandler);
    IMSDK.on(CbEvents.ONCONNECTSUCCESS, connectSuccessHandler);
    IMSDK.on(CbEvents.ONKICKEDOFFLINE, kickHandler);
    IMSDK.on(CbEvents.ONUSERTOKENEXPIRED, expiredHandler);
    // sync
    IMSDK.on(CbEvents.ONSYNCSERVERSTART, syncStartHandler);
    IMSDK.on(CbEvents.ONSYNCSERVERFINISH, syncFinishHandler);
    IMSDK.on(CbEvents.ONSYNCSERVERFAILED, syncFailedHandler);
    // message
    IMSDK.on(CbEvents.ONRECVNEWMESSAGE, newMessageHandler);
    IMSDK.on(CbEvents.ONRECVNEWMESSAGES, newMessageHandler);
    // conversation
    IMSDK.on(CbEvents.ONCONVERSATIONCHANGED, conversationChnageHandler);
    IMSDK.on(CbEvents.ONNEWCONVERSATION, newConversationHandler);
    IMSDK.on(
      CbEvents.ONTOTALUNREADMESSAGECOUNTCHANGED,
      totalUnreadChangeHandler
    );
    // friend
    IMSDK.on(CbEvents.ONFRIENDINFOCHANGED, friednInfoChangeHandler);
    IMSDK.on(CbEvents.ONFRIENDADDED, friednAddedHandler);
    IMSDK.on(CbEvents.ONFRIENDDELETED, friednDeletedHandler);
    // blacklist
    IMSDK.on(CbEvents.ONBLACKADDED, blackAddedHandler);
    IMSDK.on(CbEvents.ONBLACKDELETED, blackDeletedHandler);
    // group
    IMSDK.on(CbEvents.ONJOINEDGROUPADDED, joinedGroupAddedHandler);
    IMSDK.on(CbEvents.ONJOINEDGROUPDELETED, joinedGroupDeletedHandler);
    IMSDK.on(CbEvents.ONGROUPINFOCHANGED, groupInfoChangedHandler);
    IMSDK.on(CbEvents.ONGROUPMEMBERADDED, groupMemberAddedHandler);
    IMSDK.on(CbEvents.ONGROUPMEMBERDELETED, groupMemberDeletedHandler);
    IMSDK.on(CbEvents.ONGROUPMEMBERINFOCHANGED, groupMemberInfoChangedHandler);
    // application
    IMSDK.on(CbEvents.ONFRIENDAPPLICATIONADDED, friendApplicationAddedHandler);
    IMSDK.on(
      CbEvents.ONFRIENDAPPLICATIONACCEPTED,
      friendApplicationProcessedHandler
    );
    IMSDK.on(
      CbEvents.ONFRIENDAPPLICATIONREJECTED,
      friendApplicationProcessedHandler
    );
    IMSDK.on(CbEvents.ONGROUPAPPLICATIONADDED, groupApplicationAddedHandler);
    IMSDK.on(
      CbEvents.ONGROUPAPPLICATIONACCEPTED,
      groupApplicationProcessedHandler
    );
    IMSDK.on(
      CbEvents.ONGROUPAPPLICATIONREJECTED,
      groupApplicationProcessedHandler
    );
  };

  const selfUpdateHandler = ({ data }: any) => {
    const imUserInfo = JSON.parse(data);
    userStore.updateSelfInfo({
      ...imUserInfo,
      ...userStore.storeSelfInfo,
      globalRecvMsgOpt: imUserInfo.globalRecvMsgOpt,
    });
  };
  const connectingHandler = () => {};
  const connectFailedHandler = () => {};
  const connectSuccessHandler = () => {};
  const kickHandler = () => {};
  const expiredHandler = () => {};

  // sync
  const syncStartHandler = () => {
    syncToast = showLoadingToast({
      message: "同步中...",
      forbidClick: true,
    });
  };
  const syncFinishHandler = () => {
    syncToast?.close();
    syncToast = null;
  };
  const syncFailedHandler = () => {
    if (!syncToast) return;
    syncToast.message = "同步失败";
    syncToast.close();
    syncToast = null;
  };

  // message
  const newMessageHandler = ({ data }: any) => {
    if (syncToast) return;
    const parsedData = JSON.parse(data as string);
    if (Array.isArray(parsedData)) {
      parsedData.map((message) => handleNewMessage(message));
      return;
    }
    handleNewMessage(parsedData);
  };
  const handleNewMessage = (newServerMsg: ExMessageItem) => {
    if (inCurrentConversation(newServerMsg)) {
      if (newServerMsg.contentType !== MessageType.TYPINGMESSAGE) {
        messageStore.pushNewMessage(newServerMsg);
        emitter.emit("CHAT_MAIN_SCROLL_TO_BOTTOM", true);
      }
    }
  };
  const inCurrentConversation = (newServerMsg: MessageItem) => {
    switch (newServerMsg.sessionType) {
      case SessionType.Single:
        return (
          newServerMsg.sendID ===
            conversationStore.storeCurrentConversation.userID ||
          (newServerMsg.sendID === userStore.storeSelfInfo.userID &&
            newServerMsg.recvID ===
              conversationStore.storeCurrentConversation.userID)
        );
      case SessionType.Group:
      case SessionType.SuperGroup:
        return (
          newServerMsg.groupID ===
          conversationStore.storeCurrentConversation.groupID
        );
      case SessionType.Notification:
        return (
          newServerMsg.sendID ===
          conversationStore.storeCurrentConversation.userID
        );
      default:
        return false;
    }
  };

  // conversation
  const conversationChnageHandler = ({ data }: any) => {
    let filterArr: ConversationItem[] = [];
    const changes: ConversationItem[] = JSON.parse(data);
    const chids = changes.map((ch) => ch.conversationID);
    filterArr = conversationStore.storeConversationList.filter(
      (tc) => !chids.includes(tc.conversationID)
    );
    const idx = changes.findIndex(
      (c) =>
        c.conversationID ===
        conversationStore.storeCurrentConversation.conversationID
    );
    if (idx !== -1) conversationStore.updateCurrentConversation(changes[idx]);
    const result = [...changes, ...filterArr];
    conversationStore.updateConversationList(conversationSort(result));
  };
  const newConversationHandler = ({ data }: any) => {
    const news: ConversationItem[] = JSON.parse(data);
    const result = [...news, ...conversationStore.storeConversationList];
    conversationStore.updateConversationList(conversationSort(result));
  };
  const totalUnreadChangeHandler = ({ data }: any) => {
    conversationStore.updateUnReadCount(data);
  };

  // friend
  const friednInfoChangeHandler = ({ data }: any) => {
    contactStore.updateFriendList(JSON.parse(data));
  };
  const friednAddedHandler = ({ data }: any) => {
    contactStore.pushNewFriend(JSON.parse(data));
  };
  const friednDeletedHandler = ({ data }: any) => {
    contactStore.updateFriendList(JSON.parse(data), true);
  };

  // blacklist
  const blackAddedHandler = ({ data }: any) => {
    contactStore.pushNewBlack(JSON.parse(data));
  };
  const blackDeletedHandler = ({ data }: any) => {
    contactStore.updateBlackList(JSON.parse(data), true);
  };

  // group
  const joinedGroupAddedHandler = ({ data }: any) => {
    contactStore.pushNewGroup(JSON.parse(data));
  };
  const joinedGroupDeletedHandler = ({ data }: any) => {
    contactStore.updateGroupList(JSON.parse(data), true);
  };
  const groupInfoChangedHandler = ({ data }: any) => {
    const group = JSON.parse(data);
    contactStore.updateGroupList(group);
    if (group.groupID === conversationStore.storeCurrentGroupInfo.groupID) {
      conversationStore.updateCurrentGroupInfo(group);
    }
  };
  const groupMemberAddedHandler = () => {};
  const groupMemberDeletedHandler = () => {};
  const groupMemberInfoChangedHandler = ({ data }: any) => {
    const member = JSON.parse(data) as GroupMemberItem;
    if (
      member.groupID === conversationStore.storeCurrentMemberInGroup?.groupID &&
      member.userID === conversationStore.storeCurrentMemberInGroup?.userID
    ) {
      conversationStore.updateCurrentMemberInGroup({ ...member });
    }
    contactStore.updateUserCardMemberInfo(member);
  };

  //application
  const friendApplicationAddedHandler = ({ data }: any) => {
    const application: FriendApplicationItem = JSON.parse(data);
    const isRecv = application.toUserID === userStore.storeSelfInfo.userID;
    if (isRecv) {
      contactStore.pushNewRecvFriendApplication(application);
    } else {
      contactStore.pushNewSendFriendApplication(application);
    }
  };
  const friendApplicationProcessedHandler = ({ data }: any) => {
    const application: FriendApplicationItem = JSON.parse(data);
    const isRecv = application.toUserID === userStore.storeSelfInfo.userID;
    if (isRecv) {
      contactStore.updateRecvFriendApplicationList(application);
    } else {
      contactStore.updateSendFriendApplicationList(application);
    }
  };
  const groupApplicationAddedHandler = ({ data }: any) => {
    const application: GroupApplicationItem = JSON.parse(data);
    const isRecv = application.userID !== userStore.storeSelfInfo.userID;
    if (isRecv) {
      contactStore.pushNewRecvGroupApplication(application);
    } else {
      contactStore.pushNewSendGroupApplication(application);
    }
  };
  const groupApplicationProcessedHandler = ({ data }: any) => {
    const application: GroupApplicationItem = JSON.parse(data);
    const isRecv = application.userID !== userStore.storeSelfInfo.userID;
    if (isRecv) {
      contactStore.updateRecvGroupApplicationList(application);
    } else {
      contactStore.updateSendGroupApplicationList(application);
    }
  };

  const disposeIMListener = () => {
    IMSDK.off(CbEvents.ONSELFINFOUPDATED, selfUpdateHandler);
    IMSDK.off(CbEvents.ONCONNECTING, connectingHandler);
    IMSDK.off(CbEvents.ONCONNECTFAILED, connectFailedHandler);
    IMSDK.off(CbEvents.ONCONNECTSUCCESS, connectSuccessHandler);
    IMSDK.off(CbEvents.ONKICKEDOFFLINE, kickHandler);
    IMSDK.off(CbEvents.ONUSERTOKENEXPIRED, expiredHandler);
    // sync
    IMSDK.off(CbEvents.ONSYNCSERVERSTART, syncStartHandler);
    IMSDK.off(CbEvents.ONSYNCSERVERFINISH, syncFinishHandler);
    IMSDK.off(CbEvents.ONSYNCSERVERFAILED, syncFailedHandler);
    // message
    IMSDK.off(CbEvents.ONRECVNEWMESSAGE, newMessageHandler);
    IMSDK.off(CbEvents.ONRECVNEWMESSAGES, newMessageHandler);
    // conversation
    IMSDK.off(CbEvents.ONCONVERSATIONCHANGED, conversationChnageHandler);
    IMSDK.off(CbEvents.ONNEWCONVERSATION, newConversationHandler);
    IMSDK.off(
      CbEvents.ONTOTALUNREADMESSAGECOUNTCHANGED,
      totalUnreadChangeHandler
    );
    // friend
    IMSDK.off(CbEvents.ONFRIENDINFOCHANGED, friednInfoChangeHandler);
    IMSDK.off(CbEvents.ONFRIENDADDED, friednAddedHandler);
    IMSDK.off(CbEvents.ONFRIENDDELETED, friednDeletedHandler);
    // blacklist
    IMSDK.off(CbEvents.ONBLACKADDED, blackAddedHandler);
    IMSDK.off(CbEvents.ONBLACKDELETED, blackDeletedHandler);
    // group
    IMSDK.off(CbEvents.ONJOINEDGROUPADDED, joinedGroupAddedHandler);
    IMSDK.off(CbEvents.ONJOINEDGROUPDELETED, joinedGroupDeletedHandler);
    IMSDK.off(CbEvents.ONGROUPINFOCHANGED, groupInfoChangedHandler);
    IMSDK.off(CbEvents.ONGROUPMEMBERADDED, groupMemberAddedHandler);
    IMSDK.off(CbEvents.ONGROUPMEMBERDELETED, groupMemberDeletedHandler);
    IMSDK.off(CbEvents.ONGROUPMEMBERINFOCHANGED, groupMemberInfoChangedHandler);
    // application
    IMSDK.off(CbEvents.ONFRIENDAPPLICATIONADDED, friendApplicationAddedHandler);
    IMSDK.off(
      CbEvents.ONFRIENDAPPLICATIONACCEPTED,
      friendApplicationProcessedHandler
    );
    IMSDK.off(
      CbEvents.ONFRIENDAPPLICATIONREJECTED,
      friendApplicationProcessedHandler
    );
    IMSDK.off(CbEvents.ONGROUPAPPLICATIONADDED, groupApplicationAddedHandler);
    IMSDK.off(
      CbEvents.ONGROUPAPPLICATIONACCEPTED,
      groupApplicationProcessedHandler
    );
    IMSDK.off(
      CbEvents.ONGROUPAPPLICATIONREJECTED,
      groupApplicationProcessedHandler
    );
  };

  onMounted(() => {
    setIMListener();
  });
  onUnmounted(() => {
    disposeIMListener();
  });
}
