import { CustomType } from "@/constants/enum";
import dayjs from "dayjs";

import { feedbackToast, sec2Time } from "./common";

import useContactStore from "@store/modules/contact";
import useConversationStore from "@store/modules/conversation";
import useUserStore from "@store/modules/user";

import calendar from "dayjs/plugin/calendar";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

// i18n
import { i18n } from "@/i18n";
import {
  MessageItem,
  ConversationItem,
  PublicUserItem,
  AtTextElem,
} from "@/utils/open-im-sdk-wasm/types/entity";
import {
  GroupAtType,
  MessageType,
  SessionType,
} from "@/utils/open-im-sdk-wasm/types/enum";
import { getSDK } from "./open-im-sdk-wasm";
import { getOnlineStateFromSvr } from "@/api/im_api";
import { imageEmojis } from "@/constants/emoji";
import router from "@/router";
// @ts-ignore
const { t } = i18n.global;

dayjs.extend(calendar);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  calendar: {
    sameDay: "HH:mm",
    nextDay: "[tomorrow]",
    nextWeek: "dddd",
    lastDay: "[yesterday] HH:mm",
    lastWeek: "dddd HH:mm",
    sameElse: "YYYY/M/D HH:mm",
  },
});
dayjs.updateLocale("zh-cn", {
  calendar: {
    sameDay: "H:mm",
    nextDay: "[明天] H:mm",
    nextWeek: "dddd",
    lastDay: "[昨天] H:mm",
    lastWeek: "dddd HH:mm",
    sameElse: "YYYY年M月D日 HH:mm",
  },
});

export const IMSDK = getSDK("./openIM.wasm");

export const AddFriendQrCodePrefix = "io.openim.app/addFriend/";
export const AddGroupQrCodePrefix = "io.openim.app/joinGroup/";

const switchCustomMsg = (cMsg: any) => {
  switch (cMsg.customType) {
    case CustomType.MassMsg:
      return t("messageDesc.notificationMessage");
    case CustomType.Call:
      return t("messageDesc.rtcMessage");
    default:
      return "";
  }
};

