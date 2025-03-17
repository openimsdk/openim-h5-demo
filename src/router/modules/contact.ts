import { RouteRecordRaw } from 'vue-router'

const contactRouters: Array<RouteRecordRaw> = [
  {
    path: '/myFriend',
    name: 'MyFriend',
    component: () => import('@pages/contact/myFriend/index.vue'),
  },
  {
    path: '/myGroup',
    name: 'MyGroup',
    component: () => import('@pages/contact/myGroup/index.vue'),
  },
  {
    path: '/newGroup',
    name: 'NewGroup',
    component: () => import('@pages/contact/newGroup/index.vue'),
  },
  {
    path: '/newFriend',
    name: 'NewFriend',
    component: () => import('@pages/contact/newFriend/index.vue'),
  },
  {
    path: '/applicationList',
    name: 'ApplicationList',
    component: () => import('@pages/contact/applicationList/index.vue'),
  },
  {
    path: '/applicationDetails',
    name: 'ApplicationDetails',
    component: () => import('@pages/contact/applicationDetails/index.vue'),
    props: ({ query }) => ({
      application: JSON.parse((query.application as string) || '{}'),
      type: Number(query.type),
    }),
  },
  {
    path: '/userCard',
    name: 'UserCard',
    component: () => import('@pages/contact/userCard/index.vue'),
  },
  {
    path: '/groupCard',
    name: 'GroupCard',
    component: () => import('@pages/contact/groupCard/index.vue'),
  },
  {
    path: '/userCardSetting',
    name: 'UserCardSetting',
    component: () => import('@pages/contact/userCardSetting/index.vue'),
  },
  {
    path: '/userCardDetails',
    name: 'UserCardDetails',
    component: () => import('@pages/contact/userCardDetails/index.vue'),
  },
  {
    path: '/contactAdd',
    name: 'ContactAdd',
    component: () => import('@pages/contact/contactAdd/index.vue'),
  },
  {
    path: '/searchToJoin',
    name: 'SearchToJoin',
    component: () => import('@pages/contact/searchToJoin/index.vue'),
    props: ({ query }) => ({
      isGroup: query.isGroup === 'true',
    }),
  },
  {
    path: '/sendApplication',
    name: 'SendApplication',
    component: () => import('@pages/contact/sendApplication/index.vue'),
    props: ({ query }) => ({
      isGroup: query.isGroup ? JSON.parse(query.isGroup as string) : false,
      sourceID: query.sourceID,
      isScan: query.isScan ? JSON.parse(query.isScan as string) : false,
      notNeedVerification: query.notNeedVerification
        ? JSON.parse(query.notNeedVerification as string)
        : false,
      sessionType: Number(query.sessionType),
    }),
  },
  {
    path: '/groupMemberList',
    name: 'GroupMemberList',
    component: () => import('@pages/contact/groupMemberList/index.vue'),
  },
  {
    path: '/createGroup',
    name: 'CreateGroup',
    component: () => import('@pages/contact/createGroup/index.vue'),
    props: ({ query }) => ({
      groupType: JSON.parse((query.groupType as string) || '0'),
    }),
  },
  {
    path: '/chooseUser',
    name: 'ChooseUser',
    component: () => import('@pages/contact/chooseUser/index.vue'),
  },
  {
    path: '/searchFriendOrGroup',
    name: 'SearchFriendOrGroup',
    component: () => import('@pages/contact/searchFriendOrGroup/index.vue'),
  },
]

export default contactRouters
