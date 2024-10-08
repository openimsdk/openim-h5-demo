import { GroupSystemMessageTypes } from "@/constants/enum";
import dayjs from "dayjs";

import { isThisYear } from "date-fns";

import useContactStore from "@store/modules/contact";
import useConversationStore from "@store/modules/conversation";
import useUserStore from "@store/modules/user";

import calendar from "dayjs/plugin/calendar";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

// i18n
import { i18n } from "@/i18n";
import type {
  MessageItem,
  ConversationItem,
  PublicUserItem,
} from "@openim/wasm-client-sdk/lib/types/entity";
import { getSDK } from "@openim/wasm-client-sdk";
import { MessageType } from "@openim/wasm-client-sdk";
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

export const IMSDK = getSDK({
  coreWasmPath: "./openIM.wasm",
  sqlWasmPath: "/sql-wasm.wasm",
});

export const AddFriendQrCodePrefix = "io.openim.app/addFriend/";
export const AddGroupQrCodePrefix = "io.openim.app/joinGroup/";

export const tipMessaggeFormat = (msg: MessageItem) => {
  const userStore = useUserStore();
  const selfID = userStore.selfInfo.userID;

  const getName = (user: PublicUserItem) => {
    return user.userID === selfID ? t("you") : user.nickname;
  };

  switch (msg.contentType) {
    case MessageType.FriendAdded:
      return t("notificationTipMessage.alreadyFriendMessage");
    case MessageType.GroupCreated:
      const groupCreatedDetail = JSON.parse(msg.notificationElem!.detail);
      const groupCreatedUser = groupCreatedDetail.opUser;
      return t("notificationTipMessage.createGroupMessage", {
        creator: linkWrap({
          userID: groupCreatedUser.userID,
          groupID: msg.groupID,
          name: getName(groupCreatedUser),
        }),
      });
    case MessageType.GroupInfoUpdated:
      const groupUpdateDetail = JSON.parse(msg.notificationElem!.detail);
      const groupUpdateUser = groupUpdateDetail.opUser;
      return t("notificationTipMessage.updateGroupAnnouncementMessage", {
        operator: linkWrap({
          userID: groupCreatedUser.userID,
          groupID: msg.groupID,
          name: getName(groupUpdateUser),
        }),
      });
    case MessageType.GroupOwnerTransferred:
      const transferDetails = JSON.parse(msg.notificationElem!.detail);
      const transferOpUser = transferDetails.opUser;
      const newOwner = transferDetails.newGroupOwner;
      return t("notificationTipMessage.transferGroupMessage", {
        owner: linkWrap({
          userID: transferOpUser.userID,
          groupID: msg.groupID,
          name: getName(transferOpUser),
        }),
        newOwner: linkWrap({
          userID: newOwner.userID,
          groupID: msg.groupID,
          name: getName(newOwner),
        }),
      });
    case MessageType.MemberQuit:
      const quitDetails = JSON.parse(msg.notificationElem!.detail);
      const quitUser = quitDetails.quitUser;
      return t("notificationTipMessage.quitGroupMessage", {
        name: linkWrap({
          userID: quitUser.userID,
          groupID: msg.groupID,
          name: getName(quitUser),
        }),
      });
    case MessageType.MemberInvited:
      const inviteDetails = JSON.parse(msg.notificationElem!.detail);
      const inviteOpUser = inviteDetails.opUser;
      const invitedUserList = inviteDetails.invitedUserList ?? [];
      let inviteStr = "";
      invitedUserList.slice(0, 3).map(
        (user: any) =>
          (inviteStr += `${linkWrap({
            userID: user.userID,
            groupID: msg.groupID,
            name: getName(user),
          })}、`)
      );
      inviteStr = inviteStr.slice(0, -1);
      return t("notificationTipMessage.invitedToGroupMessage", {
        operator: linkWrap({
          userID: inviteOpUser.userID,
          groupID: msg.groupID,
          name: getName(inviteOpUser),
        }),
        invitedUser: `${inviteStr}${
          invitedUserList.length > 3
            ? `${t("messageDescription.somePerson", {
                num: invitedUserList.length,
              })}`
            : ""
        }`,
      });
    case MessageType.MemberKicked:
      const kickDetails = JSON.parse(msg.notificationElem!.detail);
      const kickOpUser = kickDetails.opUser;
      const kickdUserList = kickDetails.kickedUserList ?? [];
      let kickStr = "";
      kickdUserList.slice(0, 3).map(
        (user: any) =>
          (kickStr += `${linkWrap({
            userID: user.userID,
            groupID: msg.groupID,
            name: getName(user),
          })}、`)
      );
      kickStr = kickStr.slice(0, -1);
      return t("messageDescription.kickInGroupMessage", {
        operator: linkWrap({
          userID: kickOpUser.userID,
          groupID: msg.groupID,
          name: getName(kickOpUser),
        }),
        kickedUser: `${kickStr}${
          kickdUserList.length > 3
            ? `${t("messageDescription.somePerson", {
                num: kickdUserList.length,
              })}`
            : ""
        }`,
      });
    case MessageType.MemberEnter:
      const enterDetails = JSON.parse(msg.notificationElem!.detail);
      const enterUser = enterDetails.entrantUser;
      return t("notificationTipMessage.joinGroupMessage", {
        name: linkWrap({
          userID: enterUser.userID,
          groupID: msg.groupID,
          name: getName(enterUser),
        }),
      });
    case MessageType.GroupDismissed:
      const dismissDetails = JSON.parse(msg.notificationElem!.detail);
      const dismissUser = dismissDetails.opUser;
      return t("notificationTipMessage.disbanedGroupMessage", {
        operator: linkWrap({
          userID: dismissUser.userID,
          groupID: msg.groupID,
          name: getName(dismissUser),
        }),
      });
    case MessageType.GroupNameUpdated:
      const groupNameDetails = JSON.parse(msg.notificationElem!.detail);
      return t("messageDescription.updateGroupNameMessage", {
        operator: linkWrap({
          userID: groupNameDetails.opUser.userID,
          groupID: msg.groupID,
          name: getName(groupNameDetails.opUser),
        }),
        name: groupNameDetails.group.groupName,
      });
    default:
      return "";
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

export const formatMessageTime = (
  timestemp: number,
  keepSameYear = false
): string => {
  if (!timestemp) return "";

  const isRecent = dayjs().diff(timestemp, "day") < 7;
  const keepYear = keepSameYear || !isThisYear(timestemp);

  if (!isRecent && !keepYear) {
    return dayjs(timestemp).format("M/D HH:mm");
  }

  return dayjs(timestemp).calendar();
};

const linkWrap = ({
  userID,
  name,
  groupID,
}: {
  userID: string;
  name: string;
  groupID: string;
}) => {
  return `<span class='link-el truncate inline-block align-bottom' onclick='userClick("${userID}","${
    groupID ?? ""
  }")'>${name}</span>`;
};

export const parseBr = (text: string) => {
  return text
    .replace(new RegExp("\\n", "g"), "<br>")
    .replace(new RegExp("\n", "g"), "<br>");
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
      return message.textElem?.content!;
    case MessageType.PictureMessage:
      return t("messageDescription.imageMessage");
    case MessageType.VideoMessage:
      return t("messageDescription.videoMessage");
    case MessageType.FriendAdded:
      return t("messageDescription.alreadyFriendMessage");
    case MessageType.MemberEnter:
      const enterDetails = JSON.parse(message.notificationElem!.detail);
      const enterUser = enterDetails.entrantUser;
      return t("messageDescription.joinGroupMessage", {
        name: getName(enterUser),
      });
    case MessageType.GroupCreated:
      const groupCreatedDetail = JSON.parse(message.notificationElem!.detail);
      const groupCreatedUser = groupCreatedDetail.opUser;
      return t("messageDescription.createGroupMessage", {
        creator: getName(groupCreatedUser),
      });
    case MessageType.MemberInvited:
      const inviteDetails = JSON.parse(message.notificationElem!.detail);
      const inviteOpUser = inviteDetails.opUser;
      const invitedUserList = inviteDetails.invitedUserList ?? [];
      let inviteStr = "";
      invitedUserList
        .slice(0, 3)
        .map((user: any) => (inviteStr += `${getName(user)}、`));
      inviteStr = inviteStr.slice(0, -1);
      return t("notificationTipMessage.invitedToGroupMessage", {
        operator: getName(inviteOpUser),
        invitedUser: `${inviteStr}${
          invitedUserList.length > 3
            ? `${t("messageDescription.somePerson", {
                num: invitedUserList.length,
              })}`
            : ""
        }`,
      });
    case MessageType.MemberKicked:
      const kickDetails = JSON.parse(message.notificationElem!.detail);
      const kickOpUser = kickDetails.opUser;
      const kickdUserList = kickDetails.kickedUserList ?? [];
      let kickStr = "";
      kickdUserList
        .slice(0, 3)
        .map((user: any) => (kickStr += `${getName(user)}、`));
      kickStr = kickStr.slice(0, -1);
      return t("messageDescription.kickInGroupMessage", {
        operator: getName(kickOpUser),
        kickedUser: `${kickStr}${
          kickdUserList.length > 3
            ? `${t("messageDescription.somePerson", {
                num: kickdUserList.length,
              })}`
            : ""
        }`,
      });
    case MessageType.MemberQuit:
      const quitDetails = JSON.parse(message.notificationElem!.detail);
      const quitUser = quitDetails.quitUser;
      return t("messageDescription.quitGroupMessage", {
        name: getName(quitUser),
      });
    case MessageType.GroupInfoUpdated:
      const groupUpdateDetail = JSON.parse(message.notificationElem!.detail);
      const groupUpdateUser = groupUpdateDetail.opUser;
      return t("messageDescription.updateGroupInfoMessage", {
        operator: getName(groupUpdateUser),
      });
    case MessageType.GroupOwnerTransferred:
      const transferDetails = JSON.parse(message.notificationElem!.detail);
      const transferOpUser = transferDetails.opUser;
      const newOwner = transferDetails.newGroupOwner;
      return t("messageDescription.transferGroupMessage", {
        owner: getName(transferOpUser),
        newOwner: getName(newOwner),
      });
    case MessageType.GroupDismissed:
      const dismissDetails = JSON.parse(message.notificationElem!.detail);
      const dismissUser = dismissDetails.opUser;
      return t("messageDescription.disbanedGroupMessage", {
        operator: getName(dismissUser),
      });
    case MessageType.GroupNameUpdated:
      const groupNameDetails = JSON.parse(message.notificationElem!.detail);
      return t("messageDescription.updateGroupNameMessage", {
        operator: getName(groupNameDetails.opUser),
        name: groupNameDetails.group.groupName,
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
  conversationStore.getUnReadCountFromReq();
  contactStore.getBlackListFromReq();
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

export const getConversationContent = (message: MessageItem) => {
  const userStore = useUserStore();
  if (
    !message.groupID ||
    GroupSystemMessageTypes.includes(message.contentType) ||
    message.sendID === userStore.storeSelfInfo.userID ||
    message.contentType === MessageType.GroupAnnouncementUpdated
  ) {
    return formatMessageByType(message);
  }
  return `${message.senderNickname}：${formatMessageByType(message)}`;
};

const regex =
  /\b(https?:\/\/)?((?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]+)*\.[a-zA-Z]{2,})(\/[^\s]*)?\b/g;

export const formatLink = (content: string) =>
  content.replace(regex, (match) => {
    let href = match;
    if (!match.match(/^https?:\/\//)) {
      href = "https://" + match;
    }
    return `<a href="${href}" target="_blank" class="link-el">${match}</a>`;
  });
