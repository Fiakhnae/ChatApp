import { http } from "@/api/http";

export type ChatPermissions = {
  canAddMembers: boolean;
  canLeaveChat: boolean;
  canDeleteChat: boolean;
  canUpdateName: boolean;
  canRemoveMembers: boolean;
};

export type ChatResponse = {
  id: string;
  name: string;
  createdAtUtc: string;
  chatMembersCount: number;
};

export type ChatMemberResponse = {
  userId: string;
  username: string;
  role: number;
  joinedAt: string;
};

export type ChatDetailedResponse = {
  id: string;
  name: string;
  ownerId: string;
  createdAtUtc: string;
  members: ChatMemberResponse[];
  currentUserRole: number;
  permissions: ChatPermissions;
};

export type ChatMessageResponse = {
  id: string;
  senderId: string;
  senderUsername: string;
  content: string;
  sentAtUtc: string;
};

export type CreateChatRequest = {
  name: string;
};

export type AddChatMemberRequest = {
  username: string;
};

export type RemoveChatMemberRequest = {
  userId: string;
};

export type SendMessageRequest = {
  message: string;
};

export const chatApi = {
  getChats: async () => {
    const { data } = await http.get<ChatResponse[]>("/chats");
    return data;
  },

  getChatById: async (chatId: string) => {
    const { data } = await http.get<ChatDetailedResponse>(`/chats/${chatId}`);
    return data;
  },

  getMessages: async (chatId: string) => {
    const { data } = await http.get<ChatMessageResponse[]>(`/chats/${chatId}/messages`);
    return data;
  },

  createChat: async (body: CreateChatRequest) => {
    const { data } = await http.post<ChatDetailedResponse>("/chats", body);
    return data;
  },

  sendMessage: async (chatId: string, body: SendMessageRequest) => {
    const { data } = await http.post<ChatMessageResponse>(`/chats/${chatId}/messages`, body);
    return data;
  },

  addMember: async (chatId: string, body: AddChatMemberRequest) => {
    await http.post(`/chats/${chatId}/members`, body);
  },

  removeMember: async (chatId: string, body: RemoveChatMemberRequest) => {
    await http.delete(`/chats/${chatId}/members`, {
      data: body,
    });
  },

  deleteChat: async (chatId: string) => {
    await http.delete(`/chats/${chatId}`);
  },
};