"use client";

import { useMemo } from "react";
import {
  Award,
  Bell,
  CheckCircle2,
  GraduationCap,
  Settings,
  X,
} from "lucide-react";

import type {
  NotificationItem,
  NotificationType,
} from "@/types/notifications";

interface NotificationModalProps {
  open: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
  onNotificationRead: (
    notificationId: string,
  ) => void;
  onMarkAllAsRead: () => void;
}

function getNotificationIcon(
  type: NotificationType,
) {
  switch (type) {
    case "evaluation":
      return <CheckCircle2 size={18} />;

    case "training":
      return <GraduationCap size={18} />;

    case "achievement":
      return <Award size={18} />;

    case "system":
      return <Settings size={18} />;

    default:
      return <Bell size={18} />;
  }
}

function getNotificationLabel(
  type: NotificationType,
) {
  switch (type) {
    case "evaluation":
      return "Evaluation";

    case "training":
      return "Training";

    case "achievement":
      return "Achievement";

    case "system":
      return "System";

    default:
      return "Notification";
  }
}

function formatNotificationDate(
  createdAt: string,
) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function NotificationModal({
  open,
  notifications,
  onClose,
  onNotificationRead,
  onMarkAllAsRead,
}: NotificationModalProps) {
  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (notification) => !notification.read,
      ).length,
    [notifications],
  );

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-start
        justify-end
        bg-black/20
        px-4
        pt-[80px]
        sm:px-6
        sm:pt-[100px]
        lg:px-8
      "
      role="dialog"
      aria-modal="true"
      aria-label="Notifications"
      onClick={onClose}
    >
      <div
        className="
          w-full
          max-w-md
          max-h-[calc(100vh-96px)]
          overflow-hidden
          rounded-2xl
          border
          border-[var(--usus-border)]
          bg-[var(--usus-surface)]
          shadow-2xl
        "
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            border-b
            border-[var(--usus-border)]
            px-5
            py-4
          "
        >
          <div>
            <div className="flex items-center gap-2">
              <Bell
                size={18}
                className="text-[var(--usus-text)]"
              />

              <h2
                className="
                  text-base
                  font-semibold
                  text-[var(--usus-text)]
                "
              >
                Notifications
              </h2>

              {unreadCount > 0 && (
                <span
                  className="
                    rounded-full
                    bg-[var(--usus-primary-soft)]
                    px-2
                    py-0.5
                    text-[10px]
                    font-semibold
                    text-[var(--usus-text)]
                  "
                >
                  {unreadCount} unread
                </span>
              )}
            </div>

            <p
              className="
                mt-1
                text-xs
                text-[var(--usus-text-muted)]
              "
            >
              Stay up to date with your training.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close notifications"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-[var(--usus-text-muted)]
              transition-colors
              hover:bg-[var(--usus-sidebar-hover)]
              hover:text-[var(--usus-text)]
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--usus-primary)]
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* =====================================================
            ACTION BAR
        ===================================================== */}

        {unreadCount > 0 && (
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-[var(--usus-border-soft)]
              px-5
              py-3
            "
          >
            <span
              className="
                text-xs
                text-[var(--usus-text-muted)]
              "
            >
              {unreadCount} notification
              {unreadCount !== 1 ? "s" : ""} to read
            </span>

            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="
                text-xs
                font-semibold
                text-[var(--usus-primary)]
                transition-colors
                hover:text-[var(--usus-primary-hover)]
                focus:outline-none
              "
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* =====================================================
            NOTIFICATION LIST
            FOUR ARE VISIBLE.
            MORE SCROLL VERTICALLY.
        ===================================================== */}

        <div
          className="
            max-h-[420px]
            overflow-y-auto
            sm:max-h-[420px]
            overscroll-contain
          "
        >
          {notifications.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Bell
                size={28}
                className="
                  mx-auto
                  text-[var(--usus-text-muted)]
                "
              />

              <p
                className="
                  mt-3
                  text-sm
                  font-medium
                  text-[var(--usus-text)]
                "
              >
                No notifications
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-[var(--usus-text-muted)]
                "
              >
                You&apos;re all caught up.
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
              const isUnread =
                !notification.read;

              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => {
                    onNotificationRead(
                      notification.id,
                    );

                    if (notification.href) {
                      window.location.href =
                        notification.href;
                    }
                  }}
                  className={`
                    group
                    flex
                    w-full
                    gap-3
                    border-b
                    border-[var(--usus-border-soft)]
                    px-5
                    py-4
                    text-left
                    transition-colors
                    duration-200
                    last:border-b-0
                    hover:bg-[var(--usus-sidebar-hover)]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-inset
                    focus:ring-[var(--usus-primary)]
                    ${
                      isUnread
                        ? "bg-[var(--usus-primary-soft)]/30"
                        : ""
                    }
                  `}
                >
                  {/* ICON */}

                  <span
                    className={`
                      mt-0.5
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      ${
                        isUnread
                          ? "bg-[var(--usus-primary-soft)] text-[var(--usus-text)]"
                          : "bg-[var(--usus-muted)] text-[var(--usus-text-muted)]"
                      }
                    `}
                  >
                    {getNotificationIcon(
                      notification.type,
                    )}
                  </span>

                  {/* CONTENT */}

                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span
                        className={`
                          text-sm
                          ${
                            isUnread
                              ? "font-semibold"
                              : "font-medium"
                          }
                          text-[var(--usus-text)]
                        `}
                      >
                        {notification.title}
                      </span>

                      {isUnread && (
                        <span
                          className="
                            mt-1
                            h-2
                            w-2
                            shrink-0
                            rounded-full
                            bg-[var(--usus-primary)]
                          "
                          aria-label="Unread"
                        />
                      )}
                    </span>

                    <span
                      className="
                        mt-1
                        block
                        text-xs
                        leading-5
                        text-[var(--usus-text-muted)]
                      "
                    >
                      {notification.message}
                    </span>

                    <span
                      className="
                        mt-2
                        flex
                        items-center
                        gap-2
                        text-[10px]
                        text-[var(--usus-text-soft)]
                      "
                    >
                      <span>
                        {getNotificationLabel(
                          notification.type,
                        )}
                      </span>

                      <span aria-hidden="true">
                        •
                      </span>

                      <span>
                        {formatNotificationDate(
                          notification.createdAt,
                        )}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};