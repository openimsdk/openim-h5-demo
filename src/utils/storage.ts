export const setTMToken = (token: string) => localStorage.setItem('IM_TOKEN', token)
export const setChatToken = (token: string) =>
  localStorage.setItem('IM_CHAT_TOKEN', token)
export const setTMUserID = (userID: string) => localStorage.setItem('IM_USERID', userID)
export const setAccessedFriendApplication = (list: string[]) =>
  localStorage.setItem(
    `${getIMUserID()}_accessedFriendApplications`,
    JSON.stringify(list),
  )
export const setAccessedGroupApplication = (list: string[]) =>
  localStorage.setItem(
    `${getIMUserID()}_accessedGroupApplications`,
    JSON.stringify(list),
  )

export const setIMProfile = ({ chatToken, imToken, userID }: any) => {
  setTMToken(imToken)
  setChatToken(chatToken)
  setTMUserID(userID)
}

export const clearIMProfile = () => {
  localStorage.removeItem('IM_TOKEN')
  localStorage.removeItem('IM_CHAT_TOKEN')
  localStorage.removeItem('IM_USERID')
}

export const getIMToken = () => localStorage.getItem('IM_TOKEN')
export const getChatToken = () => localStorage.getItem('IM_CHAT_TOKEN')
export const getIMUserID = () => localStorage.getItem('IM_USERID')
export const getAccessedFriendApplication = () =>
  localStorage.getItem(`${getIMUserID()}_accessedFriendApplications`)
    ? JSON.parse(localStorage.getItem(`${getIMUserID()}_accessedFriendApplications`)!)
    : []
export const getAccessedGroupApplication = () =>
  localStorage.getItem(`${getIMUserID()}_accessedGroupApplications`)
    ? JSON.parse(localStorage.getItem(`${getIMUserID()}_accessedGroupApplications`)!)
    : []

export const getWsUrl = () => localStorage.getItem('wsUrl') || process.env.WS_URL!
export const getApiUrl = () => localStorage.getItem('apiUrl') || process.env.API_URL!
export const getChatUrl = () => localStorage.getItem('chatUrl') || process.env.CHAT_URL!
export const getLogLevel = () =>
  localStorage.getItem('logLevel') || process.env.LOG_LEVEL!
