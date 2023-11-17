import request from "@utils/request";
import { BusinessUserInfo } from "./data";
import { getChatToken } from "@/utils/storage";
import useUserStore, { AppConfig } from "@/store/modules/user";

// new
export const updateBusinessInfo = (params: Partial<BusinessUserInfo>) =>
  request.post(
    "/user/update",
    JSON.stringify({ ...params, userID: useUserStore().storeSelfInfo.userID }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );

// new
export const getBusinessInfo = (userID: string) =>
  request.post<{ users: BusinessUserInfo[] }>("/user/find/full", JSON.stringify({ userIDs: [userID] }), {
    headers: {
      token: getChatToken(),
    },
  });

// new
export const searchUserInfoByBusiness = (
  content: string
): Promise<{
  total: number;
  users: BusinessUserInfo[];
}> => {
  return request.post(
    "/user/search/full",
    JSON.stringify({
      keyword: content,
      pagination: {
        pageNumber: 1,
        showNumber: 20,
      },
    }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );
};

// new
export const getAppConfig = (): Promise<{ data: { config: AppConfig } }> => {
  return request.post(
    "/client_config/get",
    JSON.stringify({
      operationID: Date.now() + "",
    }),
    {
      baseURL: process.env.CHAT_URL,
    }
  );
};
