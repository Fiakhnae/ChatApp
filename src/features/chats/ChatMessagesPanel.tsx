import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import type { ChatMessageResponse } from "@api/chatApi";

type Props = {
  messages: ChatMessageResponse[];
  currentUserId?: string;
};

function formatMessageTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMessageDate(value: string) {
  return new Date(value).toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function isSameDay(a: string, b: string) {
  const dateA = new Date(a);
  const dateB = new Date(b);

  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export default function ChatMessagesPanel({
  messages,
  currentUserId,
}: Props) {
  if (messages.length === 0) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          display: "grid",
          placeItems: "center",
          px: 3,
        }}
      >
        <Stack spacing={1} alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            No messages yet
          </Typography>
          <Typography color="text.secondary" align="center">
            Send the first message to start this conversation.
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: 0,
        overflowY: "auto",
        px: 2,
        py: 2,
      }}
    >
      <Stack spacing={1.25}>
        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const showDateSeparator =
            !previous || !isSameDay(previous.sentAtUtc, message.sentAtUtc);

          const isOwnMessage = message.senderId === currentUserId;

          return (
            <Box key={message.id}>
              {showDateSeparator && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      px: 1.25,
                      py: 0.5,
                      borderRadius: 999,
                      bgcolor: "action.hover",
                    }}
                  >
                    {formatMessageDate(message.sentAtUtc)}
                  </Typography>
                </Box>
              )}

              <Stack
                direction="row"
                spacing={1}
                justifyContent={isOwnMessage ? "flex-end" : "flex-start"}
                alignItems="flex-end"
              >
                {!isOwnMessage && (
                  <Avatar sx={{ width: 30, height: 30 }}>
                    {message.senderUsername?.[0]?.toUpperCase() ?? "U"}
                  </Avatar>
                )}

                <Paper
                  variant="outlined"
                  sx={{
                    maxWidth: "min(75%, 720px)",
                    px: 1.25,
                    py: 0.875,
                    borderRadius: 2,
                    bgcolor: isOwnMessage ? "primary.main" : "background.paper",
                    color: isOwnMessage ? "primary.contrastText" : "text.primary",
                    borderColor: isOwnMessage ? "primary.main" : "divider",
                  }}
                >
                  <Stack spacing={0.35}>
                    {!isOwnMessage && (
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        sx={{ opacity: 0.9 }}
                      >
                        {message.senderUsername}
                      </Typography>
                    )}

                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {message.content}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        alignSelf: "flex-end",
                        opacity: 0.75,
                      }}
                    >
                      {formatMessageTime(message.sentAtUtc)}
                    </Typography>
                  </Stack>
                </Paper>
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}