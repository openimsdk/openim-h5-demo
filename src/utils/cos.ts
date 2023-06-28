import COS from "cos-js-sdk-v5";
import request from "./request";
import { getIMToken } from "./storage";

export const getCosAuthorization = async () => {
  const url = `${process.env.API_URL}/third/tencent_cloud_storage_credential`;
  // @ts-ignore
  const { data, errCode } = await request.post(
    url,
    {
      operationID: Date.now().toString(),
    },
    {
      headers: {
        token: getIMToken(),
      },
    }
  );
  if (errCode === 0) localStorage.setItem(`cosprofile`, JSON.stringify(data));
};

export const cos = new COS({
  getAuthorization: function (options, callback) {
    let cosprofile = localStorage.getItem("cosprofile");
    if (!cosprofile) return;
    cosprofile = JSON.parse(cosprofile);
    const result = (cosprofile as any).CredentialResult;

    callback({
      TmpSecretId: result.Credentials?.TmpSecretID,
      TmpSecretKey: result.Credentials?.TmpSecretKey,
      SecurityToken: result.Credentials?.SessionToken,
      StartTime: result.StartTime,
      ExpiredTime: result.ExpiredTime,
    });
  },
});

export const cosUpload = (
  file: File,
  pcb?: (progress: number) => void
): Promise<{
  data: COS.PutObjectResult & { URL: string; snapURL?: string };
}> => {
  const dpcb = () => {};
  return new Promise((resolve, reject) => {
    let cosprofile = localStorage.getItem("cosprofile");
    if (!cosprofile) reject("no cosprofile");
    cosprofile = JSON.parse(cosprofile!);

    cos.putObject(
      {
        Bucket: (cosprofile as any).Bucket /* 必须 */,
        Region: (cosprofile as any).Region /* 存储桶所在地域，必须字段 */,
        Key: "IMG" + file.lastModified + file.name /* 必须 */,
        // StorageClass: 'STANDARD',
        Body: file, // 上传文件对象
        onProgress: (info) => {
          pcb && pcb(info.percent);
        },
      },
      function (cerr, cdata: any) {
        if (cerr) {
          reject(cerr);
        } else {
          cdata.URL = "https://" + cdata.Location;
          const tdata = {
            data: cdata,
          };
          resolve(tdata);
        }
      }
    );
  });
};
