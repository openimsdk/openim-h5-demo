import { CustomMessageType, GroupSystemMessageTypes } from '@/constants/enum'
import dayjs from 'dayjs'

import { sec2Time, secondsToTime } from './common'
import { isThisYear } from 'date-fns'

import useContactStore from '@store/modules/contact'
import useConversationStore from '@store/modules/conversation'
import useUserStore from '@store/modules/user'

import calendar from 'dayjs/plugin/calendar'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

// i18n
import { i18n } from '@/i18n'
import type {
  MessageItem,
  ConversationItem,
  PublicUserItem,
} from '@openim/wasm-client-sdk/lib/types/entity'
import { getSDK, MessageType } from '@openim/wasm-client-sdk'

// @ts-ignore
const { t } = i18n.global

dayjs.extend(calendar)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

dayjs.updateLocale('en', {
  calendar: {
    sameDay: 'HH:mm',
    nextDay: '[tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[yesterday] HH:mm',
    lastWeek: 'dddd HH:mm',
    sameElse: 'YYYY/M/D HH:mm',
  },
})
dayjs.updateLocale('zh-cn', {
  calendar: {
    sameDay: 'H:mm',
    nextDay: '[明天] H:mm',
    nextWeek: 'dddd',
    lastDay: '[昨天] H:mm',
    lastWeek: 'dddd HH:mm',
    sameElse: 'YYYY年M月D日 HH:mm',
  },
})

export const IMSDK = getSDK({
  coreWasmPath: './openIM.wasm',
  sqlWasmPath: '/sql-wasm.wasm',
})

