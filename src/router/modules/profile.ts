import { RouteRecordRaw } from "vue-router";

const profileRouters: Array<RouteRecordRaw> = [
  {
    path: "/selfInfoDetails",
    name: "SelfInfoDetails",
    component: () => import("@pages/profile/selfInfoDetails/index.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@pages/profile/about/index.vue"),
  },
  {
    path: "/accountSettings",
    name: "AccountSettings",
    component: () => import("@pages/profile/accountSettings/index.vue"),
  },
  {
    path: "/blackList",
    name: "BlackList",
    component: () => import("@pages/profile/blackList/index.vue"),
  },
  {
    path: "/language",
    name: "Language",
    component: () => import("@pages/profile/language/index.vue"),
  },
  {
    path: "/changePassword",
    name: "ChangePassword",
    component: () => import("@pages/profile/changePassword/index.vue"),
  },
  {
    path: "/selfOrGroupQr",
    name: "SelfOrGroupQr",
    props: ({ query }) => ({
      isGroup: !!query.isGroup,
    }),
    component: () => import("@pages/profile/selfOrGroupQr/index.vue"),
  },
  {
    path: "/changeNameOrRemark",
    name: "ChangeNameOrRemark",
    props: ({ query }) => ({
      friendInfo: query.friendInfo
        ? JSON.parse(query.friendInfo as string)
        : null,
    }),
    component: () => import("@pages/profile/changeNameOrRemark/index.vue"),
  },
];

export default profileRouters;
