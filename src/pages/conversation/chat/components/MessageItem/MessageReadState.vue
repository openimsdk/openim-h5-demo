<template>
  <div
    class="mt-0.5 text-[12px] text-[#999]"
    :class="{ '!text-[#006AFF]': message.isRead }"
  >
    {{ readStateStr }}
  </div>
</template>

<script setup lang="ts">
import { SessionType } from "@openim/wasm-client-sdk";
import { ExedMessageItem } from "./data";

type MessageReadStateProps = {
  message: ExedMessageItem;
  disabled?: boolean;
};

const props = defineProps<MessageReadStateProps>();

const { t } = useI18n();

const readStateStr = computed(() => {
  if (props.message.sessionType === SessionType.Single) {
    return props.message.isRead ? t("readed") : t("unread");
  }
});
</script>

<style lang="scss" scoped></style>
