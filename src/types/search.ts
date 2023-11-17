import { ExMessageItem } from "@/store/modules/message";

export type SearchResultItems = {
  conversationID: string;
  showName: string;
  faceURL: string;
  messageCount: number;
  messageList: ExMessageItem[];
};

export type MessageInfo = {
  searchResultItems: SearchResultItems[] | null;
};