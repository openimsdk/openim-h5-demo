<template>
  <div class="h-full flex flex-col">
    <ConversationHeader />
    <van-search background="#fff" readonly placeholder="搜索" @click-input="clickInput" />
    <ConversationList/>
  </div>
</template>

<script name="conversation" setup lang='ts'>
import ConversationHeader from "./components/ConversationHeader.vue";
import ConversationList from "./components/ConversationList.vue";

const emit = defineEmits([]);
const props = defineProps();

const router = useRouter();

const clickInput = () => {
  
}

</script>

<style lang='scss' scoped>

</style>