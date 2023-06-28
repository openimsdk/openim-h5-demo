export const setTMToken = (token: string) =>
  localStorage.setItem("IM_TOKEN", token);
export const setChatToken = (token: string) =>
  localStorage.setItem("IM_CHAT_TOKEN", token);
export const setTMUserID = (userID: string) =>
  localStorage.setItem("IM_USERID", userID);

export const setIMProfile = ({ chatToken, imToken, userID }: any) => {
  setTMToken(imToken);
  setChatToken(chatToken);
  setTMUserID(userID);
};

export const clearIMProfile = () => {
  localStorage.removeItem("IM_TOKEN");
  localStorage.removeItem("IM_CHAT_TOKEN");
  localStorage.removeItem("IM_USERID");
};

export const getIMToken = () => localStorage.getItem("IM_TOKEN");
export const getChatToken = () => localStorage.getItem("IM_CHAT_TOKEN");
export const getIMUserID = () => localStorage.getItem("IM_USERID");
