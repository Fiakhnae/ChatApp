import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./auth/RequireAuth";
import { useAuth } from "./auth/useAuth";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import HomePage from "./pages/HomePage";
import ChatsPage from "./pages/ChatsPage";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";

function GuestOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/chats" replace />;
  }

  return <>{children}</>;
}

function RootPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <HomePage />;
  }

  return <Navigate to="/chats" replace />;
}

function NotFound() {
  return <div style={{ padding: 16 }}>Not found</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootPage />} />

      <Route
        path="/sign-in"
        element={
          <GuestOnly>
            <SignIn />
          </GuestOnly>
        }
      />

      <Route
        path="/sign-up"
        element={
          <GuestOnly>
            <SignUp />
          </GuestOnly>
        }
      />

      <Route
        element={
          <RequireAuth>
            <AuthenticatedLayout />
          </RequireAuth>
        }
      >
        <Route path="/chats" element={<ChatsPage />} />
        <Route path="/chats/:chatId" element={<ChatsPage />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}