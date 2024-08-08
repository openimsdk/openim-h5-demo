import useConversationStore from "@/store/modules/conversation";
import { IMSDK } from "@/utils/imCommon";
import { GroupMemberRole } from "@openim/wasm-client-sdk";

export default function useCurrentMemberRole(groupID?: string) {
  const inSameGroup = ref(true);
  const conversationStore = useConversationStore();

  const currentRole = computed(
    () => conversationStore.storeCurrentMemberInGroup.roleLevel
  );

  const isOwner = computed(
    () => inSameGroup.value && currentRole.value === GroupMemberRole.Owner
  );

  const isAdmin = computed(
    () => inSameGroup.value && currentRole.value === GroupMemberRole.Admin
  );

  const isNomal = computed(
    () => inSameGroup.value && currentRole.value === GroupMemberRole.Normal
  );

  watch(
    () => conversationStore.storeCurrentGroupInfo.groupID,
    (newVal) => {
      if (newVal) {
        async function checkGroupMembership() {
          try {
            const { data } = await IMSDK.isJoinGroup<boolean>(
              groupID as string
            );
            inSameGroup.value = data;
          } catch (error) {
            inSameGroup.value = false;
          }
        }

        checkGroupMembership();
      }
    },
    {
      immediate: true,
    }
  );

  return {
    isOwner,
    isAdmin,
    isNomal,
    inSameGroup,
    currentRole,
  };
}
