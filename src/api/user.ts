import request from "@utils/request";
import { BusinessUserInfo } from "./data";
import { getChatToken } from "@/utils/storage";
import { AppConfig } from "@/store/modules/user";

export const updateBusinessInfo = (params: Partial<BusinessUserInfo>) =>
  request.post(
    "/user/update_user_info",
    JSON.stringify({ ...params, operationID: Date.now() + "" }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );

export const getBusinessInfo = (userID: string) =>
  request.post(
    "/user/get_users_full_info",
    JSON.stringify({ userIDList: [userID], operationID: Date.now() + "" }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );

export const searchUserInfoByBusiness = (
  content: string
): Promise<{
  totalNumber: number;
  userFullInfoList: BusinessUserInfo[];
}> => {
  return request.post(
    "/user/search_users_full_info",
    JSON.stringify({
      content,
      pageNumber: 0,
      showNumber: 20,
      operationID: Date.now() + "",
    }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );
};

export const getAppConfig = (): Promise<{ data: AppConfig }> => {
  return request.post(
    "/admin/init/get_client_config",
    JSON.stringify({
      operationID: Date.now() + "",
    }),
    {
      baseURL: process.env.CONFIG_URL,
    }
  );
};
