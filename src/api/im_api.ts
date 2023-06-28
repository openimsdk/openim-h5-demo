import { v4 as uuidV4 } from "uuid";
import useUserStore from "@store/modules/user";
import request from "@utils/request";
import { MinioUploadType } from "./data";
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

export const minioUpload = (
  file: File,
  fileType: MinioUploadType,
  snapShot?: File,
  onProgress?: (progress: number) => void,
  opid?: string
): Promise<{ data: { URL: string; newName: string; snapURL?: string } }> => {
  const data = new FormData();
  data.append("file", file);
  data.append("fileType", fileType);
  data.append("operationID", opid ?? uuidV4());
  snapShot && data.append("snapShot", snapShot);
  return request.post("/third/minio_upload", data, {
    baseURL: process.env.API_URL,
    headers: {
      "Content-Type":
        "multipart/form-data; boundary=<calculated when request is sent>",
      token: getIMToken(),
    },
    onUploadProgress: function (progressEvent) {
      let complete = ((progressEvent.loaded / progressEvent.total!) * 100) | 0;
      onProgress && onProgress(complete);
    },
  });
};