export const tipMessaggeFormat = (msg: MessageItem) => {
  const conversationStore = useConversationStore();
  const userStore = useUserStore();

  const currentConversation = conversationStore.currentConversation;
  const selfID = userStore.selfInfo.userID;

  if (msg.contentType === MessageType.RevokeMessage) {
    let revoker, operator, isAdminRevoke;
    try {
      const data = JSON.parse(msg.notificationElem.detail);
      const revokerID = data.revokerID;
      revoker =
        revokerID === selfID
          ? t("you")
          : currentConversation.conversationType === SessionType.WorkingGroup
          ? currentConversation?.showName
          : data.revokerNickname;
      isAdminRevoke = data.revokerID !== data.sourceMessageSendID;
      operator = data.sourceMessageSendNickname;
    } catch (error) {
      isAdminRevoke = msg.sendID !== selfID;
      operator = t("you");
      revoker = isAdminRevoke ? msg.senderNickname : operator;
    }

    if (isAdminRevoke) {
      return t("notificationTipMessage.advanceRevokeMessage", {
        operator,
        revoker,
      });
    }
    return t("notificationTipMessage.revokeMessage", { revoker });
  }

  const getName = (user: PublicUserItem) => {
    return user.userID === selfID ? t("you") : user.nickname;
  };

  switch (msg.contentType) {
    case MessageType.FriendAdded:
      return t("notificationTipMessage.alreadyFriendMessage");
    case MessageType.GroupCreated:
      const groupCreatedDetail = JSON.parse(msg.notificationElem.detail);
      const groupCreatedUser = groupCreatedDetail.opUser;
      return t("notificationTipMessage.createGroupMessage", {
        creator: getName(groupCreatedUser),
      });
    case MessageType.GroupInfoUpdated:
      const groupUpdateDetail = JSON.parse(msg.notificationElem.detail);
      const groupUpdateUser = groupUpdateDetail.opUser;
      if (groupUpdateDetail.group.notification) {
        return t("notificationTipMessage.updateGroupAnnouncementMessage", {
          operator: getName(groupUpdateUser),
        });
      }
      return t("notificationTipMessage.updateGroupInfoMessage", {
        operator: getName(groupUpdateUser),
      });
    case MessageType.GroupOwnerTransferred:
      const transferDetails = JSON.parse(msg.notificationElem.detail);
      const transferOpUser = transferDetails.opUser;
      const newOwner = transferDetails.newGroupOwner;
      return t("notificationTipMessage.transferGroupMessage", {
        owner: getName(transferOpUser),
        newOwner: getName(newOwner),
      });
    case MessageType.MemberQuit:
      const quitDetails = JSON.parse(msg.notificationElem.detail);
      const quitUser = quitDetails.quitUser;
      return t("notificationTipMessage.quitGroupMessage", {
        name: getName(quitUser),
      });
    case MessageType.MemberInvited:
      const inviteDetails = JSON.parse(msg.notificationElem.detail);
      const inviteOpUser = inviteDetails.opUser;
      const invitedUserList = inviteDetails.invitedUserList ?? [];
      let inviteStr = "";
      invitedUserList.find(
        (user: any, idx: number) =>
          (inviteStr += getName(user) + " ") && idx > 3
      );
      return t("notificationTipMessage.invitedToGroupMessage", {
        operator: getName(inviteOpUser),
        invitedUser: `${inviteStr}${invitedUserList.length > 3 ? "..." : ""}`,
      });
    case MessageType.MemberKicked:
      const kickDetails = JSON.parse(msg.notificationElem.detail);
      const kickOpUser = kickDetails.opUser;
      const kickdUserList = kickDetails.kickedUserList ?? [];
      let kickStr = "";
      kickdUserList.find(
        (user: any, idx: number) => (kickStr += getName(user) + " ") && idx > 3
      );
      return t("notificationTipMessage.kickInGroupMessage", {
        operator: getName(kickOpUser),
        kickedUser: `${kickStr}${kickdUserList.length > 3 ? "..." : ""}`,
      });
    case MessageType.MemberEnter:
      const enterDetails = JSON.parse(msg.notificationElem.detail);
      const enterUser = enterDetails.entrantUser;
      return t("notificationTipMessage.joinGroupMessage", {
        name: getName(enterUser),
      });
    case MessageType.GroupDismissed:
      const dismissDetails = JSON.parse(msg.notificationElem.detail);
      const dismissUser = dismissDetails.opUser;
      return t("notificationTipMessage.disbanedGroupMessage", {
        operator: getName(dismissUser),
      });
    case MessageType.GroupMuted:
      const GROUPMUTEDDetails = JSON.parse(msg.notificationElem.detail);
      const groupMuteOpUser = GROUPMUTEDDetails.opUser;
      return t("notificationTipMessage.allMuteMessage", {
        operator: getName(groupMuteOpUser),
      });
    case MessageType.GroupCancelMuted:
      const GROUPCANCELMUTEDDetails = JSON.parse(msg.notificationElem.detail);
      const groupCancelMuteOpUser = GROUPCANCELMUTEDDetails.opUser;
      return t("notificationTipMessage.cancelAllMuteMessage", {
        operator: getName(groupCancelMuteOpUser),
      });
    case MessageType.GroupMemberMuted:
      const gmMutedDetails = JSON.parse(msg.notificationElem.detail);
      const muteTime = sec2Time(gmMutedDetails.mutedSeconds);
      return t("notificationTipMessage.singleMuteMessage", {
        operator: getName(gmMutedDetails.opUser),
        name: getName(gmMutedDetails.mutedUser),
        muteTime,
      });
    case MessageType.GroupMemberCancelMuted:
      const gmcMutedDetails = JSON.parse(msg.notificationElem.detail);
      return t("notificationTipMessage.cancelSingleMuteMessage", {
        operator: getName(gmcMutedDetails.opUser),
        name: getName(gmcMutedDetails.mutedUser),
      });
    case MessageType.GroupNameUpdated:
      const groupNameDetails = JSON.parse(msg.notificationElem.detail);
      return t("notificationTipMessage.updateGroupNameMessage", {
        operator: groupNameDetails.opUser.nickname,
        name: groupNameDetails.group.groupName,
      });
    case MessageType.BurnMessageChange:
      const burnDetails = JSON.parse(msg.notificationElem.detail);
      return t("notificationTipMessage.burnReadStatus", {
        status: burnDetails.isPrivate ? t("on") : t("off"),
      });
    case MessageType.OANotification:
      const customNoti = JSON.parse(msg.notificationElem.detail);
      return customNoti.text;
    default:
      return msg.notificationElem.detail;
  }
};

