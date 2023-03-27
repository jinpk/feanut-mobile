export type NotificationAction =
  | 'pull' // 투표수신
  | 'poll'; // 신규투표

export interface NotificationData {
  action: NotificationAction;
  value: string; // action: payload인 경우만 pollingId
}

export interface NotificationUserConfig {
  fcmToken?: string;
  receivePoll: boolean;
  receivePull: boolean;
}

export interface PutNotificationUserConfigRequest {
  fcmToken?: string;
  receivePoll?: boolean;
  receivePull?: boolean;
}
