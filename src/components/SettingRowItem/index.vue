<template>
  <div
    @click="clickItem"
    class="flex items-center justify-between bg-white px-4 py-3"
    :class="{ 'border-b border-[rgba(153,153,153,0.3)] last:border-0': border }"
  >
    <div :class="{ 'text-error-text': danger }">{{ title }}</div>
    <div class="flex items-center justify-between">
      <van-switch
        v-if="showSwitch"
        size="20"
        :loading="loading"
        :model-value="checked"
        @update:model-value="onUpdateValue"
      />
      <div class="flex items-center justify-between text-[#999]" v-else>
        <slot>
          <div>{{ subTitle }}</div>
        </slot>

        <img v-if="arrow" class="h-[24px] w-[24px]" :src="back" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import back from '@assets/images/profile/back.png'

type SettingRowItemProps = {
  checked?: boolean
  loading?: boolean
  border?: boolean
  arrow?: boolean
  showSwitch?: boolean
  title: string
  subTitle?: string
  danger?: boolean
}

type SettingRowItemEmits = {
  (event: 'updateValue', newValue: boolean): void
  (event: 'clickItem'): void
}

const emit = defineEmits<SettingRowItemEmits>()
const props = withDefaults(defineProps<SettingRowItemProps>(), {
  loading: false,
  border: false,
  arrow: true,
  showSwitch: false,
})

const onUpdateValue = (newValue: boolean) => {
  emit('updateValue', newValue)
}

const clickItem = () => {
  emit('clickItem')
}
</script>

<style lang="scss" scoped></style>
