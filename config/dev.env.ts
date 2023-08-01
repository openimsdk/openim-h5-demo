// http+ip+端口
export default {
  NODE_ENV: "development",
  // 业务服务器地址
  CHAT_URL: "http://43.154.157.177:10008",
  // IM api地址
  API_URL: "http://43.154.157.177:10002",
  // IM 配置获取地址
  CONFIG_URL: "http://43.154.157.177:10009",
  // IM websocket地址
  WS_URL: "ws://43.154.157.177:10001",
  // 高德地图key
  AMAP_KEY: "",
};

// https+域名 nginx配置参考：https://doc.rentsoft.cn/#/v2/server_deploy/easy_deploy_new?id=%e4%ba%94%e3%80%81nginx%e9%85%8d%e7%bd%ae%e5%8f%82%e8%80%83
// export default {
//   NODE_ENV: "development",
//   // 业务服务器地址
//   CHAT_URL: "https://web.rentsoft.cn/chat",
//   // IM api地址
//   API_URL: "https://web.rentsoft.cn/api",
//   // IM 配置获取地址
//   CONFIG_URL: "https://web.rentsoft.cn/complete_admin",
//   // IM websocket地址
//   WS_URL: "wss://web.rentsoft.cn/msg_gateway",
//   // 高德地图key
//   AMAP_KEY: "",
// };