export {};

declare global {
  interface Window {
    userClick: (userID?: string, groupID?: string) => void;
  }
}
