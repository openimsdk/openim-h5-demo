import { showToast } from "vant";
import { minioUpload } from "@api/im_api";
import { MinioUploadType } from "@api/data";
import { cosUpload } from "./cos";
import PinYin from "./pinyin";

// i18n
import { i18n } from "@/i18n";
import { FriendItem } from "open-im-sdk-wasm/lib/types/entity";
// @ts-ignore
const { t } = i18n.global;

type FeedbackToastParams = {
  message?: string;
  error?: unknown;
  duration?: number;
  onClose?: () => void;
};

export const feedbackToast = (config?: FeedbackToastParams) => {
  const { message, error, duration, onClose = () => {} } = config ?? {};
  showToast({
    message:
      message ??
      t(error ? "messageTip.nomalFailed" : "messageTip.nomalSuccess"),
    type: error ? "fail" : "success",
    onClose,
    duration,
  });
  if (error) {
    console.error(message, error);
  }
};

export const sec2Time = (seconds: number) => {
  var theTime1 = 0; // min
  var theTime2 = 0; // hour
  var theTime3 = 0; // day
  if (seconds > 60) {
    theTime1 = parseInt((seconds / 60) as unknown as string);
    seconds = parseInt((seconds % 60) as unknown as string);
    if (theTime1 > 60) {
      theTime2 = parseInt((theTime1 / 60) as unknown as string);
      theTime1 = parseInt((theTime1 % 60) as unknown as string);
      if (theTime2 > 24) {
        theTime3 = parseInt((theTime2 / 24) as unknown as string);
        theTime2 = parseInt((theTime2 % 24) as unknown as string);
      }
    }
  }
  var result = "";
  if (seconds > 0) {
    result = "" + parseInt(seconds as unknown as string) + t("date.seconds");
  }
  if (theTime1 > 0) {
    result =
      "" + parseInt(theTime1 as unknown as string) + t("date.minutes") + result;
  }
  if (theTime2 > 0) {
    result =
      "" + parseInt(theTime2 as unknown as string) + t("date.hours") + result;
  }
  if (theTime3 > 0) {
    result =
      "" + parseInt(theTime3 as unknown as string) + t("date.days") + result;
  }
  return result;
};

export const bytesToSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  var k = 1024,
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));

  return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
};

export const secFormat = (sec: any) => {
  let h: any;
  let s: any;
  h = Math.floor(sec / 60);
  s = sec % 60;
  h += "";
  s += "";
  h = h.length === 1 ? "0" + h : h;
  s = s.length === 1 ? "0" + s : s;
  return h + ":" + s;
};

export const blobToDataURL = (blob: File, cb: (base64: string) => void) => {
  let reader = new FileReader();
  reader.onload = function (evt) {
    let base64 = evt.target?.result;
    cb(base64 as string);
  };
  reader.readAsDataURL(blob);
};

export const getPicInfo = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const _URL = window.URL || window.webkitURL;
    const img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.src = _URL.createObjectURL(file);
  });
};

export const getMediaDuration = (path: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const vel = new Audio(path);
    vel.onloadedmetadata = async function () {
      resolve(vel.duration);
    };
  });
};

export const getVideoSnshot = (item: string): Promise<File> => {
  return new Promise((reslove, reject) => {
    var video = document.createElement("VIDEO") as HTMLVideoElement;
    video.setAttribute("autoplay", "autoplay");
    video.setAttribute("muted", "muted");
    video.innerHTML = "<source src=" + item + ' type="audio/mp4">';
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    video.addEventListener("canplay", function () {
      var anw = document.createAttribute("width");
      //@ts-ignore
      anw.nodeValue = video.videoWidth;
      var anh = document.createAttribute("height");
      //@ts-ignore
      anh.nodeValue = video.videoHeight;
      canvas.setAttributeNode(anw);
      canvas.setAttributeNode(anh);
      //@ts-ignore
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      var base64 = canvas.toDataURL("image/png");
      //@ts-ignore
      video.pause();
      const file = base64toFile(base64);
      reslove(file);
    });
  });
};

export const base64toFile = (base64Str: string) => {
  var arr = base64Str.split(","),
    fileType = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], `screenshot${Date.now()}.png`, {
    type: fileType,
  });
};

export const switchUpload = (
  file: File,
  progressFunc?: (progress: number) => void,
  snapShot?: File
) => {
  if (process.env.OBJECT_STORAGE === "minio") {
    return minioUpload(file, MinioUploadType.File, snapShot, progressFunc);
  }
  return cosUpload(file, progressFunc);
};

