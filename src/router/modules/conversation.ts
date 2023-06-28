import { RouteRecordRaw } from "vue-router";

const conversationRouters: Array<RouteRecordRaw> = [
  {
    path: "/chat",
    name: "Chat",
    component: () => import("@pages/conversation/chat/index.vue"),
  },
  {
    path: "/singleSetting",
    name: "SingleSetting",
    component: () => import("@pages/conversation/singleSetting/index.vue"),
  },
  {
    path: "/groupSetting",
    name: "GroupSetting",
    component: () => import("@pages/conversation/groupSetting/index.vue"),
  },
  {
    path: "/notifyMessageList",
    name: "NotifyMessageList",
    component: () => import("@pages/conversation/notifyMessageList/index.vue"),
  },
  {
    path: "/previewFile",
    name: "PreviewFile",
    component: () => import("@pages/conversation/previewFile/index.vue"),
  },
  {
    path: "/previewLocation",
    name: "PreviewLocation",
    component: () => import("@pages/conversation/previewLocation/index.vue"),
  },
  {
    path: "/previewVideo",
    name: "PreviewVideo",
    props: ({ query }) => ({
      url: query.url,
    }),
    component: () => import("@pages/conversation/previewVideo/index.vue"),
  },
  {
    path: "/changeName",
    name: "ChangeName",
    props: ({ query }) => ({
      originData: JSON.parse(query.originData as string),
    }),
    component: () => import("@pages/conversation/changeName/index.vue"),
  },
];

export default conversationRouters;
