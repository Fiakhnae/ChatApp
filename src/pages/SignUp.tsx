import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "@auth/useAuth";

const signUpSchema = z.object({
  email: z.email("Invalid email"),
  username: z.string().min(3, "Username must be at least 3 characters").optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.number().int().min(0).max(1),
  birthDate: z.string().optional(),
  rememberMe: z.boolean(),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const { signUp, isSigningUp } = useAuth();
  const nav = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      gender: 0,
      birthDate: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      await signUp({
        ...values,
        username: values.username || undefined,
        birthDate: values.birthDate || undefined,
      });
      nav("/profile");
    } catch (e) {
      setError("root", {
        message: (e as Error).message || "Register failed",
      });
    }
  };

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)", display: "grid", placeItems: "center", p: 2 }}>
      <Card sx={{ width: "100%", maxWidth: 520 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Sign up
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Create a new account.
              </Typography>
            </Box>

            {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="email"
                      label="Email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />

                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Username"
                      fullWidth
                      error={!!errors.username}
                      helperText={errors.username?.message}
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
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.gender}>
                      <InputLabel id="gender-label">Gender</InputLabel>
                      <Select
                        labelId="gender-label"
                        label="Gender"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      >
                        <MenuItem value={0}>Male</MenuItem>
                        <MenuItem value={1}>Female</MenuItem>
                      </Select>
                      <FormHelperText>{errors.gender?.message}</FormHelperText>
                    </FormControl>
                  )}
                />

                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      label="Birth date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.birthDate}
                      helperText={errors.birthDate?.message}
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

                <Button type="submit" variant="contained" size="large" disabled={isSigningUp}>
                  {isSigningUp ? "Creating..." : "Create account"}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link component={RouterLink} to="/sign-in" underline="hover">
                Sign in
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}