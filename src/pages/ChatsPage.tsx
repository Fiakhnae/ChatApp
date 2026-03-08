import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { type ChatMemberResponse, chatApi } from "@api/chatApi";
import { useAuth } from "@auth/useAuth";
import CreateChatDialog from "@/features/chats/CreateChatDialog";
import AddMemberDialog from "@/features/chats/AddMemberDialog";
import ChatMessagesPanel from "@/features/chats/ChatMessagesPanel";
import ChatMessageComposer from "@/features/chats/ChatMessageComposer";
import { useState } from "react";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

function toRole(value: number) {
  switch (value) {
    case 0:
      return "Owner";
    case 1:
      return "Member"
    case 2:
      return "Admin";
  }
}

function ChatMembersDialog({
  open,
  onClose,
  chatName,
  members,
}: {
  open: boolean;
  onClose: () => void;
  chatName: string;
  members: ChatMemberResponse[];
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{chatName} members</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={1.5}>
          {members.map((member) => (
            <Card key={member.userId} variant="outlined">
              <Box sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar>
                    {member.username?.[0]?.toUpperCase() ?? "U"}
                  </Avatar>

                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Typography fontWeight={600} noWrap>
                      {member.username}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" noWrap>
                      Joined: {formatDate(member.joinedAt)}
                    </Typography>
                  </Box>

                  <Typography variant="body2" fontWeight={600}>
                    {toRole(member.role)}
                  </Typography>
                </Stack>
              </Box>
            </Card>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

function DeleteChatDialog({
  open,
  chatName,
  isDeleting,
  onClose,
  onConfirm,
}: {
  open: boolean;
  chatName: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onClose={isDeleting ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete chat</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete{" "}
          <strong>{chatName || "this chat"}</strong>?
        </DialogContentText>

        <DialogContentText sx={{ mt: 1 }}>
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button color="error" variant="contained" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ChatsPage() {
  const navigate = useNavigate();
  const params = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const selectedChatId = params.chatId;
  const [membersOpen, setMembersOpen] = useState(false);
  const [createChatOpen, setCreateChatOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [deleteChatOpen, setDeleteChatOpen] = useState(false);

  const chatsQuery = useQuery({
    queryKey: ["chats"],
    queryFn: chatApi.getChats,
  });

  const chatDetailsQuery = useQuery({
    queryKey: ["chat", selectedChatId],
    queryFn: () => chatApi.getChatById(selectedChatId!),
    enabled: !!selectedChatId,
  });

  const messagesQuery = useQuery({
    queryKey: ["chat-messages", selectedChatId],
    queryFn: () => chatApi.getMessages(selectedChatId!),
    enabled: !!selectedChatId,
  });

  const createChatMutation = useMutation({
    mutationFn: chatApi.createChat,
    onSuccess: async (createdChat) => {
      await queryClient.invalidateQueries({ queryKey: ["chats"] });
      await queryClient.invalidateQueries({ queryKey: ["chat", createdChat.id] });

      setCreateChatOpen(false);
      navigate(`/chats/${createdChat.id}`);
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: (payload: { chatId: string; username: string }) =>
      chatApi.addMember(payload.chatId, { username: payload.username }),
    onSuccess: async () => {
      if (!selectedChatId) return;

      await queryClient.invalidateQueries({ queryKey: ["chats"] });
      await queryClient.invalidateQueries({ queryKey: ["chat", selectedChatId] });

      setAddMemberOpen(false);
    },
  });

  const leaveChatMutation = useMutation({
    mutationFn: (payload: { chatId: string; userId: string }) =>
      chatApi.removeMember(payload.chatId, { userId: payload.userId }),
    onSuccess: async () => {
      if (selectedChatId) {
        await queryClient.invalidateQueries({ queryKey: ["chats"] });
        queryClient.removeQueries({ queryKey: ["chat", selectedChatId] });
      }

      navigate("/chats");
    },
  });

  const deleteChatMutation = useMutation({
    mutationFn: (chatId: string) => chatApi.deleteChat(chatId),
    onSuccess: async (_, deletedChatId) => {
      await queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.removeQueries({ queryKey: ["chat", deletedChatId] });

      setDeleteChatOpen(false);
      navigate("/chats");
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: (payload: { chatId: string; message: string }) =>
      chatApi.sendMessage(payload.chatId, { message: payload.message }),
    onSuccess: async () => {
      if (!selectedChatId) return;

      await queryClient.invalidateQueries({
        queryKey: ["chat-messages", selectedChatId],
      });
    },
  });

  const chats = chatsQuery.data ?? [];

  const chat = chatDetailsQuery.data;
  const permissions = chat?.permissions;

  const messages = messagesQuery.data ?? [];

  const handleSendMessage = async (text: string) => {
    if (!selectedChatId) return;

    await sendMessageMutation.mutateAsync({
      chatId: selectedChatId,
      message: text,
    });
  };

  return (
    <Box sx={{ display: "flex", flex: 1, minWidth: 0 }}>
      <Box
        sx={{
          width: 320,
          flexShrink: 0,
          borderRight: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="h5" fontWeight={700}>
              Chats
            </Typography>

            <Tooltip title="Create chat">
              <IconButton onClick={() => setCreateChatOpen(true)}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Your conversations
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          {chatsQuery.isLoading && (
            <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          )}

          {chatsQuery.isError && (
            <Box sx={{ p: 2 }}>
              <Alert severity="error">
                {(chatsQuery.error as Error).message || "Failed to load chats"}
              </Alert>
            </Box>
          )}

          {!chatsQuery.isLoading && !chatsQuery.isError && chats.length === 0 && (
            <Box sx={{ p: 2 }}>
              <Card variant="outlined">
                <Box sx={{ p: 2 }}>
                  <Stack spacing={1.5}>
                    <Typography fontWeight={600}>No chats yet</Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => setCreateChatOpen(true)}
                    >
                      Create chat
                    </Button>
                  </Stack>
                </Box>
              </Card>
            </Box>
          )}

          {!chatsQuery.isLoading && !chatsQuery.isError && chats.length > 0 && (
            <List sx={{ p: 1 }}>
              {chats.map((chatItem) => (
                <ListItemButton
                  key={chatItem.id}
                  component={RouterLink}
                  to={`/chats/${chatItem.id}`}
                  selected={chatItem.id === selectedChatId}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemText
                    primary={chatItem.name}
                    secondary={`${chatItem.chatMembersCount} members`}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            minHeight: 72,
            px: 3,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {!selectedChatId ? (
            <Stack spacing={0.5}>
              <Typography variant="h6" fontWeight={700}>
                Select a chat
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose a chat from the list on the left.
              </Typography>
            </Stack>
          ) : chatDetailsQuery.isLoading ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <CircularProgress size={24} />
              <Typography>Loading chat...</Typography>
            </Stack>
          ) : chatDetailsQuery.isError ? (
            <Alert severity="error" sx={{ width: "100%" }}>
              {(chatDetailsQuery.error as Error).message || "Failed to load chat details"}
            </Alert>
          ) : chat ? (
            <>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h6" fontWeight={700} noWrap>
                  {chat.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {chat.members.length} members · your role: {toRole(chat.currentUserRole)}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Tooltip title="Members">
                  <IconButton onClick={() => setMembersOpen(true)}>
                    <InfoOutlinedIcon />
                  </IconButton>
                </Tooltip>

                {permissions?.canAddMembers && (
                  <Tooltip title="Add users">
                    <IconButton onClick={() => setAddMemberOpen(true)}>
                      <GroupAddIcon />
                    </IconButton>
                  </Tooltip>
                )}

                {permissions?.canLeaveChat && (
                  <Tooltip title="Leave chat">
                    <span>
                      <IconButton
                        color="warning"
                        onClick={() => {
                          if (!selectedChatId || !user?.id) return;

                          void leaveChatMutation.mutateAsync({
                            chatId: selectedChatId,
                            userId: user.id,
                          });
                        }}
                        disabled={leaveChatMutation.isPending}
                      >
                        <LogoutOutlinedIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}

                {permissions?.canDeleteChat && (
                  <Tooltip title="Delete chat">
                    <span>
                      <IconButton
                        color="error"
                        onClick={() => setDeleteChatOpen(true)}
                        disabled={deleteChatMutation.isPending}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </Stack>
            </>
          ) : null}
        </Box>

        <Box sx={{ flexGrow: 1, p: 3, minHeight: 0 }}>
          {chat ? (
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                minHeight: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {messagesQuery.isLoading ? (
                <Box sx={{ flexGrow: 1, display: "grid", placeItems: "center" }}>
                  <CircularProgress />
                </Box>
              ) : messagesQuery.isError ? (
                <Box sx={{ p: 2 }}>
                  <Alert severity="error">
                    {(messagesQuery.error as Error).message || "Failed to load messages"}
                  </Alert>
                </Box>
              ) : (
                <ChatMessagesPanel
                  messages={messages}
                  currentUserId={user?.id}
                />
              )}

              <ChatMessageComposer
                onSend={handleSendMessage}
                isSending={sendMessageMutation.isPending}
                disabled={!selectedChatId}
              />
            </Card>
          ) : null}
        </Box>
      </Box>

      <ChatMembersDialog
        open={membersOpen}
        onClose={() => setMembersOpen(false)}
        chatName={chat?.name ?? "Chat"}
        members={chat?.members ?? []}
      />

      <CreateChatDialog
        open={createChatOpen}
        onClose={() => setCreateChatOpen(false)}
        isSubmitting={createChatMutation.isPending}
        onSubmit={async (values) => {
          await createChatMutation.mutateAsync({
            name: values.name,
          });
        }}
      />

      <AddMemberDialog
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        isSubmitting={addMemberMutation.isPending}
        onSubmit={async (values) => {
          if (!selectedChatId) return;

          await addMemberMutation.mutateAsync({
            chatId: selectedChatId,
            username: values.username,
          });
        }}
      />

      <DeleteChatDialog
        open={deleteChatOpen}
        chatName={chat?.name ?? "this chat"}
        isDeleting={deleteChatMutation.isPending}
        onClose={() => setDeleteChatOpen(false)}
        onConfirm={() => {
          if (!selectedChatId) return;
          void deleteChatMutation.mutateAsync(selectedChatId);
        }}
      />
    </Box>
  );
}