export const formatConversionTime = (timestemp: number): string => {
  if (!timestemp) return "";

  const fromNowStr = dayjs(timestemp).fromNow();

  if (fromNowStr.includes(t("date.seconds"))) {
    return t("date.justNow");
  }

  if (
    !fromNowStr.includes(t("date.seconds")) &&
    !fromNowStr.includes(t("date.minutes"))
  ) {
    return dayjs(timestemp).calendar();
  }

  return fromNowStr;
};
export const parseAt = (atel: AtTextElem) => {
  let mstr = atel.text;
  const pattern = /@\S+\s/g;
  const arr = mstr.match(pattern);
  const atUserList = atel.atUsersInfo ?? [];
  arr?.map((match) => {
    const member = atUserList.find(
      (user) => user.atUserID === match.slice(1, -1)
    );
    if (member) {
      mstr = mstr.replace(
        match,
        `<span style="color: #3e44ff"> @${member.groupNickname} </span>`
      );
    } else {
      mstr = mstr.replace(
        match,
        `<span style="color: #3e44ff"> ${match}</span>`
      );
    }
  });
  return mstr;
};

export const parseBr = (text: string) => {
  return text.replace(new RegExp("\\n", "g"), "<br>");
};

export const getCleanText = (text: string) => {
  return text.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, "");
};

