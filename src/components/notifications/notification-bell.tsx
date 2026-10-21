"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell } from "lucide-react";

import { NotificationModal } from "@/components/notifications/notification-modal";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notification-service";

import type { NotificationItem } from "@/types/notifications";

// How often to check for new notifications.
const REFRESH_MS = 60_000;

export function NotificationBell() {
  const [open, setOpen] = useState(false);

  const [items, setItems] = useState<
    NotificationItem[]
  >([]);

  const refresh = useCallback(() => {
    getNotifications()
      .then(setItems)
      .catch(() => {
        // Keep the last list; try again next time.
      });
  }, []);

  useEffect(() => {
    refresh();

    const timer = window.setInterval(
      refresh,
      REFRESH_MS,
    );

    return () => window.clearInterval(timer);
  }, [refresh]);

  const unreadCount = items.filter(
    (item) => !item.read,
  ).length;

  function handleOpen() {
    setOpen(true);
    refresh();
  }

  function handleRead(id: string) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, read: true }
          : item,
      ),
    );

    void markNotificationRead(id).catch(refresh);
  }

  function handleReadAll() {
    setItems((current) =>
      current.map((item) => ({
        ...item,
        read: true,
      })),
    );

    void markAllNotificationsRead().catch(refresh);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        className="relative hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--usus-text-muted)] transition-all duration-200 hover:bg-[var(--usus-sidebar-hover)] hover:text-[var(--usus-text)] focus:outline-none focus:ring-2 focus:ring-[var(--usus-primary)] md:flex"
      >
        <Bell size={19} strokeWidth={1.8} />

        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--usus-primary)] px-1 text-[9px] font-bold text-black">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <NotificationModal
        open={open}
        notifications={items}
        onClose={() => setOpen(false)}
        onNotificationRead={handleRead}
        onMarkAllAsRead={handleReadAll}
      />
    </>
  );
}
