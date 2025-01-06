export {}

declare global {
  interface Window {
    userClick: (userID?: string, groupID?: string) => void
    reEdit: (clientMsgID: string) => void
  }
}
