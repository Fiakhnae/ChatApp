import { useEffect, useState } from "react";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Box, IconButton, Paper, Stack, TextField } from "@mui/material";

type Props = {
  disabled?: boolean;
  isSending?: boolean;
  onSend: (text: string) => Promise<void>;
};

export default function ChatMessageComposer({
  disabled,
  isSending,
  onSend,
}: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (disabled) {
      setValue("");
    }
  }, [disabled]);

  const submit = async () => {
    const text = value.trim();
    if (!text || disabled || isSending) return;

    await onSend(text);
    setValue("");
  };

  return (
    <Box
      sx={{
        p: 2,
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          px: 1.5,
          py: 1,
          borderRadius: 2,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <TextField
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type a message..."
            fullWidth
            multiline
            maxRows={5}
            variant="standard"
            disabled={disabled || isSending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void submit();
              }
            }}
            InputProps={{
              disableUnderline: true,
            }}
          />

          <IconButton
            color="primary"
            onClick={() => void submit()}
            disabled={disabled || isSending || !value.trim()}
          >
            <SendRoundedIcon />
          </IconButton>
        </Stack>
      </Paper>
    </Box>
  );
}