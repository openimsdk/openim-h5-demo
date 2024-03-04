import request from "@utils/request";
import { getChatToken } from "@/utils/storage";

export const getRtcConnectData = (room: string, identity: string) =>
  request.post<{ serverUrl: string; token: string }>(
    "/user/rtc/get_token",
    JSON.stringify({
      room,
      identity,
    }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );
