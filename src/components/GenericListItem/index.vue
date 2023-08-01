<template>
  <div class="px-[22px] h-[66px] flex items-center" @click="$emit('clickItem',source)">
    <div v-if="showCheck" class="mr-3 relative">
      <van-icon v-show="!checked" name="circle" color="#979797" size="20" />
      <van-icon v-show="checked" name="checked" size="20" color="#1D6BED" />
      <div
        v-show="disabled"
        class="w-5 h-5 rounded-full absolute top-0 left-0 bg-[#c8c9cc]"
      ></div>
    </div>

    <Avatar :src="source.faceURL" :size="iconSize" :is-group="(!!source.conversationID || !!source.groupName) && !!source.groupID" :desc="source.remark||source.nickname||source.showName" />

    <div
      class="flex justify-between items-center w-full h-full ml-4 border-b border-[#F1F1F1]"
      :class="{ '!border-0': noBorder }"
    >
      <div class="w-full">
        <div class="flex">
          <div class="max-w-[60%] truncate">{{ getTitle }}</div>
          <div
            v-if="isAdmin || isOwner"
            class="text-xs px-3 py-1 rounded-xl ml-3"
            :class="{
              'bg-[#f4da9a] text-[#ff8c00]': isOwner,
              'bg-[#a2c9f8] text-[#2691ed]': isAdmin,
            }"
          >
            {{ $t(isOwner ? "groupOwner" : "groupAdmin") }}
          </div>
        </div>
        <div v-if="subKey" class="text-[#999] text-[13px]">
          {{ getSubTitle }}
        </div>
      </div>
      <div>
        <van-button v-if="showRemove" size="small" class="!border-none w-max" @click="remove" plain type="primary">移除</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GroupMemberRole } from "open-im-sdk-wasm/lib/types/enum";
import { GenericListItemSource } from "./data";
import Avatar from "../Avatar/index.vue";

type GenericListItemProps = {
  source: Partial<GenericListItemSource>;
  subKey?: string;
  iconSize?: number;
  index?: number;
  total?: number;
  showCheck?: boolean;
  checked?: boolean;
  disabled?: boolean;
  showRemove?: boolean;
};

type GenericListItemEmits = {
  (event: "remove", item: Partial<GenericListItemSource>): void;
  (event: "clickItem", item: Partial<GenericListItemSource>): void;
};

const props = withDefaults(defineProps<GenericListItemProps>(), {
  iconSize: 42,
});
const emit = defineEmits<GenericListItemEmits>();

const noBorder = computed(() => {
  if (props.index !== undefined && props.total !== undefined) {
    return props.index === props.total - 1;
  }
  return false;
});

const getTitle = computed(
  () => props.source.remark || props.source.nickname || props.source.groupName || props.source.showName
);
const getSubTitle = computed(() => {
  if (!props.subKey) return;

  if (props.subKey === "memberCount") {
    return `${props.source.memberCount}人`;
  }
  return (props.source as any)[props.subKey];
});

const isAdmin = computed(() => props.source.roleLevel === GroupMemberRole.Admin);
const isOwner = computed(() => props.source.roleLevel === GroupMemberRole.Owner);

const remove = () => {
  emit("remove", props.source);
};
</script>

<style lang="scss" scoped></style>
