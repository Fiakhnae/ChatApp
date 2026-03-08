import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, type SignInRequest, type SignUpRequest } from "@api/authApi";
import { useAuthStore } from "@auth/authStore";

export function useAuth() {
  const queryClient = useQueryClient();

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const isAuthResolved = useAuthStore((s) => s.isAuthResolved);
  const clear = useAuthStore((s) => s.clear);

  const refresh = async () => {
    try {
      const me = await authApi.me();
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    }
  };

  const signInMutation = useMutation({
    mutationFn: (values: SignInRequest) => authApi.signIn(values),
    onSuccess: async () => {
      const me = await authApi.me();
      setUser(me);
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (values: SignUpRequest) => authApi.signUp(values),
    onSuccess: async () => {
      const me = await authApi.me();
      setUser(me);
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const signOutMutation = useMutation({
    mutationFn: authApi.signOut,
    onSuccess: async () => {
      clear();
      queryClient.removeQueries({ queryKey: ["profile"] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const signOutAllMutation = useMutation({
    mutationFn: authApi.signOutAll,
    onSuccess: async () => {
      clear();
      queryClient.removeQueries({ queryKey: ["profile"] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  return {
    user,
    loading: !isAuthResolved,
    authenticated: !!user,
    refresh,

    signIn: signInMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    signOutAll: signOutAllMutation.mutateAsync,

    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    isSigningOutAll: signOutAllMutation.isPending,
  };
}