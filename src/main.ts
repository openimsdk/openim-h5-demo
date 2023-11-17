import { createApp } from "vue";
import "./style.scss";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { i18n } from "./i18n";

import { errorHandler } from "./error";

import "vant/es/toast/style";
import "vant/es/dialog/style";
import "vant/es/image-preview/style";

import { initAMapApiLoader } from "@vuemap/vue-amap";
import "@vuemap/vue-amap/dist/style.css";
initAMapApiLoader({
  key: process.env.AMAP_KEY!,
  //Loca:{
  //  version: '2.0.0'
  //}
});

import VConsole from "vconsole";

// const vConsole = new VConsole();

const app = createApp(App);
app.use(router);
app.use(store);
app.use(i18n);
errorHandler(app);

app.mount("#app");
