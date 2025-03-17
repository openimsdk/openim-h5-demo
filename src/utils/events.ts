import { InviteData } from "@/pages/rtc/data";
import mitt, { Emitter } from 'mitt'

type Events = {
  CHAT_MAIN_SCROLL_TO_BOTTOM: boolean
  KEYBOARD_UPDATE: void
  OPEN_RTC_MODAL: InviteData
  CLOSE_RTC_MODAL: void
}

const emitter: Emitter<Events> = mitt<Events>()

export default emitter
