<template>
  <div class="page_container">
    <NavBar :title="$t('profileMenu.language')" />

    <div class="m-[10px] overflow-hidden rounded-md">
      <div
        v-for="(item, i) in language"
        @click="clickItem(item.value)"
        class="flex items-center justify-between bg-white px-4 py-3"
        :class="{ 'border-t': i > 0 }"
      >
        <div>{{ item.label }}</div>
        <div class="flex items-center justify-between">
          <div class="flex items-center justify-between text-[#999]">
            <img
              v-if="currentLanguage === item.value"
              class="h-[24px] w-[24px]"
              :src="select"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar/index.vue'
import { localLanguage, setLanguage } from '@/i18n'
import select from '@assets/images/setting/select.png'

const { t, locale } = useI18n()

const language = [
  { label: t('language.zhCN'), value: 'zh-CN' },
  { label: t('language.enUS'), value: 'en-US' },
]

watch(locale, () => {
  language[0].label = t('language.zhCN')
  language[1].label = t('language.enUS')
})

const currentLanguage = ref('zh-CN')

onMounted(() => {
  currentLanguage.value = localLanguage()
})

const clickItem = (item: string) => {
  currentLanguage.value = item
  setLanguage(item)
}
</script>
