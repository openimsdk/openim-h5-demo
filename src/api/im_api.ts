import { v4 as uuidV4 } from "uuid";
import request from "@utils/request";
import { getIMToken } from "@/utils/storage";

export const getOnlineStateFromSvr = (
  userIDList: string[],
  opid?: string
): Promise<any> => {
  return request.post(
    "/user/get_users_online_status",
    JSON.stringify({
      operationID: opid ?? uuidV4(),
      userIDList,
    }),
    {
      baseURL: process.env.API_URL,
      headers: {
        token: getIMToken(),
      },
    }
  );
};