import type { IUser } from "./user.interface";

export interface IConversationMessage {
  id: string;
  content: string;
  senderId: string;
  isRead: boolean;
  createdAt: string;
}

export interface IConversation {
  applicationId: string;
  startupTitle: string;
  otherUser: Pick<IUser, "id" | "fullName"> & { photo: string | null };
  lastMessage: IConversationMessage | null;
  unreadCount: number;
}

export interface INewMessagePayload {
  id: string;
  applicationId: string;
  content: string;
  senderId: string;
  createdAt: string;
}
