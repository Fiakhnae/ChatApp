import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100%",
        display: "grid",
        placeItems: "center",
        px: 3,
      }}
    >
      <Stack
        spacing={3}
        alignItems="center"
        maxWidth={560}
        textAlign="center"
      >
        <Typography
          sx={{
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: 2,
            background: "linear-gradient(45deg,#1976d2,#42a5f5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          AppChat
        </Typography>

        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          Fast and simple messaging
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
        >
          AppChat is a lightweight messaging application that allows you
          to create chats, invite members and exchange messages instantly
          in a clean and modern interface.
        </Typography>

        <Stack direction="row" spacing={2} pt={1}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/sign-up")}
          >
            Create account
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/sign-in")}
          >
            Sign in
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}