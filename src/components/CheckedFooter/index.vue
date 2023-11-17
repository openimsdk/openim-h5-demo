<template>
  <div class="h-20 px-[22px] py-2 flex justify-between bg-white" style="box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.15)">
    <div @click="showBottom = true">
      <div class="text-[#1B72EC] font-medium">
        <span>{{ $t('selected') }}：</span>
        <span>{{ $t('somePeople', { count: allCheckedList.length }) }}</span>
        <van-icon class="ml-2" name="arrow-up" />
      </div>
      <div class="text-xs text-[#666] line-clamp-1 max-w-[60vw] mt-1">
        <span v-for="(item, idx) in (allCheckedList as any[])" :key="item.userID || item.groupID">{{ `${item.remark ||
          item.nickname || item.groupName || item.showName}${idx === allCheckedList.length - 1
            ? '' : '、'}` }}</span>
      </div>
    </div>

    <van-button class="!text-sm !px-[13px] !h-[40px] !mt-1" type="primary" :disabled="allCheckedList.length === 0"
      :text="`${$t('buttons.confirm')} (${allCheckedList.length}/${total})`" size="mini" @click="confirmCheck" />

    <van-popup v-model:show="showBottom" position="bottom" round class="h-2/3">
      <div class="h-full flex flex-col">
        <div class="border-b border-b-[#F0F0F0] flex justify-between py-4 px-[22px]">
          <div class="text-[#333] font-medium">
            <span>{{ $t('selected') }}：</span>
            <span>{{ $t('somePeople', { count: allCheckedList.length }) }}</span>
          </div>
          <span class="text-[#1B72EC] font-medium" @click="showBottom = false">
            {{ $t('buttons.confirm') }}
          </span>
        </div>
        <virtual-list class="my_scrollbar flex-1 overflow-y-auto bg-white"
          :data-key="(item: any) => item.userID || item.groupID" :data-sources="allCheckedList"
          :data-component="GenericListItem" :estimate-size="88" :extra-props="{
            total: allCheckedList.length,
            showRemove: true,
            onRemove: (item: Partial<GenericListItemSource>) => emit('remove', item)
          }" />
      </div>
    </van-popup>
  </div>
</template>
  
<script setup lang='ts'>
import GenericListItem from '@/components/GenericListItem/index.vue';
import VirtualList from '@components/VirtualList';
import { GenericListItemSource } from '../GenericListItem/data';

type CheckedFooterProps = {
  allCheckedList: Partial<GenericListItemSource>[],
  total: number
}

defineProps<CheckedFooterProps>()
const emit = defineEmits(['remove', 'confirm'])

const showBottom = ref(false)

const confirmCheck = () => {
  emit('confirm')
}

</script>
  
<style lang='scss' scoped></style>