<template>
    <div @click="clickItem" class="flex justify-between px-[22px] py-3 bg-white"
        :class="{'border-b border-[rgba(153,153,153,0.3)] last:border-0':border}">
        <div>{{title}}</div>
        <div>
            <van-switch v-if="showSwitch" size="20" :loading="loading" :model-value="checked"
                @update:model-value="onUpdateValue" />
            <div class="flex items-center text-[#999]" v-else>
                <slot>
                    <div>{{subTitle}}</div>
                </slot>

                <van-icon v-if="arrow" name="arrow" size="19" />
            </div>

        </div>
    </div>
</template>

<script setup lang='ts'>

type SettingRowItemProps = {
    checked?: boolean;
    loading?: boolean;
    border?: boolean;
    arrow?: boolean;
    showSwitch?: boolean;
    title: string;
    subTitle?: string;
}

type SettingRowItemEmits = {
    (event: 'updateValue', newValue: boolean): void;
    (event: 'clickItem'): void;
}

const emit = defineEmits<SettingRowItemEmits>();
const props = withDefaults(defineProps<SettingRowItemProps>(), {
    loading: false,
    border: true,
    arrow: true,
    showSwitch: false,
});

const onUpdateValue = (newValue: boolean) => {
    emit('updateValue', newValue)
};

const clickItem = () => {
    emit('clickItem')
}
</script>

<style lang='scss' scoped>

</style>