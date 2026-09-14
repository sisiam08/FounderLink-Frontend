import type {
  IConversation,
  IMessage,
} from "@/interfaces";
import { httpGet } from "@/lib/http";

export const getConversations = async (): Promise<IConversation[]> => {
  const response = await httpGet<IConversation[]>("/message/conversations");
  return response.data;
};

export const getMessages = async (applicationId: string): Promise<IMessage[]> => {
  const response = await httpGet<IMessage[]>(`/message/${applicationId}`);
  return response.data;
};

export const getUnreadMessageCount = async (): Promise<number> => {
  const response = await httpGet<{ count: number }>("/message/unread-count");
  return response.data.count;
};

export const getUnreadMessagesByApplication = async (): Promise<
  Record<string, number>
> => {
  const response = await httpGet<Record<string, number>>(
    "/message/unread-each-application"
  );
  return response.data;
};
