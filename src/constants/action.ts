import { ActionSheetAction, PopoverAction } from "vant";
import more_scan from '@/assets/images/more_qr.png'
import more_add_friend from '@/assets/images/more_add_friend.png'
import more_add_group from '@/assets/images/more_add_group.png'
import more_create_group from '@/assets/images/more_create_group.png'

// i18n
import { i18n } from "@/i18n";
// @ts-ignore
const { t } = i18n.global;

export const ConversationTopMoreActions: PopoverAction[] = [
    {
        text: t('scanQr'),
        icon: more_scan
    },
    {
        text: t('addFriend'),
        icon: more_add_friend
    },
    {
        text: t('addGroup'),
        icon: more_add_group
    },
    {
        text: t('launchGroup'),
        icon: more_create_group
    },
]