<template>
    <van-action-sheet v-model:show="launchSheetvisible" :actions="LaunchGroupSheetActions" cancel-text="取消"
        close-on-click-action @cancel="launchSheetvisible = false" @select="selectLaunch" />
</template>

<script setup lang='ts'>
import { LaunchGroupSheetActions } from '@/constants/action';
import { GroupType } from 'open-im-sdk-wasm/lib/types/enum';

const emit = defineEmits([]);
const props = defineProps();
const router = useRouter();

const launchSheetvisible = ref(false)

const selectLaunch = (_: unknown, idx: number) => {
    router.push({
        path: 'createGroup',
        query: {
            groupType: idx ? GroupType.WorkingGroup : GroupType.NomalGroup
        }
    })
}

const openLaunchSheet = () => {
    launchSheetvisible.value = true
}

defineExpose({
    openLaunchSheet
})

</script>

<style lang='scss' scoped>

</style>