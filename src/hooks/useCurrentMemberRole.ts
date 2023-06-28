import useConversationStore from "@/store/modules/conversation";
import { GroupRole } from "open-im-sdk-wasm/lib/types/enum";

export default function useCurrentMemberRole(groupID?: string) {
  const conversationStore = useConversationStore();

  const inSameGroup = computed(
    () =>
      conversationStore.storeCurrentMemberInGroup.groupID ===
      (groupID ?? conversationStore.storeCurrentGroupInfo.groupID)
  );

  const currentRole = computed(
    () => conversationStore.storeCurrentMemberInGroup.roleLevel
  );

  const isOwner = computed(
    () => inSameGroup.value && currentRole.value === GroupRole.Owner
  );

  const isAdmin = computed(
    () => inSameGroup.value && currentRole.value === GroupRole.Admin
  );

  const isNomal = computed(
    () => inSameGroup.value && currentRole.value === GroupRole.Nomal
  );

  return {
    isOwner,
    isAdmin,
    isNomal,
    inSameGroup,
    currentRole,
  };
}
