const BASE_DOMAIN = 'your-server-domain'
const CHAT_URL = `http://${BASE_DOMAIN}/chat`
const API_URL = `http://${BASE_DOMAIN}/api`
const WS_URL = `ws://${BASE_DOMAIN}/msg_gateway`

export default {
  NODE_ENV: 'development',
  CHAT_URL,
  API_URL,
  WS_URL,
  LOG_LEVEL: 5,
  VERSION: 'H5-Demo',
}
