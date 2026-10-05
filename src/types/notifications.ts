export type NotificationType =
  | "training"
  | "evaluation"
  | "system"
  | "achievement";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  read: boolean;
  href?: string;
};