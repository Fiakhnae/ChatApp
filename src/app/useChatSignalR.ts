import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

type OnGroupAssignedPayload = {
  groupName: string;
  chatId: string;
};

export function useChatSignalR() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5143/hubs/user", {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("OnGroupAssigned", (payload: OnGroupAssignedPayload) => {
      toast.info(`New message in ${payload.groupName}`);

      queryClient.invalidateQueries({
        queryKey: ["chat-messages", payload.chatId],
      });

      console.log(`${payload.groupName}`);

      // 👉 важливо: не завжди треба авто-open
      navigate(`/chats/${payload.chatId}`);
    });

    var userId = localStorage.getItem('id');
    console.log(userId);
    connection.start()
  .then(() => {
    connection.invoke("JoinUserGroup", userId);
  })
  .catch(console.error);

    return () => {
      connection.stop();
    };
  }, [navigate, queryClient]);
}