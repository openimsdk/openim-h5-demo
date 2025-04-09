import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import router from './router'
import store from './store'
import { i18n } from './i18n'

import { errorHandler } from './error'

import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/image-preview/style'

import VConsole from 'vconsole'

// const vConsole = new VConsole();

const app = createApp(App)
app.use(router)
app.use(store)
app.use(i18n)
errorHandler(app)

app.mount('#app')
