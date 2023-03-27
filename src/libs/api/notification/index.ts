import {feanutAPI} from '..';
import {
  NotificationUserConfig,
  PutNotificationUserConfigRequest,
} from '../../interfaces';

export const patchNotificationUserConfig = async (
  userId: string,
  data: PutNotificationUserConfigRequest,
): Promise<void> => {
  const res = await feanutAPI.patch<void>(
    `/notifications/users/${userId}/config`,
    data,
  );
  return res.data;
};

export const getNotificationUserConfig = async (
  userId: string,
): Promise<NotificationUserConfig> => {
  const res = await feanutAPI.get<NotificationUserConfig>(
    `/notifications/users/${userId}/config`,
  );
  return res.data;
};
