"use client";

import { IConversation } from "@/interfaces";

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
  return (
    <div>
      Chat Thread
    </div>
  )
}