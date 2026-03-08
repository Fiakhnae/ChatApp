import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "@auth/useAuth";

const signInSchema = z.object({
  usernameOrEmail: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignIn() {
  const { signIn, isSigningIn } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = (loc.state as { from?: string } | null)?.from || "/profile";

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    try {
      await signIn(values);
      nav(from, { replace: true });
    } catch (e) {
      setError("root", {
        message: (e as Error).message || "Login failed",
      });
    }
  };

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)", display: "grid", placeItems: "center", p: 2 }}>
      <Card sx={{ width: "100%", maxWidth: 460 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Sign in
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Login to continue to your account.
              </Typography>
            </Box>

            {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <Controller
                  name="usernameOrEmail"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email or Username"
                      fullWidth
                      error={!!errors.usernameOrEmail}
                      helperText={errors.usernameOrEmail?.message}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="password"
                      label="Password"
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />

                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label="Remember me"
                    />
                  )}
                />

                <Button type="submit" variant="contained" size="large" disabled={isSigningIn}>
                  {isSigningIn ? "Signing in..." : "Sign in"}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Don&apos;t have an account?{" "}
              <Link component={RouterLink} to="/sign-up" underline="hover">
                Sign up
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}