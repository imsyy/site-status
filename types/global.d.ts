import type {
  MessageApi,
  DialogApi,
  NotificationApi,
  LoadingBarApi,
  ModalApi,
} from "naive-ui";

declare global {
  interface Window {
    // naiveui
    $message: MessageApi;
    $dialog: DialogApi;
    $notification: NotificationApi;
    $loadingBar: LoadingBarApi;
    $modal: ModalApi;
  }
}