export const formatMessageByType = (message: MessageItem): string => {
  const userStore = useUserStore();
  const selfUserID = userStore.storeSelfInfo.userID;
  const isSelf = (id: string) => id === userStore.storeSelfInfo.userID;
  const getName = (user: PublicUserItem) => {
    return user.userID === selfUserID ? t("you") : user.nickname;
  };
  switch (message.contentType) {
    case MessageType.TextMessage:
      return message.textElem?.content;
    case MessageType.AtTextMessage:
      let mstr = message.atTextElem.text;
      const pattern = /@\S+\s/g;
      const arr = mstr.match(pattern);
      arr?.map((a) => {
        const member = (message.atTextElem.atUsersInfo ?? []).find(
          (gm) => gm.atUserID === a.slice(1, -1)
        );
        if (member) {
          const reg = new RegExp(a, "g");
          mstr = mstr.replace(reg, `@${member.groupNickname} `);
        }
      });
      return mstr;
    case MessageType.PictureMessage:
      return t("messageDesc.imageMessage");
    case MessageType.VideoMessage:
      return t("messageDesc.videoMessage");
    case MessageType.VoiceMessage:
      return t("messageDesc.voiceMessage");
    case MessageType.LocationMessage:
      const locationInfo = JSON.parse(message.locationElem.description);
      return t("messageDesc.locationMessage", {
        location: locationInfo.name,
      });
    case MessageType.CardMessage:
      return t("messageDesc.cardMessage");
    case MessageType.MergeMessage:
      return t("messageDesc.mergeMessage");
    case MessageType.FileMessage:
      return t("messageDesc.FileMessage") + message.fileElem.fileName;
    case MessageType.RevokeMessage:
      const data = JSON.parse(message.notificationElem.detail);
      const revokerID = data.revokerID;
      const revoker = isSelf(revokerID) ? t("you") : data.revokerNickname;
      const isAdminRevoke = data.revokerID !== data.sourceMessageSendID;
      if (isAdminRevoke) {
        return t("notificationTipMessage.advanceRevokeMessage", {
          operator: data.sourceMessageSendNickname,
          revoker,
        });
      }
      return t("notificationTipMessage.revokeMessage", { revoker });
    case MessageType.CustomMessage:
      const customEl = message.customElem;
      const customData = JSON.parse(customEl.data);
      //   if (customData.customType) {
      //     return switchCustomMsg(customData);
      //   }
      return t("messageDesc.customMessage");
    case MessageType.QuoteMessage:
      return message.quoteElem.text || t("messageDesc.quoteMessage");
    case MessageType.FaceMessage:
      return t("messageDesc.faceMessage");
    case MessageType.FriendAdded:
      return t("notificationTipMessage.alreadyFriendMessage");
    case MessageType.MemberEnter:
      const enterDetails = JSON.parse(message.notificationElem.detail);
      const enterUser = enterDetails.entrantUser;
      return t("notificationTipMessage.joinGroupMessage", {
        name: getName(enterUser),
      });
    case MessageType.GroupCreated:
      const groupCreatedDetail = JSON.parse(message.notificationElem.detail);
      const groupCreatedUser = groupCreatedDetail.opUser;
      return t("notificationTipMessage.createGroupMessage", {
        creator: getName(groupCreatedUser),
      });
    case MessageType.MemberInvited:
      const inviteDetails = JSON.parse(message.notificationElem.detail);
      const inviteOpUser = inviteDetails.opUser;
      const invitedUserList = inviteDetails.invitedUserList ?? [];
      let inviteStr = "";
      invitedUserList.find(
        (user: any, idx: number) =>
          (inviteStr += `${getName(user)} `) && idx > 3
      );
      return t("notificationTipMessage.invitedToGroupMessage", {
        operator: getName(inviteOpUser),
        invitedUser: `${inviteStr}${invitedUserList.length > 3 ? "..." : ""}`,
      });
    case MessageType.MemberKicked:
      const kickDetails = JSON.parse(message.notificationElem.detail);
      const kickOpUser = kickDetails.opUser;
      const kickdUserList = kickDetails.kickedUserList ?? [];
      let kickStr = "";
      kickdUserList.find(
        (user: any, idx: number) => (kickStr += `${getName(user)} `) && idx > 3
      );
      return t("notificationTipMessage.kickInGroupMessage", {
        operator: getName(kickOpUser),
        kickedUser: `${kickStr}${kickdUserList.length > 3 ? "..." : ""}`,
      });
    case MessageType.MemberQuit:
      const quitDetails = JSON.parse(message.notificationElem.detail);
      const quitUser = quitDetails.quitUser;
      return t("notificationTipMessage.quitGroupMessage", {
        name: getName(quitUser),
      });
    case MessageType.GroupInfoUpdated:
      const groupUpdateDetail = JSON.parse(message.notificationElem.detail);
      const groupUpdateUser = groupUpdateDetail.opUser;
      return t("notificationTipMessage.updateGroupInfoMessage", {
        operator: getName(groupUpdateUser),
      });
    case MessageType.GroupOwnerTransferred:
      const transferDetails = JSON.parse(message.notificationElem.detail);
      const transferOpUser = transferDetails.opUser;
      const newOwner = transferDetails.newGroupOwner;
      return t("notificationTipMessage.transferGroupMessage", {
        owner: getName(transferOpUser),
        newOwner: getName(newOwner),
      });
    case MessageType.GroupDismissed:
      const dismissDetails = JSON.parse(message.notificationElem.detail);
      const dismissUser = dismissDetails.opUser;
      return t("notificationTipMessage.disbanedGroupMessage", {
        operator: getName(dismissUser),
      });
    case MessageType.GroupMuted:
      const GROUPMUTEDDetails = JSON.parse(message.notificationElem.detail);
      const groupMuteOpUser = GROUPMUTEDDetails.opUser;
      return t("notificationTipMessage.allMuteMessage", {
        operator: getName(groupMuteOpUser),
      });
    case MessageType.GroupCancelMuted:
      const GROUPCANCELMUTEDDetails = JSON.parse(
        message.notificationElem.detail
      );
      const groupCancelMuteOpUser = GROUPCANCELMUTEDDetails.opUser;
      return t("notificationTipMessage.cancelAllMuteMessage", {
        operator: getName(groupCancelMuteOpUser),
      });
    case MessageType.GroupMemberMuted:
      const gmMutedDetails = JSON.parse(message.notificationElem.detail);
      const muteTime = sec2Time(gmMutedDetails.muteTime);
      return t("notificationTipMessage.singleMuteMessage", {
        operator: getName(gmMutedDetails.opUser),
        name: getName(gmMutedDetails.mutedUser),
        muteTime,
      });
    case MessageType.GroupMemberCancelMuted:
      const gmcMutedDetails = JSON.parse(message.notificationElem.detail);
      return t("notificationTipMessage.cancelSingleMuteMessage", {
        operator: getName(gmcMutedDetails.opUser),
        name: getName(gmcMutedDetails.mutedUser),
      });
    case MessageType.GroupAnnouncementUpdated:
      const groupAnnouncementDetails = JSON.parse(
        message.notificationElem.detail
      );
      return t("notificationTipMessage.updateGroupAnnouncementMessage", {
        operator: getName(groupAnnouncementDetails.opUser),
      });
    case MessageType.GroupNameUpdated:
      const groupNameDetails = JSON.parse(message.notificationElem.detail);
      return t("notificationTipMessage.updateGroupNameMessage", {
        operator: getName(groupNameDetails.opUser),
        name: groupNameDetails.group.groupName,
      });
    case MessageType.OANotification:
      const customNoti = JSON.parse(message.notificationElem.detail);
      return customNoti.text;
    case MessageType.BurnMessageChange:
      const burnDetails = JSON.parse(message.notificationElem.detail);
      return t("notificationTipMessage.burnReadStatus", {
        status: burnDetails.isPrivate ? t("on") : t("off"),
      });
    default:
      return "";
  }
};

