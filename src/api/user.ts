import request from '@utils/request'
import { BusinessUserInfo } from './data'
import { getChatToken, getChatUrl } from '@/utils/storage'
import useUserStore from '@/store/modules/user'

// new
export const updateBusinessInfo = (params: Partial<BusinessUserInfo>) =>
  request.post(
    '/user/update',
    JSON.stringify({ ...params, userID: useUserStore().storeSelfInfo.userID }),
    {
      headers: {
        token: getChatToken(),
      },
    },
  )

// new
export const getBusinessInfo = (userID: string) =>
  request.post<{ users: BusinessUserInfo[] }>(
    '/user/find/full',
    JSON.stringify({ userIDs: [userID] }),
    {
      headers: {
        token: getChatToken(),
      },
    },
  )

// new
export const searchUserInfoByBusiness = (content: string) => {
  return request.post<{ users: BusinessUserInfo[]; total: number }>(
    '/user/search/full',
    JSON.stringify({
      keyword: content,
      pagination: {
        pageNumber: 1,
        showNumber: 20,
      },
    }),
    {
      headers: {
        token: getChatToken(),
      },
    },
  )
}
