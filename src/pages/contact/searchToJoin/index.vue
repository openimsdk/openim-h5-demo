<template>
  <div class="page_container">
    <NavBar :title="title" />
    <van-search
      v-model="keyword"
      :placeholder="placeholder"
      @search="onSearch"
      @cancel="onCancel"
    />
    <div
      v-show="!empty && !searching"
      class="flex items-center border-y bg-white px-[22px] py-3"
      @click="onSearch"
    >
      <img class="mr-2 h-6 w-6" :src="imgUrl" alt="" />
      <div class="text-primary">{{ `${$t('find')}：${keyword}` }}</div>
    </div>

    <div
      v-show="searching"
      class="flex justify-center bg-white px-[22px] py-3 text-[#999]"
    >
      <van-loading size="24" type="spinner" />
    </div>
    <div v-show="empty" class="flex justify-center bg-white px-[22px] py-3 text-[#999]">
      <span v-show="empty">{{ $t('messageTip.searchEmpty') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import search_user from '@assets/images/search_user.png'
import search_group from '@assets/images/search_group.png'
import { searchUserInfoByBusiness } from '@/api/user'
import useContactStore from '@/store/modules/contact'
import useConversationStore from '@/store/modules/conversation'
import { IMSDK } from '@/utils/imCommon'

type SearchToJoinProps = {
  isGroup: boolean
}

const { t } = useI18n()
const router = useRouter()
const contactStore = useContactStore()
const conversationStore = useConversationStore()
const props = defineProps<SearchToJoinProps>()

const keyword = ref('')
const searching = ref(false)
const empty = ref(false)

const title = props.isGroup ? t('addGroup') : t('addFriend')
const placeholder = props.isGroup ? t('addGroupDesc') : t('addFriendDesc')
const imgUrl = props.isGroup ? search_group : search_user

const onSearch = async () => {
  if (!keyword.value) return
  searching.value = true
  if (props.isGroup) {
    await searchGroups()
  } else {
    await searchUsers()
  }
  searching.value = false
}

const searchGroups = async () => {
  try {
    let info = contactStore.storeGroupList.find(
      (item) => item.groupID === keyword.value,
    )
    if (!info) {
      const { data } = await IMSDK.getSpecifiedGroupsInfo([keyword.value])
      info = data[0]
    }
    if (info) {
      conversationStore.updateCurrentGroupInfo(info)
      router.push({
        path: 'groupCard',
      })
    } else {
      empty.value = true
    }
  } catch (error) {}
}

const searchUsers = async () => {
  try {
    const {
      data: { users, total },
    } = await searchUserInfoByBusiness(keyword.value)
    if (total > 0) {
      const businessData = users[0]
      const { data } = await IMSDK.getUsersInfo([businessData.userID])
      const imData = data[0]
      const info = {
        ...imData,
        ...businessData,
      }
      contactStore.setUserCardData({
        baseInfo: info,
      })
    } else {
      empty.value = true
    }
  } catch (error) {}
}

const onCancel = () => {
  router.back()
}
</script>

<style lang="scss" scoped></style>