export const initStore = () => {
  const userStore = useUserStore();
  const conversationStore = useConversationStore();
  const contactStore = useContactStore();

  userStore.getSelfInfoFromReq();
  conversationStore.getConversationListFromReq();
  conversationStore.getUnReadCountFromReq();
  contactStore.getFriendListFromReq();
  contactStore.getBlackListFromReq();
  contactStore.getGroupListFromReq();
  contactStore.getRecvFriendApplicationListFromReq();
  contactStore.getSendFriendApplicationListFromReq();
  contactStore.getRecvGroupApplicationListFromReq();
  contactStore.getSendGroupApplicationListFromReq();
};

export const conversationSort = (conversationList: ConversationItem[]) => {
  const arr: string[] = [];
  const filterArr = conversationList.filter(
    (c) => !arr.includes(c.conversationID) && arr.push(c.conversationID)
  );
  filterArr.sort((a, b) => {
    if (a.isPinned === b.isPinned) {
      const aCompare =
        a.draftTextTime! > a.latestMsgSendTime!
          ? a.draftTextTime!
          : a.latestMsgSendTime!;
      const bCompare =
        b.draftTextTime! > b.latestMsgSendTime!
          ? b.draftTextTime!
          : b.latestMsgSendTime!;
      if (aCompare > bCompare) {
        return -1;
      } else if (aCompare < bCompare) {
        return 1;
      } else {
        return 0;
      }
    } else if (a.isPinned && !b.isPinned) {
      return -1;
    } else {
      return 1;
    }
  });
  return filterArr;
};

export const toSpecifiedConversation = (
  sourceID: string,
  sessionType: SessionType
) => {
  return new Promise<void>(async (resolve, reject) => {
    let conversationInfo = null;
    const conversationStore = useConversationStore();

    if (sessionType === SessionType.Single) {
      conversationInfo = conversationStore.storeConversationList.find(
        (item) => item.userID === sourceID
      );
    } else {
      conversationInfo = conversationStore.storeConversationList.find(
        (item) => item.groupID === sourceID
      );
    }

    if (!conversationInfo) {
      try {
        const { data } = await IMSDK.getOneConversation({
          sourceID,
          sessionType,
        });
        console.log(data);

        conversationInfo = data;
      } catch (error) {
        feedbackToast({
          message: t("getConversationFailed"),
          error,
        });
        reject();
      }
    }
    conversationStore.updateCurrentConversation(
      conversationInfo as ConversationItem
    );
    router.push({
      path: "chat",
    });
    resolve();
  });
};

const switchOnline = (oType: string, details?: any[]) => {
  switch (oType) {
    case "offline":
      return t("offline");
    case "online":
      let str = "";
      details?.map((detail) => {
        if (detail.status === "online") {
          str += `${detail.platform}/`;
        }
      });
      return `${str.slice(0, -1)} ${t("online")}`;
    default:
      return "";
  }
};

export const getDesignatedUserOnlineState = (
  userID: string
): Promise<string> => {
  return new Promise(async (resolve) => {
    let statusObj = {} as any;
    try {
      const { data } = await getOnlineStateFromSvr([userID]);
      statusObj = data[0];
    } catch (e) {
      resolve(t("offline"));
    }
    const onlineStr = switchOnline(
      statusObj.status,
      statusObj.detailPlatformStatus
    );
    resolve(onlineStr);
  });
};

export const getFrequentContacts = () => {
  const userStore = useUserStore();
  const currentUser = userStore.storeSelfInfo.userID;
  let myFrequentContacts = [] as PublicUserItem[];
  try {
    const totalFrequentContacts = JSON.parse(
      localStorage.getItem("IMFrequentContacts_H5")!
    );
    myFrequentContacts = totalFrequentContacts[currentUser] ?? [];
  } catch (error) {}
  return myFrequentContacts;
};

export const formatEmoji = (str: string) => {
  imageEmojis.map((emoji) => {
    if (str.includes(emoji.context)) {
      let imgStr = `<img class="emoji_display" src="${emoji.src}" alt="${emoji.context}" />`;
      str = str.replace(emoji.reg, imgStr);
    }
  });
  return str;
};
