"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Check } from "lucide-react";

import { useNotificationSocket } from "@/components/providers/realtime-provider";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import type { INotification } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import { getNotifications, markNotificationAsRead } from "@/services/notification.service";

function notificationText(notification: INotification) {
  const preview = notification.payload.messagePreview;
  if (typeof preview === "string") return preview;
  return notification.type.replaceAll("_", " ");
}

export default function NotificationBell() {
  const { socket, unreadCount, setUnreadCount } = useNotificationSocket();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    getNotifications()
      .then((data) => {
        if (!active) return;
        setNotifications(data);
        setUnreadCount(data.filter((notification) => !notification.isRead).length);
      })
      .catch((error) => {
        if (active) toast.add({ type: "error", description: getApiErrorMessage(error) });
      });
    return () => {
      active = false;
    };
  }, [setUnreadCount]);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: INotification) => {
      setNotifications((current) => [notification, ...current.filter((item) => item.id !== notification.id)]);
      setUnreadCount((count) => count + 1);
    };

    socket.on("new-notification", handleNotification);
    return () => {
      socket.off("new-notification", handleNotification);
    };
  }, [setUnreadCount, socket]);

  useEffect(() => {
    if (!open) return;
    function handleOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  async function markRead(notification: INotification) {
    if (notification.isRead) return;
    try {
      await markNotificationAsRead(notification.id);
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, isRead: true } : item
        )
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((current) => !current)}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            {unreadCount > 0 && <span className="text-xs text-muted-foreground">{unreadCount} unread</span>}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">No notifications yet.</p>
            ) : (
              notifications.slice(0, 20).map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => void markRead(notification)}
                  className={`flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted ${notification.isRead ? "" : "bg-muted/50"}`}
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {notification.isRead ? <Check className="size-3" /> : <Bell className="size-3" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-medium capitalize">{notification.type.replaceAll("_", " ")}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{notificationText(notification)}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
