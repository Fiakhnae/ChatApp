import { http } from "@/api/http";
import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";

let connection: signalR.HubConnection | null = null;
export const getHubConnection = () => connection;

export type User = {
  id: string;
  username: string;
};

export type SignInRequest = { 
  usernameOrEmail: string; 
  password: string, 
  rememberMe: boolean 
};

export type SignUpRequest = { 
  email: string; 
  username?: string, 
  password: string, 
  gender: number, 
  birthDate?: string, 
  rememberMe: boolean 
};

type OnGroupAssignedPayload = {
  groupName: string;
  chatId: string;
};

let onGroupAssigned: ((payload: OnGroupAssignedPayload) => void) | null = null;

export const setOnGroupAssigned = (cb: typeof onGroupAssigned) => {
  onGroupAssigned = cb;
};

export const authApi = {
  me: async () => {
    const { data } = await http.get<User>("/auth/me");
    localStorage.setItem('id', data.id);
    return data;
  },

  signIn: async (body: SignInRequest) => {
    await http.post<string>("/auth/sign-in", body);

    // const { data } = await http.get<User>("/auth/me");

// connection = new signalR.HubConnectionBuilder()
//     .withUrl("http://localhost:5143/hubs/user", {
//   withCredentials: true,
//   transport: signalR.HttpTransportType.WebSockets
// })
//     .withAutomaticReconnect()
//     .build();

//   try {
//   await connection.start();
// } catch (err) {
//   console.error("SignalR failed:", err);
// }

//   await connection.invoke("JoinUserGroup", data.id);

// connection.on(
//   "OnGroupAssigned",
//   (payload: OnGroupAssignedPayload) => {
//     console.log(payload.groupName);
//     console.log(payload.chatId);

//     toast.info(`New message in group ${payload.groupName}`);

//     onGroupAssigned?.(payload);
//   }
// );

  },

  signUp: async (body: SignUpRequest) => {
    await http.post<string>("/auth/sign-up", body);
  },

  signOut: async () => {
    await http.post("/auth/sign-out");
  },

  signOutAll: async () => {
    await http.post("/auth/sign-out-all");
  },
};