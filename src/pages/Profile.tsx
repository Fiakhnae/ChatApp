import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { userApi } from "@api/userApi";
import { useAuth } from "@auth/useAuth";

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        {value}
      </Typography>
    </Box>
  );
}

export default function Profile() {
  const { signOut, signOutAll, isSigningOut, isSigningOutAll } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: userApi.profile,
  });

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Profile
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Your account information.
            </Typography>
          </Box>

          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          )}

          {isError && (
            <Alert severity="error">
              {(error as Error).message || "Failed to fetch profile"}
            </Alert>
          )}

          {data && (
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <ProfileRow label="Email" value={data.email ?? "(no email)"} />
                  <ProfileRow label="Username" value={data.username ?? "(no username)"} />
                  <ProfileRow label="Gender" value={data.gender === 0 ? "Male" : "Female"} />
                  <ProfileRow
                    label="Birth date"
                    value={
                      data.birthDate
                        ? new Date(data.birthDate).toLocaleDateString()
                        : "(not specified)"
                    }
                  />
                  <ProfileRow
                    label="Joined"
                    value={new Date(data.createdOnUtc).toLocaleDateString()}
                  />
                </Stack>
              </CardContent>
            </Card>
          )}

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="warning"
              onClick={() => void signOut()}
              disabled={isSigningOut}
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={() => void signOutAll()}
              disabled={isSigningOutAll}
            >
              {isSigningOutAll ? "Signing out everywhere..." : "Sign out all"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}