import mitt, { Emitter } from "mitt";

type Events = {
  CHAT_MAIN_SCROLL_TO_BOTTOM: boolean;
  CHAT_MAIN_SCROLL_TO_CLIENTMSGID: string;
  TYPING_UPDATE: void;
  ONLINE_STATE_CHECK: void;
  UPDATE_MULTIPLE_CHECK_STATE: boolean;
  KEYBOARD_UPDATE: void;
  AT_SOMEONE: any;
};

const emitter: Emitter<Events> = mitt<Events>();

export default emitter;
