const BASE_HOST = '116.205.175.233'
const CHAT_URL = `http://${BASE_HOST}:10008`
const API_URL = `http://${BASE_HOST}:10002`
const WS_URL = `ws://${BASE_HOST}:10001`

// const BASE_DOMAIN = 'your-server-domain'
// const CHAT_URL = `http://${BASE_DOMAIN}/chat`
// const API_URL = `http://${BASE_DOMAIN}/api`
// const WS_URL = `ws://${BASE_DOMAIN}/msg_gateway`

export default {
  NODE_ENV: 'development',
  CHAT_URL,
  API_URL,
  WS_URL,
  LOG_LEVEL: 5,
  AMAP_KEY: '',
  AMAP_SNAP_KEY: '',
  VERSION: 'H5-Demo',
}
