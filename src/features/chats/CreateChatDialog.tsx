import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

const schema = z.object({
  name: z.string().min(1, "Chat name is required").max(100, "Too long"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
};

export default function CreateChatDialog({
  open,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = async (values: FormValues) => {
    await onSubmit(values);
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Create chat</DialogTitle>

      <DialogContent>
        <Stack sx={{ pt: 1 }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                label="Chat name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(submit)} variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}