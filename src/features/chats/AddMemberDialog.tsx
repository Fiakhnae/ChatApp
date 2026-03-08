import { z } from "zod";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

const schema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(100, "Username is too long"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
};

function getAddMemberErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (typeof data === "string" && data.trim()) {
      return data;
    }

    if (data && typeof data === "object") {
      const maybeMessage =
        (data as { message?: string }).message ||
        (data as { title?: string }).title ||
        (data as { error?: string }).error;

      if (maybeMessage) {
        return maybeMessage;
      }
    }

    switch (status) {
      case 400:
        return "Invalid request.";
      case 403:
        return "You do not have permission to add members to this chat.";
      case 404:
        return "User or chat was not found.";
      case 409:
        return "This user is already a member of the chat.";
      default:
        return "Failed to add member.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Failed to add member.";
}

export default function AddMemberDialog({
  open,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
    },
  });

  const handleClose = () => {
    reset();
    clearErrors();
    onClose();
  };

  const submit = async (values: FormValues) => {
    try {
      await onSubmit({
        username: values.username.trim(),
      });

      reset();
    } catch (error) {
      setError("root", {
        message: getAddMemberErrorMessage(error),
      });
    }
  };

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Add user to chat</DialogTitle>

      <DialogContent>
        <Stack sx={{ pt: 1 }} spacing={2}>
          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                label="Username"
                fullWidth
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(submit)}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}