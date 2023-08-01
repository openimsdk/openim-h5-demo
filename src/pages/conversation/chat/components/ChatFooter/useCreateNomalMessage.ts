import { feedbackToast } from "@/utils/common";
import { IMSDK, getCleanText } from "@/utils/imCommon";
import { MessageItem } from "open-im-sdk-wasm/lib/types/entity";
import { Ref } from "vue";

type CreateNomalMessageProps = {
  messageContent: Ref<string>;
};

export default function useCreateNomalMessage({
  messageContent,
}: CreateNomalMessageProps) {
  const getCleanTextWithBr = () => {
    let text = messageContent.value;
    text = parseEmojiFace(text);
    text = text.replace(/<div>/g, "\n").replace(/<\/div>/g, "");
    return getCleanText(text);
  };

  const parseEmojiFace = (text: string) => {
    const faceEls = Array.from(
      document.getElementsByClassName("face_el")
    ) as HTMLImageElement[];
    faceEls.map((face) => {
      const escapedOut = face.outerHTML.replace(
        /[-\/\\^$*+?.()|[\]{}]/g,
        "\\$&"
      );
      text = text.replace(new RegExp(escapedOut, "g"), face.alt);
    });
    return text;
  };

  const getTextMessage = async () => {
    const formattedText = getCleanTextWithBr();
    return (await IMSDK.createTextMessage(formattedText)).data;
  };

  const switchNomalMessage = async () => {
    let message: MessageItem;
    message = await getTextMessage();
    if (!message) {
      feedbackToast({
        error: "create message failed",
        message: "create message failed",
      });
      return;
    }
    return message;
  };

  return {
    switchNomalMessage,
    getCleanText,
  };
}