export const tipMessaggeFormat = (msg: MessageItem) => {
  const userStore = useUserStore()
  const selfID = userStore.selfInfo.userID

  const getName = (user: PublicUserItem) => {
    return user.userID === selfID ? t('you') : user.nickname
  }

  switch (msg.contentType) {
    case MessageType.FriendAdded:
      return t('notificationTipMessage.alreadyFriendMessage')
    case MessageType.RevokeMessage:
      const data = JSON.parse(msg.notificationElem?.detail!)
      const operator = data.revokerID === selfID ? t('you') : data.revokerNickname
      const revoker =
        data.sourceMessageSendID === selfID
          ? t('you')
          : data.sourceMessageSenderNickname
      const isAdminRevoke = data.revokerID !== data.sourceMessageSendID
      if (isAdminRevoke) {
        return t('messageDescription.advanceRevokeMessage', {
          operator: linkWrap({
            userID: data.revokerID,
            groupID: msg.groupID,
            name: operator,
          }),
          revoker: linkWrap({
            userID: data.sourceMessageSendID,
            groupID: msg.groupID,
            name: revoker,
          }),
        })
      }
      return t('messageDescription.revokeMessage', {
        revoker: linkWrap({
          userID: data.revokerID,
          groupID: msg.groupID,
          name: operator,
        }),
      })
    case MessageType.GroupCreated:
      const groupCreatedDetail = JSON.parse(msg.notificationElem?.detail!)
      const groupCreatedUser = groupCreatedDetail.opUser
      return t('notificationTipMessage.createGroupMessage', {
        creator: linkWrap({
          userID: groupCreatedUser.userID,
          groupID: msg.groupID,
          name: getName(groupCreatedUser),
        }),
      })
    case MessageType.GroupInfoUpdated:
      const groupUpdateDetail = JSON.parse(msg.notificationElem?.detail!)
      const groupUpdateUser = groupUpdateDetail.opUser
      return t('notificationTipMessage.updateGroupAnnouncementMessage', {
        operator: linkWrap({
          userID: groupCreatedUser.userID,
          groupID: msg.groupID,
          name: getName(groupUpdateUser),
        }),
      })
    case MessageType.GroupOwnerTransferred:
      const transferDetails = JSON.parse(msg.notificationElem?.detail!)
      const transferOpUser = transferDetails.opUser
      const newOwner = transferDetails.newGroupOwner
      return t('notificationTipMessage.transferGroupMessage', {
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
      })
    case MessageType.MemberQuit:
      const quitDetails = JSON.parse(msg.notificationElem?.detail!)
      const quitUser = quitDetails.quitUser
      return t('notificationTipMessage.quitGroupMessage', {
        name: linkWrap({
          userID: quitUser.userID,
          groupID: msg.groupID,
          name: getName(quitUser),
        }),
      })
    case MessageType.MemberInvited:
      const inviteDetails = JSON.parse(msg.notificationElem?.detail!)
      const inviteOpUser = inviteDetails.opUser
      const invitedUserList = inviteDetails.invitedUserList ?? []
      let inviteStr = ''
      invitedUserList.slice(0, 3).map(
        (user: any) =>
          (inviteStr += `${linkWrap({
            userID: user.userID,
            groupID: msg.groupID,
            name: getName(user),
          })}、`),
      )
      inviteStr = inviteStr.slice(0, -1)
      return t('notificationTipMessage.invitedToGroupMessage', {
        operator: linkWrap({
          userID: inviteOpUser.userID,
          groupID: msg.groupID,
          name: getName(inviteOpUser),
        }),
        invitedUser: `${inviteStr}${
          invitedUserList.length > 3
            ? `${t('messageDescription.somePerson', {
                num: invitedUserList.length,
              })}`
            : ''
        }`,
      })
    case MessageType.MemberKicked:
      const kickDetails = JSON.parse(msg.notificationElem?.detail!)
      const kickOpUser = kickDetails.opUser
      const kickdUserList = kickDetails.kickedUserList ?? []
      let kickStr = ''
      kickdUserList.slice(0, 3).map(
        (user: any) =>
          (kickStr += `${linkWrap({
            userID: user.userID,
            groupID: msg.groupID,
            name: getName(user),
          })}、`),
      )
      kickStr = kickStr.slice(0, -1)
      return t('messageDescription.kickInGroupMessage', {
        operator: linkWrap({
          userID: kickOpUser.userID,
          groupID: msg.groupID,
          name: getName(kickOpUser),
        }),
        kickedUser: `${kickStr}${
          kickdUserList.length > 3
            ? `${t('messageDescription.somePerson', {
                num: kickdUserList.length,
              })}`
            : ''
        }`,
      })
    case MessageType.MemberEnter:
      const enterDetails = JSON.parse(msg.notificationElem?.detail!)
      const enterUser = enterDetails.entrantUser
      return t('notificationTipMessage.joinGroupMessage', {
        name: linkWrap({
          userID: enterUser.userID,
          groupID: msg.groupID,
          name: getName(enterUser),
        }),
      })
    case MessageType.GroupDismissed:
      const dismissDetails = JSON.parse(msg.notificationElem?.detail!)
      const dismissUser = dismissDetails.opUser
      return t('notificationTipMessage.disbandedGroupMessage', {
        operator: linkWrap({
          userID: dismissUser.userID,
          groupID: msg.groupID,
          name: getName(dismissUser),
        }),
      })
    case MessageType.GroupMuted:
      const GROUPMUTEDDetails = JSON.parse(msg.notificationElem?.detail!)
      const groupMuteOpUser = GROUPMUTEDDetails.opUser
      return t('notificationTipMessage.allMuteMessage', {
        operator: linkWrap({
          userID: groupMuteOpUser.userID,
          groupID: msg.groupID,
          name: getName(groupMuteOpUser),
        }),
      })
    case MessageType.GroupCancelMuted:
      const GROUPCANCELMUTEDDetails = JSON.parse(msg.notificationElem?.detail!)
      const groupCancelMuteOpUser = GROUPCANCELMUTEDDetails.opUser
      return t('notificationTipMessage.cancelAllMuteMessage', {
        operator: linkWrap({
          userID: groupCancelMuteOpUser.userID,
          groupID: msg.groupID,
          name: getName(groupCancelMuteOpUser),
        }),
      })
    case MessageType.GroupMemberMuted:
      const gmMutedDetails = JSON.parse(msg.notificationElem?.detail!)
      const muteTime = sec2Time(gmMutedDetails.mutedSeconds)
      return t('notificationTipMessage.singleMuteMessage', {
        operator: linkWrap({
          userID: gmMutedDetails.opUser.userID,
          groupID: msg.groupID,
          name: getName(gmMutedDetails.opUser),
        }),
        name: linkWrap({
          userID: gmMutedDetails.mutedUser.userID,
          groupID: msg.groupID,
          name: getName(gmMutedDetails.mutedUser),
        }),
        muteTime,
      })
    case MessageType.GroupMemberCancelMuted:
      const gmcMutedDetails = JSON.parse(msg.notificationElem?.detail!)
      return t('notificationTipMessage.cancelSingleMuteMessage', {
        operator: linkWrap({
          userID: gmcMutedDetails.opUser.userID,
          groupID: msg.groupID,
          name: getName(gmcMutedDetails.opUser),
        }),
        name: linkWrap({
          userID: gmcMutedDetails.mutedUser.userID,
          groupID: msg.groupID,
          name: getName(gmcMutedDetails.mutedUser),
        }),
      })
    case MessageType.GroupAnnouncementUpdated:
      const groupAnnouncementDetails = JSON.parse(msg.notificationElem?.detail!)
      return t('messageDescription.updateGroupAnnouncementMessage', {
        operator: linkWrap({
          userID: groupAnnouncementDetails.opUser.userID,
          groupID: msg.groupID,
          name: getName(groupAnnouncementDetails.opUser),
        }),
      })
    case MessageType.GroupNameUpdated:
      const groupNameDetails = JSON.parse(msg.notificationElem?.detail!)
      return t('messageDescription.updateGroupNameMessage', {
        operator: linkWrap({
          userID: groupNameDetails.opUser.userID,
          groupID: msg.groupID,
          name: getName(groupNameDetails.opUser),
        }),
        name: groupNameDetails.group.groupName,
      })
    case MessageType.BurnMessageChange:
      const burnDetails = JSON.parse(msg.notificationElem?.detail!)
      return t('notificationTipMessage.burnReadStatus', {
        status: burnDetails.isPrivate ? t('on') : t('off'),
      })
    case MessageType.OANotification:
      const customNoti = JSON.parse(msg.notificationElem?.detail!)
      return customNoti.text
    default:
      return ''
  }
}

