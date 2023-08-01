import useContactStore from "@store/modules/contact";
import useConversationStore from "@store/modules/conversation";
import useUserStore from "@store/modules/user";
import { conversationSort, IMSDK } from "@/utils/imCommon";
import { CbEvents } from "@/utils/open-im-sdk-wasm/constant";
import {
  ConversationItem,
  GroupMemberItem,
  FriendApplicationItem,
  GroupApplicationItem,
  WSEvent,
  MessageItem,
} from "@/utils/open-im-sdk-wasm/types/entity";
import {
  MessageType,
  MessageReceiveOptType,
  SessionType,
} from "@/utils/open-im-sdk-wasm/types/enum";
import useMessageStore, { ExMessageItem } from "@/store/modules/message";
import emitter from "@/utils/events";
import { useDebounceFn, useThrottleFn } from "@vueuse/core";
import { clearIMProfile } from "@/utils/storage";
import { showLoadingToast } from "vant";
import { ToastWrapperInstance } from "vant/lib/toast/types";
import { feedbackToast } from "@/utils/common";

import messageRing from "@assets/audio/newMsg.mp3";
import { BusinessAllowType } from "@/api/data";

export function useGlobalEvent() {
  const userStore = useUserStore();
  const conversationStore = useConversationStore();
  const contactStore = useContactStore();
  const messageStore = useMessageStore();

  const router = useRouter();

  let cacheConversationList = [] as ConversationItem[];
  let syncToast: ToastWrapperInstance | null = null;
  let audioEl: HTMLAudioElement | null = null;

  const setIMListener = () => {
    // account
    IMSDK.on(CbEvents.OnSelfInfoUpdated, selfUpdateHandler);
    IMSDK.on(CbEvents.OnConnecting, connectingHandler);
    IMSDK.on(CbEvents.OnConnectFailed, connectFailedHandler);
    IMSDK.on(CbEvents.OnConnectSuccess, connectSuccessHandler);
    IMSDK.on(CbEvents.OnKickedOffline, kickHandler);
    IMSDK.on(CbEvents.OnUserTokenExpired, expiredHandler);
    // sync
    IMSDK.on(CbEvents.OnSyncServerStart, syncStartHandler);
    IMSDK.on(CbEvents.OnSyncServerFinish, syncFinishHandler);
    IMSDK.on(CbEvents.OnSyncServerFailed, syncFailedHandler);
    // message
    IMSDK.on(CbEvents.OnRecvNewMessage, newMessageHandler);
    IMSDK.on(CbEvents.OnRecvNewMessages, newMessageHandler);
    // conversation
    IMSDK.on(CbEvents.OnConversationChanged, conversationChnageHandler);
    IMSDK.on(CbEvents.OnNewConversation, newConversationHandler);
    IMSDK.on(
      CbEvents.OnTotalUnreadMessageCountChanged,
      totalUnreadChangeHandler
    );
    // friend
    IMSDK.on(CbEvents.OnFriendInfoChanged, friednInfoChangeHandler);
    IMSDK.on(CbEvents.OnFriendAdded, friednAddedHandler);
    IMSDK.on(CbEvents.OnFriendDeleted, friednDeletedHandler);
    // blacklist
    IMSDK.on(CbEvents.OnBlackAdded, blackAddedHandler);
    IMSDK.on(CbEvents.OnBlackDeleted, blackDeletedHandler);
    // group
    IMSDK.on(CbEvents.OnJoinedGroupAdded, joinedGroupAddedHandler);
    IMSDK.on(CbEvents.OnJoinedGroupDeleted, joinedGroupDeletedHandler);
    IMSDK.on(CbEvents.OnGroupInfoChanged, groupInfoChangedHandler);
    IMSDK.on(CbEvents.OnGroupMemberAdded, groupMemberAddedHandler);
    IMSDK.on(CbEvents.OnGroupMemberDeleted, groupMemberDeletedHandler);
    IMSDK.on(CbEvents.OnGroupMemberInfoChanged, groupMemberInfoChangedHandler);
    IMSDK.on(CbEvents.OnFriendApplicationAdded, friendApplicationAddedHandler);
    IMSDK.on(
      CbEvents.OnFriendApplicationAccepted,
      friendApplicationProcessedHandler
    );
    IMSDK.on(
      CbEvents.OnFriendApplicationRejected,
      friendApplicationProcessedHandler
    );
    IMSDK.on(CbEvents.OnGroupApplicationAdded, groupApplicationAddedHandler);
    IMSDK.on(
      CbEvents.OnGroupApplicationAccepted,
      groupApplicationProcessedHandler
    );
    IMSDK.on(
      CbEvents.OnGroupApplicationRejected,
      groupApplicationProcessedHandler
    );
  };

  const selfUpdateHandler = ({ data }: any) => {
    userStore.updateSelfInfo({
      ...userStore.storeSelfInfo,
      ...data,
    });
  };
  const connectingHandler = () => {};
  const connectFailedHandler = () => {};
  const connectSuccessHandler = () => {};
  const kickHandler = () => tryOut("您的账号已在其他设备登录,请重新登录");
  const expiredHandler = () => tryOut("当前登录已过期,请重新登录");

  const tryOut = (message: string) =>
    feedbackToast({
      message,
      error: message,
      onClose: () => {
        clearIMProfile();
        router.push("login");
      },
    });

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
    const parsedData = data;
    if (Array.isArray(parsedData)) {
      parsedData.map((message) => handleNewMessage(message));
      return;
    }
    handleNewMessage(parsedData);
  };
  const handleNewMessage = (newServerMsg: ExMessageItem) => {
    if (inCurrentConversation(newServerMsg)) {
      const isSingleMessage = newServerMsg.sessionType === SessionType.Single;

      if (isSingleMessage) {
        useThrottleFn(() => emitter.emit("ONLINE_STATE_CHECK"), 2000)();
      }

      if (newServerMsg.contentType === MessageType.TypingMessage) {
        if (isSingleMessage) {
          useThrottleFn(() => emitter.emit("TYPING_UPDATE"), 2000)();
        }
      } else {
        if (newServerMsg.contentType === MessageType.RevokeMessage) {
        } else {
          newServerMsg.isAppend = true;
          messageStore.pushNewMessage(newServerMsg);
          emitter.emit("CHAT_MAIN_SCROLL_TO_BOTTOM", true);
        }
        markConversationAsRead();
      }
    } else {
      if (
        newServerMsg.contentType !== MessageType.TypingMessage &&
        newServerMsg.sendID !== userStore.storeSelfInfo.userID
      ) {
        useThrottleFn(() => newMessageNotify(newServerMsg), 1000)();
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
      case SessionType.WorkingGroup:
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
  const markConversationAsRead = useDebounceFn(() => {
    IMSDK.markConversationMessageAsRead(
      conversationStore.storeCurrentConversation.conversationID
    );
  }, 2000);

  const newMessageNotify = async (newServerMsg: MessageItem) => {
    if (userStore.storeIsSyncing) {
      return;
    }

    if (
      userStore.storeSelfInfo.allowBeep === BusinessAllowType.NotAllow ||
      userStore.storeSelfInfo.globalRecvMsgOpt !== MessageReceiveOptType.Nomal
    ) {
      return;
    }

    let cveItem = [
      ...conversationStore.storeConversationList,
      ...cacheConversationList,
    ].find((conversation) => {
      if (newServerMsg.sessionType === SessionType.WorkingGroup) {
        return newServerMsg.groupID === conversation.groupID;
      }
      return newServerMsg.sendID === conversation.userID;
    });

    if (!cveItem) {
      try {
        const { data } = await IMSDK.getOneConversation({
          sessionType: newServerMsg.sessionType,
          sourceID: newServerMsg.groupID || newServerMsg.sendID,
        });
        cveItem = data;
        cacheConversationList = [...cacheConversationList, { ...cveItem! }];
      } catch (e) {
        return;
      }
    }

    if (cveItem!.recvMsgOpt !== MessageReceiveOptType.Nomal) {
      return;
    }

    if (!audioEl) {
      audioEl = document.createElement("audio");
    }
    audioEl.src = messageRing;
    audioEl.play();
  };

  // conversation
  const conversationChnageHandler = ({ data }: WSEvent<ConversationItem[]>) => {
    let filterArr: ConversationItem[] = [];
    const changes: ConversationItem[] = data;
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
  const newConversationHandler = ({ data }: WSEvent<ConversationItem[]>) => {
    const news: ConversationItem[] = data;
    const result = [...news, ...conversationStore.storeConversationList];
    conversationStore.updateConversationList(conversationSort(result));
  };
  const totalUnreadChangeHandler = ({ data }: WSEvent<number>) => {
    conversationStore.updateUnReadCount(data);
  };

  // friend
  const friednInfoChangeHandler = ({ data }: any) => {
    contactStore.updateFriendList(data);
  };
  const friednAddedHandler = ({ data }: any) => {
    contactStore.pushNewFriend(data);
  };
  const friednDeletedHandler = ({ data }: any) => {
    contactStore.updateFriendList(data, true);
  };

  // blacklist
  const blackAddedHandler = ({ data }: any) => {
    contactStore.pushNewBlack(data);
  };
  const blackDeletedHandler = ({ data }: any) => {
    contactStore.updateBlackList(data, true);
  };

  // group
  const joinedGroupAddedHandler = ({ data }: any) => {
    contactStore.pushNewGroup(data);
  };
  const joinedGroupDeletedHandler = ({ data }: any) => {
    contactStore.updateGroupList(data, true);
  };
  const groupInfoChangedHandler = ({ data }: any) => {
    const group = data;
    contactStore.updateGroupList(group);
    if (group.groupID === conversationStore.storeCurrentGroupInfo.groupID) {
      conversationStore.updateCurrentGroupInfo(group);
    }
  };
  const groupMemberAddedHandler = () => {};
  const groupMemberDeletedHandler = () => {};
  const groupMemberInfoChangedHandler = ({ data }: any) => {
    const member = data as GroupMemberItem;
    if (
      member.groupID === conversationStore.storeCurrentMemberInGroup?.groupID &&
      member.userID === conversationStore.storeCurrentMemberInGroup?.userID
    ) {
      conversationStore.updateCurrentMemberInGroup({ ...member });
    }
    contactStore.updateUserCardMemberInfo(member);
  };

  // rtc
  const newInvitationHandler = () => {};
  const otherHandler = () => {};

  //application
  const friendApplicationAddedHandler = ({ data }: any) => {
    const application: FriendApplicationItem = data;
    const isRecv = application.toUserID === userStore.storeSelfInfo.userID;
    if (isRecv) {
      contactStore.pushNewRecvFriendApplication(application);
    } else {
      contactStore.pushNewSendFriendApplication(application);
    }
  };
  const friendApplicationProcessedHandler = ({ data }: any) => {
    const application: FriendApplicationItem = data;
    const isRecv = application.toUserID === userStore.storeSelfInfo.userID;
    if (isRecv) {
      contactStore.updateRecvFriendApplicationList(application);
    } else {
      contactStore.updateSendFriendApplicationList(application);
    }
  };
  const groupApplicationAddedHandler = ({ data }: any) => {
    const application: GroupApplicationItem = data;
    const isRecv = application.userID !== userStore.storeSelfInfo.userID;
    if (isRecv) {
      contactStore.pushNewRecvGroupApplication(application);
    } else {
      contactStore.pushNewSendGroupApplication(application);
    }
  };
  const groupApplicationProcessedHandler = ({ data }: any) => {
    const application: GroupApplicationItem = data;
    const isRecv = application.userID !== userStore.storeSelfInfo.userID;
    if (isRecv) {
      contactStore.updateRecvGroupApplicationList(application);
    } else {
      contactStore.updateSendGroupApplicationList(application);
    }
  };

  const disposeIMListener = () => {
    IMSDK.off(CbEvents.OnSelfInfoUpdated, selfUpdateHandler);
    IMSDK.off(CbEvents.OnConnecting, connectingHandler);
    IMSDK.off(CbEvents.OnConnectFailed, connectFailedHandler);
    IMSDK.off(CbEvents.OnConnectSuccess, connectSuccessHandler);
    IMSDK.off(CbEvents.OnKickedOffline, kickHandler);
    IMSDK.off(CbEvents.OnUserTokenExpired, expiredHandler);
    // sync
    IMSDK.off(CbEvents.OnSyncServerStart, syncStartHandler);
    IMSDK.off(CbEvents.OnSyncServerFinish, syncFinishHandler);
    IMSDK.off(CbEvents.OnSyncServerFailed, syncFailedHandler);
    // message
    IMSDK.off(CbEvents.OnRecvNewMessage, newMessageHandler);
    IMSDK.off(CbEvents.OnRecvNewMessages, newMessageHandler);
    // conversation
    IMSDK.off(CbEvents.OnConversationChanged, conversationChnageHandler);
    IMSDK.off(CbEvents.OnNewConversation, newConversationHandler);
    IMSDK.off(
      CbEvents.OnTotalUnreadMessageCountChanged,
      totalUnreadChangeHandler
    );
    // friend
    IMSDK.off(CbEvents.OnFriendInfoChanged, friednInfoChangeHandler);
    IMSDK.off(CbEvents.OnFriendAdded, friednAddedHandler);
    IMSDK.off(CbEvents.OnFriendDeleted, friednDeletedHandler);
    // blacklist
    IMSDK.off(CbEvents.OnBlackAdded, blackAddedHandler);
    IMSDK.off(CbEvents.OnBlackDeleted, blackDeletedHandler);
    // group
    IMSDK.off(CbEvents.OnJoinedGroupAdded, joinedGroupAddedHandler);
    IMSDK.off(CbEvents.OnJoinedGroupDeleted, joinedGroupDeletedHandler);
    IMSDK.off(CbEvents.OnGroupInfoChanged, groupInfoChangedHandler);
    IMSDK.off(CbEvents.OnGroupMemberAdded, groupMemberAddedHandler);
    IMSDK.off(CbEvents.OnGroupMemberDeleted, groupMemberDeletedHandler);
    IMSDK.off(CbEvents.OnGroupMemberInfoChanged, groupMemberInfoChangedHandler);
    // application
    IMSDK.off(CbEvents.OnFriendApplicationAdded, friendApplicationAddedHandler);
    IMSDK.off(
      CbEvents.OnFriendApplicationAccepted,
      friendApplicationProcessedHandler
    );
    IMSDK.off(
      CbEvents.OnFriendApplicationRejected,
      friendApplicationProcessedHandler
    );
    IMSDK.off(CbEvents.OnGroupApplicationAdded, groupApplicationAddedHandler);
    IMSDK.off(
      CbEvents.OnGroupApplicationAccepted,
      groupApplicationProcessedHandler
    );
    IMSDK.off(
      CbEvents.OnGroupApplicationRejected,
      groupApplicationProcessedHandler
    );
  };

  watch(
    () => userStore.storeSelfInfo.userID,
    () => {
      cacheConversationList = [];
    }
  );

  onMounted(() => {
    setIMListener();
  });
  onUnmounted(() => {
    disposeIMListener();
  });
}
