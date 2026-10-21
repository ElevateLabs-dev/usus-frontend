import { apiClient } from "@/services/api-client";

import type {
  NotificationItem,
  NotificationType,
} from "@/types/notifications";

interface BackendNotification {
  id: string;
  kind: string;
  title: string;
  body: string;
  link: string | null;
  created_at: string;
  read_at: string | null;
}

interface BackendNotificationList {
  items: BackendNotification[];
  unread_count: number;
}

const TYPES: Record<string, NotificationType> = {
  evaluation_ready: "evaluation",
  session_completed: "achievement",
  scenario_added: "training",
};

function toItem(
  notification: BackendNotification,
): NotificationItem {
  return {
    id: notification.id,
    title: notification.title,
    message: notification.body,
    type: TYPES[notification.kind] ?? "system",
    createdAt: notification.created_at,
    read: notification.read_at !== null,
    href: notification.link ?? undefined,
  };
}

export async function getNotifications(): Promise<
  NotificationItem[]
> {
  const data =
    await apiClient<BackendNotificationList>(
      "/notifications/",
    );

  return data.items.map(toItem);
}

export async function markNotificationRead(
  id: string,
): Promise<void> {
  await apiClient(`/notifications/${id}/read`, {
    method: "POST",
  });
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient("/notifications/read-all", {
    method: "POST",
  });
}