export const formatConversionTime = (timestemp: number): string => {
  if (!timestemp) return ''

  const fromNowStr = dayjs(timestemp).fromNow()

  if (fromNowStr.includes(t('date.seconds'))) {
    return t('date.justNow')
  }

  if (
    !fromNowStr.includes(t('date.seconds')) &&
    !fromNowStr.includes(t('date.minutes'))
  ) {
    return dayjs(timestemp).calendar()
  }

  return fromNowStr
}

export const formatMessageTime = (timestemp: number, keepSameYear = false): string => {
  if (!timestemp) return ''

  const isRecent = dayjs().diff(timestemp, 'day') < 7
  const keepYear = keepSameYear || !isThisYear(timestemp)

  if (!isRecent && !keepYear) {
    return dayjs(timestemp).format('M/D HH:mm')
  }

  return dayjs(timestemp).calendar()
}

const linkWrap = ({
  userID,
  name,
  groupID,
}: {
  userID: string
  name: string
  groupID: string
}) => {
  return `<span class='link-el truncate inline-block align-bottom' onclick='userClick("${userID}","${
    groupID ?? ''
  }")'>${name}</span>`
}

export const parseBr = (text: string) => {
  return text
    .replace(new RegExp('\\n', 'g'), '<br>')
    .replace(new RegExp('\n', 'g'), '<br>')
}

export const getCleanText = (text: string) => {
  return text.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '')
}

