import type { INotification } from "@/interfaces";
import { httpGet, httpPatch } from "@/lib/http";

export const getNotifications = async (): Promise<INotification[]> => {
  const response = await httpGet<INotification[]>("/notification");
  return response.data;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await httpPatch(`/notification/${id}/read`);
};
