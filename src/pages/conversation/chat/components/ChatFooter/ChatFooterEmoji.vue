<template>
    <div ref="target" class="h-[204px] px-3 py-3 flex flex-wrap overflow-y-auto">
        <div @click="clickEmoji(emoji)" class="px-2 flex items-center justify-center" v-for="emoji in imageEmojis">
            <!-- <span class="text-2xl">{{emoji}}</span> -->
            <van-image :src="emoji.src" width="40" height="30"/>
        </div>
    </div>
</template>

<script setup lang='ts'>
import {imageEmojis} from '@/constants/emoji';
import { onClickOutside } from '@vueuse/core';

type ChatFooterEmojiEmits = {
    (event: 'closeEmojiBar'): void;
    (event: 'emojiClick', emoji: typeof imageEmojis[0]): void;
}

const emit = defineEmits<ChatFooterEmojiEmits>();

const target = ref(null)
onClickOutside(target, () => emit('closeEmojiBar'),{
    ignore: ['.custom_rich_input']
})

const clickEmoji = (emoji: typeof imageEmojis[0]) => {
    emit('emojiClick', emoji)
}


</script>

<style lang='scss' scoped>

</style>