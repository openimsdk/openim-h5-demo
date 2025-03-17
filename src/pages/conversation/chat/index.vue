<template>
  <div class="flex h-full flex-col overflow-hidden">
    <ChatHeader />
    <ChatContent />
    <ChatFooter />
  </div>
</template>

<script name="chat" setup lang="ts">
import ChatHeader from './components/ChatHeader.vue'
import ChatContent from './components/ChatContent.vue'
import ChatFooter from './components/ChatFooter/ChatFooter.vue'
import useConversationState from './useConversationState'

useConversationState()
</script>

<style lang="scss" scoped></style>
