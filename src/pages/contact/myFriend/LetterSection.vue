<template>
  <div
    class="flex h-[23px] items-center justify-start bg-[#E8EAEF] pl-5 text-xs text-sub-text"
  >
    {{ letterStr }}
  </div>
</template>

<script lang="ts" setup>
type LetterSection = {
  letterStr: string
}
defineProps<LetterSection>()
</script>