export const formatMessageByType = (message: MessageItem): string => {
  const userStore = useUserStore()
  const selfUserID = userStore.storeSelfInfo.userID

  const isSelf = (id: string) => id === userStore.storeSelfInfo.userID
  const getName = (user: PublicUserItem) => {
    return user.userID === selfUserID ? t('you') : user.nickname
  }

  switch (message.contentType) {
    case MessageType.TextMessage:
      return message.textElem?.content!
    case MessageType.AtTextMessage:
      let mstr = message.atTextElem?.text!
      const pattern = /@\S+\s/g
      const arr = mstr.match(pattern)
      arr?.map((a) => {
        const member = (message.atTextElem?.atUsersInfo ?? []).find(
          (gm) => gm.atUserID === a.slice(1, -1),
        )
        if (member) {
          const reg = new RegExp(a, 'g')
          mstr = mstr.replace(reg, `@${member.groupNickname} `)
        }
      })
      return mstr
    case MessageType.PictureMessage:
      return t('messageDescription.imageMessage')
    case MessageType.VideoMessage:
      return t('messageDescription.videoMessage')
    case MessageType.VoiceMessage:
      return t('messageDescription.voiceMessage')
    case MessageType.LocationMessage:
      const locationInfo = JSON.parse(message.locationElem?.description!)
      return t('messageDescription.locationMessage', {
        location: locationInfo.name,
      })
    case MessageType.CardMessage:
      return t('messageDescription.cardMessage')
    case MessageType.MergeMessage:
      return t('messageDescription.mergeMessage')
    case MessageType.FileMessage:
      return t('messageDescription.fileMessage', {
        file: message.fileElem?.fileName,
      })
    case MessageType.RevokeMessage:
      const data = JSON.parse(message.notificationElem?.detail!)
      const revokerID = data.revokerID
      const revoker = isSelf(revokerID) ? t('you') : data.revokerNickname
      const isAdminRevoke = data.revokerID !== data.sourceMessageSendID
      if (isAdminRevoke) {
        return t('messageDescription.advanceRevokeMessage', {
          operator: data.sourceMessageSendNickname,
          revoker,
        })
      }
      return t('messageDescription.revokeMessage', { revoker })
    case MessageType.QuoteMessage:
      return message.quoteElem?.text || t('messageDescription.quoteMessage')
    case MessageType.FaceMessage:
      return t('messageDescription.faceMessage')
    case MessageType.FriendAdded:
      return t('messageDescription.alreadyFriendMessage')
    case MessageType.MemberEnter:
      const enterDetails = JSON.parse(message.notificationElem?.detail!)
      const enterUser = enterDetails.entrantUser
      return t('messageDescription.joinGroupMessage', {
        name: getName(enterUser),
      })
    case MessageType.GroupCreated:
      const groupCreatedDetail = JSON.parse(message.notificationElem?.detail!)
      const groupCreatedUser = groupCreatedDetail.opUser
      return t('messageDescription.createGroupMessage', {
        creator: getName(groupCreatedUser),
      })
    case MessageType.MemberInvited:
      const inviteDetails = JSON.parse(message.notificationElem?.detail!)
      const inviteOpUser = inviteDetails.opUser
      const invitedUserList = inviteDetails.invitedUserList ?? []
      let inviteStr = ''
      invitedUserList
        .slice(0, 3)
        .map((user: any) => (inviteStr += `${getName(user)}、`))
      inviteStr = inviteStr.slice(0, -1)
      return t('notificationTipMessage.invitedToGroupMessage', {
        operator: getName(inviteOpUser),
        invitedUser: `${inviteStr}${
          invitedUserList.length > 3
            ? `${t('messageDescription.somePerson', {
                num: invitedUserList.length,
              })}`
            : ''
        }`,
      })
    case MessageType.MemberKicked:
      const kickDetails = JSON.parse(message.notificationElem?.detail!)
      const kickOpUser = kickDetails.opUser
      const kickdUserList = kickDetails.kickedUserList ?? []
      let kickStr = ''
      kickdUserList.slice(0, 3).map((user: any) => (kickStr += `${getName(user)}、`))
      kickStr = kickStr.slice(0, -1)
      return t('messageDescription.kickInGroupMessage', {
        operator: getName(kickOpUser),
        kickedUser: `${kickStr}${
          kickdUserList.length > 3
            ? `${t('messageDescription.somePerson', {
                num: kickdUserList.length,
              })}`
            : ''
        }`,
      })
    case MessageType.MemberQuit:
      const quitDetails = JSON.parse(message.notificationElem?.detail!)
      const quitUser = quitDetails.quitUser
      return t('messageDescription.quitGroupMessage', {
        name: getName(quitUser),
      })
    case MessageType.GroupInfoUpdated:
      const groupUpdateDetail = JSON.parse(message.notificationElem?.detail!)
      const groupUpdateUser = groupUpdateDetail.opUser
      return t('messageDescription.updateGroupInfoMessage', {
        operator: getName(groupUpdateUser),
      })
    case MessageType.GroupOwnerTransferred:
      const transferDetails = JSON.parse(message.notificationElem?.detail!)
      const transferOpUser = transferDetails.opUser
      const newOwner = transferDetails.newGroupOwner
      return t('messageDescription.transferGroupMessage', {
        owner: getName(transferOpUser),
        newOwner: getName(newOwner),
      })
    case MessageType.GroupDismissed:
      const dismissDetails = JSON.parse(message.notificationElem?.detail!)
      const dismissUser = dismissDetails.opUser
      return t('messageDescription.disbandedGroupMessage', {
        operator: getName(dismissUser),
      })
    case MessageType.GroupMuted:
      const GROUPMUTEDDetails = JSON.parse(message.notificationElem?.detail!)
      const groupMuteOpUser = GROUPMUTEDDetails.opUser
      return t('messageDescription.allMuteMessage', {
        operator: getName(groupMuteOpUser),
      })
    case MessageType.GroupCancelMuted:
      const GROUPCANCELMUTEDDetails = JSON.parse(message.notificationElem?.detail!)
      const groupCancelMuteOpUser = GROUPCANCELMUTEDDetails.opUser
      return t('messageDescription.cancelAllMuteMessage', {
        operator: getName(groupCancelMuteOpUser),
      })
    case MessageType.GroupMemberMuted:
      const gmMutedDetails = JSON.parse(message.notificationElem?.detail!)
      const muteTime = secondsToTime(gmMutedDetails.muteTime)
      return t('messageDescription.singleMuteMessage', {
        operator: getName(gmMutedDetails.opUser),
        name: getName(gmMutedDetails.mutedUser),
        muteTime,
      })
    case MessageType.GroupMemberCancelMuted:
      const gmcMutedDetails = JSON.parse(message.notificationElem?.detail!)
      return t('messageDescription.cancelSingleMuteMessage', {
        operator: getName(gmcMutedDetails.opUser),
        name: getName(gmcMutedDetails.mutedUser),
      })
    case MessageType.GroupAnnouncementUpdated:
      const groupAnnouncementDetails = JSON.parse(message.notificationElem?.detail!)
      return t('messageDescription.updateGroupAnnouncementMessage', {
        operator: getName(groupAnnouncementDetails.opUser),
      })
    case MessageType.GroupNameUpdated:
      const groupNameDetails = JSON.parse(message.notificationElem?.detail!)
      return t('messageDescription.updateGroupNameMessage', {
        operator: getName(groupNameDetails.opUser),
        name: groupNameDetails.group.groupName,
      })
    case MessageType.OANotification:
      const customNoti = JSON.parse(message.notificationElem?.detail!)
      return customNoti.text
    case MessageType.BurnMessageChange:
      const burnDetails = JSON.parse(message.notificationElem?.detail!)
      return t('messageDescription.burnReadStatus', {
        status: burnDetails.isPrivate ? t('on') : t('off'),
      })
    default:
      return ''
  }
}

