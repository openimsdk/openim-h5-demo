import { InviteData } from "@/pages/rtc/data";
import mitt, { Emitter } from 'mitt'

type Events = {
  CHAT_MAIN_SCROLL_TO_BOTTOM: boolean
  CHAT_MAIN_SCROLL_TO_CLIENTMSGID: string
  TYPING_UPDATE: void
  ONLINE_STATE_CHECK: void
  KEYBOARD_UPDATE: void
  AT_SOMEONE: any
  OPEN_RTC_MODAL: InviteData
  CLOSE_RTC_MODAL: void
}

const emitter: Emitter<Events> = mitt<Events>()

export default emitter
