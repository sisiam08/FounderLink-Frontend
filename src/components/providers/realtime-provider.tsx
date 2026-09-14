"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type SetStateAction,
} from "react";
import { io, type Socket } from "socket.io-client";

import { envConfig } from "@/env";
import type { INewMessagePayload, INotification } from "@/interfaces";

interface ChatSocketContextValue {
  socket: Socket | null;
  connected: boolean;
}

interface NotificationSocketContextValue {
  socket: Socket | null;
  connected: boolean;
  unreadCount: number;
  setUnreadCount: (count: SetStateAction<number>) => void;
}

const ChatSocketContext = createContext<ChatSocketContextValue>({
  socket: null,
  connected: false,
});

const NotificationSocketContext =
  createContext<NotificationSocketContextValue | null>(null);

function getSocketOrigin() {
  return new URL(envConfig.NEXT_PUBLIC_API_URL).origin;
}

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);
  const [notificationSocket, setNotificationSocket] =
    useState<Socket | null>(null);
  const [chatConnected, setChatConnected] = useState(false);
  const [notificationConnected, setNotificationConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const origin = getSocketOrigin();
    const chat = io(`${origin}/chat`, {
      withCredentials: true,
      transports: ["websocket"],
    });
    const notifications = io(`${origin}/notifications`, {
      withCredentials: true,
      transports: ["websocket"],
    });

    const handleChatConnect = () => setChatConnected(true);
    const handleChatDisconnect = () => setChatConnected(false);
    const handleNotificationConnect = () => setNotificationConnected(true);
    const handleNotificationDisconnect = () => setNotificationConnected(false);
    const handleUnreadCount = (count: number) => setUnreadCount(count);

    chat.on("connect", handleChatConnect);
    chat.on("disconnect", handleChatDisconnect);
    notifications.on("connect", handleNotificationConnect);
    notifications.on("disconnect", handleNotificationDisconnect);
    notifications.on("unread-count", handleUnreadCount);

    setChatSocket(chat);
    setNotificationSocket(notifications);

    return () => {
      chat.off("connect", handleChatConnect);
      chat.off("disconnect", handleChatDisconnect);
      notifications.off("connect", handleNotificationConnect);
      notifications.off("disconnect", handleNotificationDisconnect);
      notifications.off("unread-count", handleUnreadCount);
      chat.disconnect();
      notifications.disconnect();
      setChatSocket(null);
      setNotificationSocket(null);
      setChatConnected(false);
      setNotificationConnected(false);
    };
  }, []);

  return (
    <ChatSocketContext.Provider
      value={{ socket: chatSocket, connected: chatConnected }}
    >
      <NotificationSocketContext.Provider
        value={{
          socket: notificationSocket,
          connected: notificationConnected,
          unreadCount,
          setUnreadCount,
        }}
      >
        {children}
      </NotificationSocketContext.Provider>
    </ChatSocketContext.Provider>
  );
}

export function useChatSocket() {
  return useContext(ChatSocketContext);
}

export function useNotificationSocket() {
  const context = useContext(NotificationSocketContext);
  if (!context) {
    throw new Error(
      "useNotificationSocket must be used within RealtimeProvider"
    );
  }
  return context;
}

export type { INewMessagePayload, INotification };
