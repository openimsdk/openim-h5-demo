<template>
  <div class="flex h-full flex-col overflow-hidden">
    <ChatHeader />
    <ChatContent :multipleCheckVisible="multipleCheckVisible" />
    <ChatFooter v-show="!multipleCheckVisible" />
  </div>
</template>

<script name="chat" setup lang="ts">
import ChatHeader from './components/ChatHeader.vue'
import ChatContent from './components/ChatContent.vue'
import ChatFooter from './components/ChatFooter/ChatFooter.vue'
import useConversationState from './useConversationState'

const { multipleCheckVisible } = useConversationState()
</script>

<style lang="scss" scoped></style>