export const initStore = () => {
  const userStore = useUserStore()
  const conversationStore = useConversationStore()
  const contactStore = useContactStore()

  userStore.getSelfInfoFromReq()
  conversationStore.getUnReadCountFromReq()
  conversationStore.getConversationListFromReq()
  contactStore.getBlackListFromReq()
  contactStore.getRecvFriendApplicationListFromReq()
  contactStore.getSendFriendApplicationListFromReq()
  contactStore.getRecvGroupApplicationListFromReq()
  contactStore.getSendGroupApplicationListFromReq()
}

export const conversationSort = (conversationList: ConversationItem[]) => {
  const arr: string[] = []
  const filterArr = conversationList.filter(
    (c) => !arr.includes(c.conversationID) && arr.push(c.conversationID),
  )
  filterArr.sort((a, b) => {
    if (a.isPinned === b.isPinned) {
      const aCompare =
        a.draftTextTime! > a.latestMsgSendTime!
          ? a.draftTextTime!
          : a.latestMsgSendTime!
      const bCompare =
        b.draftTextTime! > b.latestMsgSendTime!
          ? b.draftTextTime!
          : b.latestMsgSendTime!
      if (aCompare > bCompare) {
        return -1
      } else if (aCompare < bCompare) {
        return 1
      } else {
        return 0
      }
    } else if (a.isPinned && !b.isPinned) {
      return -1
    } else {
      return 1
    }
  })
  return filterArr
}

export const getFrequentContacts = () => {
  const userStore = useUserStore()
  const currentUser = userStore.storeSelfInfo.userID
  let myFrequentContacts = [] as PublicUserItem[]
  try {
    const totalFrequentContacts = JSON.parse(
      localStorage.getItem('IMFrequentContacts_H5')!,
    )
    myFrequentContacts = totalFrequentContacts[currentUser] ?? []
  } catch (error) {}
  return myFrequentContacts
}

export const getConversationContent = (message: MessageItem) => {
  const userStore = useUserStore()
  if (
    !message.groupID ||
    GroupSystemMessageTypes.includes(message.contentType) ||
    message.sendID === userStore.storeSelfInfo.userID ||
    message.contentType === MessageType.GroupAnnouncementUpdated
  ) {
    return formatMessageByType(message)
  }
  return `${message.senderNickname}：${formatMessageByType(message)}`
}

const regex =
  /\b(https?:\/\/|www\.)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(:\d+)?(\.[a-zA-Z]{2,})?(\/[a-zA-Z0-9\/._-]*(\?\S*)?(#\S*)?)?\b/g

export const formatLink = (content: string) =>
  content.replace(regex, (match) => {
    let href = match
    if (!match.match(/^https?:\/\//)) {
      href = 'https://' + match
    }
    return `<a href="${href}" target="_blank" class="link-el">${match}</a>`
  })
