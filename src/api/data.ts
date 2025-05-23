import { MessageReceiveOptType } from '@openim/wasm-client-sdk'

export enum UsedFor {
  Register = 1,
  Modify = 2,
  Login = 3,
}

export type SendSmsParams = {
  phoneNumber?: string
  email?: string
  areaCode: string
  usedFor: UsedFor
  invitationCode?: string
}

export type DemoRegisterParams = {
  invitationCode?: string
  verifyCode: string
  deviceID: string
  autoLogin?: boolean
  user: {
    nickname: string
    faceURL: string
    birth: number
    gender: number
    email?: string
    account?: string
    areaCode: string
    phoneNumber: string
    password: string
  }
}

export type VerifyCodeParams = {
  phoneNumber?: string
  email?: string
  areaCode: string
  verifyCode: string
  usedFor: UsedFor
}

export type ModifyPasswordParams = {
  phoneNumber: string
  areaCode: string
  verifyCode: string
  password: string
  email?: string
}

export type ChangPasswordParams = {
  userID: string
  currentPassword: string
  newPassword: string
}

export type DemoLoginParams = {
  phoneNumber?: string
  areaCode: string
  password: string
  email?: string
  verifyCode?: string
}

export interface BusinessUserInfo {
  userID: string
  password: string
  account: string
  phoneNumber: string
  areaCode: string
  email: string
  nickname: string
  faceURL: string
  gender: number
  level: number
  birth: number
  allowAddFriend: BusinessAllowType
  allowBeep: BusinessAllowType
  allowVibration: BusinessAllowType
  globalRecvMsgOpt: MessageReceiveOptType
}

export enum BusinessAllowType {
  Allow = 1,
  NotAllow = 2,
}
