export enum UsedFor {
  Register = 1,
  Modify = 2,
}

export type SendSmsParams = {
  phoneNumber: string;
  areaCode: string;
  usedFor: UsedFor;
  invitationCode?: string;
};

export type DemoRegisterParams = {
  phoneNumber: string;
  areaCode: string;
  verificationCode: string;
  password: string;
  faceURL: string;
  nickname: string;
  invitationCode?: string;
  birth?: number;
};

export type VerifyCodeParams = {
  phoneNumber: string;
  areaCode: string;
  verificationCode: string;
  usedFor: UsedFor;
};

export type ModifyPasswordParams = {
  phoneNumber: string;
  areaCode: string;
  verificationCode: string;
  password: string;
};

export type DemoLoginParams = {
  phoneNumber: string;
  areaCode: string;
  password: string;
};

export type BusinessUserInfo = {
  account: string;
  allowAddFriend: number;
  allowBeep: number;
  allowVibration: number;
  areaCode: string;
  birth: number;
  email: string;
  englishName: string;
  faceURL: string;
  forbidden: number;
  gender: number;
  hireDate: string;
  level: number;
  nickname: string;
  phoneNumber: string;
  telephone: string;
  userID: string;
};

// im api

export enum MinioUploadType {
  File = "1",
  Video = "2",
  Picture = "3",
}
