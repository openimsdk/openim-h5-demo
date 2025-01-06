<template>
  <div ref="target" class="flex h-[204px] flex-wrap overflow-y-auto bg-[#F0F2F6]">
    <emoji-picker emoji-version="15.0"></emoji-picker>
  </div>
</template>

<script setup lang="ts">
import { Picker } from 'emoji-picker-element'
import { onClickOutside } from '@vueuse/core'

const emojiPicker = new Picker({
  emojiVersion: 14,
  dataSource: `/emojis.json`,
})
emojiPicker.className = 'light w-full h-full'
const style = document.createElement('style')
style.textContent = `
    .search-row,.favorites {
      display: none;
    }
    .tabpanel::-webkit-scrollbar {
      width: 6px;
      background-color: transparent;
    }
    .tabpanel::-webkit-scrollbar-track {
      background: transparent;
    }
    .tabpanel::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background: #b7bdcb;
      box-shadow: 4px 4px 15px rgba(112, 124, 151, 0.05),
        2px 2px 10px rgba(112, 124, 151, 0.1), 1px 1px 50px rgba(112, 124, 151, 0.15);
    }
    .tabpanel::-webkit-scrollbar-thumb:hover {
      border-radius: 3px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: rgba(245, 238, 238, 1);
    }
`
emojiPicker.shadowRoot?.appendChild(style)

type ChatFooterEmojiEmits = {
  (event: 'closeEmojiBar'): void
  (event: 'emojiClick', emoji: string): void
}

const emit = defineEmits<ChatFooterEmojiEmits>()

const target = ref<HTMLDivElement>()
onClickOutside(target, () => emit('closeEmojiBar'), {
  ignore: ['.custom_rich_input'],
})

const emojiClickHander = (event: any) => {
  emit('emojiClick', event.detail.unicode!)
}

onMounted(() => {
  target.value?.appendChild(emojiPicker)
  emojiPicker.addEventListener('emoji-click', emojiClickHander)
})
</script>

<style lang="scss" scoped></style>