export const genAvatar = (str: string, size: number) => {
  let colors = ["#5496EB"];
  let cvs = document.createElement("canvas");
  const fontRadio = str ? 0.4 : 0.2;
  cvs.setAttribute("width", size as unknown as string);
  cvs.setAttribute("height", size as unknown as string);
  let ctx = cvs.getContext("2d");
  ctx!.fillStyle = colors[Math.floor(Math.random() * colors.length)];
  ctx!.fillRect(0, 0, size, size);
  ctx!.fillStyle = "rgb(255,255,255)";
  ctx!.font = size * fontRadio + "px Arial";
  ctx!.textBaseline = "middle";
  ctx!.textAlign = "center";
  ctx!.fillText(
    str ? str.slice(str.length > 1 ? -2 : -1) : "UnKnow",
    size / 2,
    size / 2
  );
  return cvs.toDataURL("image/png", 1);
};

export const formatContacts = (data: FriendItem[], key = "nickname") => {
  const ucfirst = (l1: any) => {
    if (l1.length > 0) {
      var first = l1.substr(0, 1).toUpperCase();
      var spare = l1.substr(1, l1.length);
      return first + spare;
    }
  };

  const arraySearch = (l1: any, l2: any) => {
    for (var name in PinYin) {
      // @ts-ignore
      if (PinYin[name].indexOf(l1) != -1) {
        return ucfirst(name);
        break;
      }
    }
    return false;
  };

  const codefans = (l1: any) => {
    l1 = l1 ?? "unkown";
    var l2 = l1.length;
    var I1 = "";
    var reg = new RegExp("[a-zA-Z0-9- ]");
    for (var i = 0; i < l2; i++) {
      var val = l1.substr(i, 1);
      var name = arraySearch(val, PinYin);
      if (reg.test(val)) {
        I1 += val;
      } else if (name !== false) {
        I1 += name;
      }
    }
    I1 = I1.replace(/ /g, "-");
    while (I1.indexOf("--") > 0) {
      I1 = I1.replace("--", "-");
    }
    return I1;
  };

  var arr = [],
    firstName;

  for (var i = 0; i < data.length; i++) {
    // @ts-ignore
    firstName = data[i].initial = codefans(data[i][key]).substr(0, 1);
    arr.push(firstName.toUpperCase());
  }

  var arrlist = [];
  for (i = 0; i < arr.length; i++) {
    if (arrlist.indexOf(arr[i]) == -1) {
      arrlist.push(arr[i]);
    }
  }

  var dataSort = [] as any[];
  for (var i = 0; i < arrlist.length; i++) {
    dataSort[i] = {
      initial: arrlist[i],
    };
    dataSort[i].data = [];
    for (var j = 0; j < data.length; j++) {
      // @ts-ignore
      if (data[j].initial.toUpperCase() == dataSort[i].initial) {
        dataSort[i].data.push(data[j]);
      }
    }
  }
  for (var i = 0; i < dataSort.length - 1; i++) {
    for (var j = 1; j < dataSort.length - i; j++) {
      if (dataSort[j - 1].initial > dataSort[j].initial) {
        var a = dataSort[j];
        dataSort[j] = dataSort[j - 1];
        dataSort[j - 1] = a;
      }
    }
  }
  const NomalInitial = "QWERTYUIOPLKJHGFDSAZXCVBNM".split("");
  const special = {
    initial: "#",
    data: [] as any[],
  };
  const newFilterData = dataSort.filter((d) => {
    if (!NomalInitial.includes(d.initial)) {
      special.data = [...special.data, ...d.data];
    } else {
      return d;
    }
  });
  if (special.data.length > 0) {
    newFilterData.push(special);
  }
  const indexList = newFilterData.map((item) => item.initial);
  const dataList = newFilterData.map((item) => item.data);
  return {
    indexList,
    dataList,
  };
};

export const filterEmptyValue = (obj: Record<string, unknown>) => {
  for (let key in obj) {
    if (obj[key] === "") {
      delete obj[key];
    }
  }
};

export const checkIsSafari = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

export const downloadFile = (filePath: string, filename: string) => {
  const linkNode = document.createElement("a");
  linkNode.download = filename;
  linkNode.style.display = "none";
  linkNode.href = filePath;
  document.body.appendChild(linkNode);
  linkNode.click();
  document.body.removeChild(linkNode);
};
