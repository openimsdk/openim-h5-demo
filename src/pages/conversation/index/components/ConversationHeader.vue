<template>
    <div class="flex items-center px-[22px] pt-2 pb-4">
        <Avatar :size="48" :src="userStore.storeSelfInfo.faceURL" :desc="userStore.storeSelfInfo.nickname" />
        <div class="flex-1 mx-3 text-xs">
            <!-- <div class="truncate max-w-[50vw]">托云信息技术</div> -->
            <div class="flex items-center">
                <div class="text-base truncate mr-3 max-w-[30vw]">{{userStore.storeSelfInfo.nickname}}</div>
                <div class="flex items-center">
                    <i class="w-[6px] h-[6px] mr-1 bg-[#10CC64] rounded-full inline-block" />
                    <span>{{$t('phoneOnline')}}</span>
                </div>
            </div>
        </div>
        <div class="flex">
            <!-- <van-icon class="mr-4" size="24" name="phone-o" /> -->
            <van-popover :show-arrow="false" v-model:show="showPopover" :actions="ConversationTopMoreActions"
                placement="bottom-end" @select="selectMenu">
                <template #reference>
                    <van-icon size="24" name="add-o" />
                </template>
            </van-popover>
        </div>
    </div>
</template>

<script setup lang='ts'>
import Avatar from '@/components/Avatar/index.vue';
import { PopoverAction } from 'vant';
import useUserStore from '@/store/modules/user';
import { ConversationTopMoreActions } from '@/constants/action';

enum ActionEnum {
    Scan,
    AddFriend,
    AddGroup,
    LaunchGroup
}
const userStore = useUserStore()
const router = useRouter()

const showPopover = ref(false)

const selectMenu = (_: PopoverAction, idx: ActionEnum) => {
    switch (idx) {
        case ActionEnum.Scan:
            break;
        case ActionEnum.AddFriend:
        case ActionEnum.AddGroup:
            router.push({
                path: 'prepareSearchContact',
                query: {
                    isGroup: String(idx === ActionEnum.AddGroup)
                }
            })
            break;
        case ActionEnum.LaunchGroup:
            router.push('createGroup')
            break;
        default:
            break;

    }
}



</script>

<style lang='scss' scoped>

</style>