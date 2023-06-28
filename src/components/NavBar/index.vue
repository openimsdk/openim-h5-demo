<template>
    <van-nav-bar :title="title" placeholder fixed left-arrow :clickable="false" :border="false" @click-left="back">
        <template #left>
            <slot name="left">
                <van-icon color="#333" name="arrow-left" size="23" />
            </slot>
        </template>

        <template #right>
            <slot></slot>
        </template>
    </van-nav-bar>
</template>

<script setup lang='ts'>

type NavBarProps = {
    title?: string;
    router?: boolean;
}

type NavBarEmits = {
    (event: 'leftClick'): void;
}

const emit = defineEmits<NavBarEmits>();
const props = withDefaults(defineProps<NavBarProps>(), {
    router: true
})

const router = useRouter();

const back = () => {
    if (props.router) {
        router.back();
    } else {
        emit('leftClick')
    }
}

</script>

<style lang='scss' scoped>
:deep(.van-nav-bar__title) {
    font-weight: normal;
}
</style>