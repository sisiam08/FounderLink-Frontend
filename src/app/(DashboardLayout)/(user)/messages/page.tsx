"use client";

import {  useState } from "react";
import { MessageSquare } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { EmptyState } from "@/components/shared/empty-state";
import { SkeletonRows } from "@/components/shared/skeletons";
import { Card } from "@/components/ui/card";
import type { IConversation, IUser } from "@/interfaces";
import { initials } from "@/helpers/string-utils";
import { formatConversationTime } from "@/helpers/date-utils";

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const activeThread = searchParams.get("thread");
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto flex h-[calc(100dvh-7rem)] min-h-0 max-w-5xl flex-col gap-4 overflow-hidden">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {conversations.length} conversation{conversations.length === 1 ? "" : "s"}
        </p>
      </div>

      {loading ? (
        <SkeletonRows />
      ) : error ? (
        <Card className="p-6 text-sm text-destructive">{error}</Card>
      ) : conversations.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="size-12" />}
          title="No conversations yet"
          description="Messaging becomes available after an application is accepted."
          actionLabel="View applications"
          actionHref="/applications/mine"
        />
      ) : (
        <div className="grid min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card md:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className={`min-h-0 border-border md:border-r ${activeThread ? "hidden md:flex" : "flex"} flex-col`}>
            <div className="border-b border-border px-4 py-3 text-sm font-medium">Conversations</div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
              {conversations.map((conversation) => {
                const name = conversation.otherUser?.fullName || conversation.startupTitle || "Unknown";
                const unread = conversation.unreadCount > 0;
                return (
                  <button
                    key={conversation.applicationId}
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted ${activeThread === conversation.applicationId ? "bg-muted" : ""}`}
                  >
                    <div className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {initials(name)}
                      {unread && <span className="absolute -top-1 -right-1 size-2 rounded-full bg-destructive" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`truncate text-sm ${unread ? "font-semibold" : "font-medium"}`}>{name}</p>
                        <span className="shrink-0 text-[10px] text-muted-foreground">{formatConversationTime(conversation.lastMessage?.createdAt)}</span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{conversation.lastMessage?.content ?? conversation.startupTitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
