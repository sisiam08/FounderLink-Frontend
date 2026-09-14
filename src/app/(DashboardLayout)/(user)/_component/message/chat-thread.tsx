"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import type { IConversation, IMessage, INewMessagePayload } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import { getMessages } from "@/services/message.service";
import { useChatSocket } from "@/components/providers/realtime-provider";
import { initials } from "@/helpers/string-utils";

export default function ChatThread({
  applicationId,
  conversation,
  currentUserId,
  onBack,
}: {
  applicationId: string;
  conversation?: IConversation;
  currentUserId?: string;
  onBack: () => void;
}) {
  const { socket, connected } = useChatSocket();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [liveMessages, setLiveMessages] = useState<INewMessagePayload[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLiveMessages([]);
    getMessages(applicationId)
      .then((data) => {
        if (active) setMessages(data);
      })
      .catch((error) => {
        if (active) {
          toast.add({ type: "error", description: getApiErrorMessage(error) });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [applicationId]);

  useEffect(() => {
    if (!socket || !connected) return;

    socket.emit("join-room", applicationId, (response: { success?: boolean; message?: string }) => {
      if (!response?.success) {
        toast.add({
          type: "error",
          description: response?.message ?? "Unable to open conversation",
        });
      }
    });

    const handleNewMessage = (message: INewMessagePayload) => {
      if (message.applicationId !== applicationId) return;
      setLiveMessages((current) =>
        current.some((item) => item.id === message.id)
          ? current
          : [...current, message]
      );
    };

    socket.on("new-message", handleNewMessage);
    return () => {
      socket.off("new-message", handleNewMessage);
      socket.emit("leave-room", applicationId);
    };
  }, [applicationId, connected, socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveMessages]);

  const liveIds = new Set(liveMessages.map((message) => message.id));
  const allMessages = [
    ...messages,
    ...liveMessages
      .filter((message) => !messages.some((item) => item.id === message.id))
      .map(
        (message): IMessage => ({
          id: message.id,
          content: message.content,
          createdAt: message.createdAt,
          isRead: false,
          sender: { id: message.senderId } as IMessage["sender"],
        })
      ),
  ].filter((message) => !liveIds.has(message.id) || !messages.some((item) => item.id === message.id));

  function sendMessage() {
    const text = content.trim();
    if (!text || !socket?.connected || sending) return;

    setSending(true);
    socket.emit(
      "send-message",
      { applicationId, content: text },
      (response: { success?: boolean; message?: INewMessagePayload; error?: string }) => {
        setSending(false);
        if (!response?.success || !response.message) {
          toast.add({
            type: "error",
            description: response?.error ?? "Message could not be sent",
          });
          return;
        }
        setContent("");
        setLiveMessages((current) =>
          current.some((item) => item.id === response.message?.id)
            ? current
            : [...current, response.message as INewMessagePayload]
        );
      }
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack} aria-label="Back to conversations">
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {initials(conversation?.otherUser?.fullName ?? "?")}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium">{conversation?.otherUser?.fullName ?? "Conversation"}</p>
          <p className="truncate text-xs text-muted-foreground">{conversation?.startupTitle ?? "Application conversation"}</p>
        </div>
        <span className="ml-auto text-xs text-muted-foreground">
          {connected ? "Connected" : "Connecting..."}
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 sm:p-6">
        {loading ? (
          <Skeleton className="h-full min-h-40 w-full" />
        ) : allMessages.length === 0 ? (
          <EmptyState title="No messages yet" description="Send the first message to start the conversation." />
        ) : (
          allMessages.map((message) => {
            const own = message.sender?.id === currentUserId;
            return (
              <div key={message.id} className={`flex ${own ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${own ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
                  <p className="mt-1 text-[10px] opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        className="flex items-end gap-2 border-t border-border p-3"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Write a message..."
          rows={1}
          disabled={!connected || sending}
          className="max-h-32 min-h-10 resize-none"
        />
        <Button type="submit" size="icon" disabled={!connected || sending || !content.trim()} aria-label="Send message">
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}
