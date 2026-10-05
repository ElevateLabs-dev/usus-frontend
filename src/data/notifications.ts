import type { NotificationItem } from "@/types/notifications";

export const notifications: NotificationItem[] = [
  {
    id: "notification-1",
    title: "Evaluation ready",
    message:
      "Your evaluation for Handling an Angry Customer is ready to review.",
    type: "evaluation",
    createdAt: "2026-08-26T10:30:00.000Z",
    read: false,
    href: "/evaluation/angry-customer-delivery?sessionId=session-001",
  },

  {
    id: "notification-2",
    title: "Training completed",
    message:
      "You completed the Refund Request training scenario.",
    type: "training",
    createdAt: "2026-08-25T14:15:00.000Z",
    read: false,
  },

  {
    id: "notification-3",
    title: "New scenario available",
    message:
      "A new advanced customer-service scenario is now available.",
    type: "training",
    createdAt: "2026-08-24T09:00:00.000Z",
    read: false,
    href: "/scenarios",
  },

  {
    id: "notification-4",
    title: "Performance update",
    message:
      "Your recent training performance has improved. Keep going.",
    type: "achievement",
    createdAt: "2026-08-23T16:45:00.000Z",
    read: true,
  },

  {
    id: "notification-5",
    title: "Keep practising",
    message:
      "Try another de-escalation scenario to strengthen your skills.",
    type: "training",
    createdAt: "2026-08-22T11:20:00.000Z",
    read: false,
  },

  {
    id: "notification-6",
    title: "System update",
    message:
      "Your training dashboard has been updated.",
    type: "system",
    createdAt: "2026-08-21T08:30:00.000Z",
    read: true,
  },
];