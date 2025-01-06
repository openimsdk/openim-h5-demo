<template>
  <div class="flex h-full flex-col">
    <ConversationHeader />
    <ConversationList />
  </div>
</template>

<script name="conversation" setup lang="ts">
import ConversationHeader from './components/ConversationHeader.vue'
import ConversationList from './components/ConversationList.vue'

const emit = defineEmits([])
</script>

<style lang="scss" scoped>
:deep(.van-search) {
  padding-top: 0 !important;
}
</style>
