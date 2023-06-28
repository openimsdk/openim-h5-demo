import request from "@utils/request";
import {
  DemoLoginParams,
  DemoRegisterParams,
  ModifyPasswordParams,
  SendSmsParams,
  VerifyCodeParams,
} from "./data";

let platform = 5;

export const sendSms = (params: SendSmsParams) =>
  request.post(
    "/account/code",
    JSON.stringify({ ...params, operationID: Date.now() + "" })
  );

export const verifyCode = (params: VerifyCodeParams) =>
  request.post(
    "/account/verify",
    JSON.stringify({
      ...params,
      operationID: Date.now() + "",
    })
  );

export const register = (params: DemoRegisterParams) => {
  return request.post(
    "/account/password",
    JSON.stringify({
      ...params,
      platform,
      operationID: Date.now() + "",
    })
  );
};

export const modify = (params: ModifyPasswordParams) =>
  request.post(
    "/account/reset_password",
    JSON.stringify({
      ...params,
      platform,
      operationID: Date.now() + "",
    })
  );

export const login = (params: DemoLoginParams) => {
  return request.post(
    "/account/login",
    JSON.stringify({
      ...params,
      platform,
      operationID: Date.now() + "",
    })
  );
};
