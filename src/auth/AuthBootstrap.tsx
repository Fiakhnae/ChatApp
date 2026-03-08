import { ReactNode, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress } from "@mui/material";
import { authApi } from "@api/authApi";
import { useAuthStore } from "@auth/authStore";

type Props = {
  children: ReactNode;
};

export function AuthBootstrap({ children }: Props) {
  const setUser = useAuthStore((s) => s.setUser);
  const setAuthResolved = useAuthStore((s) => s.setAuthResolved);
  const isAuthResolved = useAuthStore((s) => s.isAuthResolved);

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    retry: false,
  });

  useEffect(() => {
    if (meQuery.isSuccess) {
      setUser(meQuery.data);
      setAuthResolved(true);
    }
  }, [meQuery.isSuccess, meQuery.data, setUser, setAuthResolved]);

  useEffect(() => {
    if (meQuery.isError) {
      setUser(null);
      setAuthResolved(true);
    }
  }, [meQuery.isError, setUser, setAuthResolved]);

  if (!isAuthResolved && meQuery.isPending) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}