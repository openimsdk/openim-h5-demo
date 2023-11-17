import { PopoverAction } from "vant";
import add_friend from "@/assets/images/conversation/add_friend.png";
import add_group from "@/assets/images/conversation/add_group.png";
import scan from "@/assets/images/conversation/scan.png";
import create_group from "@/assets/images/conversation/create_group.png";

// i18n
import { i18n } from "@/i18n";
// @ts-ignore
const { t, locale } = i18n.global;

export const ConversationTopMoreActions: PopoverAction[] = [
  {
    text: t("scanQr"),
    icon: scan,
  },
  {
    text: t("addFriend"),
    icon: add_friend,
  },
  {
    text: t("addGroup"),
    icon: add_group,
  },
  {
    text: t("launchGroup"),
    icon: create_group,
  },
];
