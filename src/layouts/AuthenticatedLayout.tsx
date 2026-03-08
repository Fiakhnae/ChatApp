import { useState } from "react";
import { Link as RouterLink, Outlet, useLocation } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useAuth } from "@auth/useAuth";

const DRAWER_WIDTH_EXPANDED = 240;
const DRAWER_WIDTH_COLLAPSED = 76;

function SidebarItem({
  to,
  label,
  icon,
  selected,
  collapsed,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  collapsed: boolean;
}) {
  const item = (
    <ListItemButton
      component={RouterLink}
      to={to}
      selected={selected}
      sx={{
        minHeight: 48,
        px: collapsed ? 1.5 : 2,
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: 2,
        mx: 1,
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: collapsed ? 0 : 2,
          justifyContent: "center",
        }}
      >
        {icon}
      </ListItemIcon>

      {!collapsed && <ListItemText primary={label} />}
    </ListItemButton>
  );

  return collapsed ? (
    <Tooltip title={label} placement="right">
      {item}
    </Tooltip>
  ) : (
    item
  );
}

export default function AuthenticatedLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const drawerWidth = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            overflowX: "hidden",
            boxSizing: "border-box",
            borderRight: 1,
            borderColor: "divider",
            transition: (theme) =>
              theme.transitions.create("width", {
                duration: theme.transitions.duration.standard,
              }),
          },
        }}
      >
        <Box
          sx={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            px: collapsed ? 1 : 2,
          }}
        >
          {!collapsed && (
            <Typography variant="h6" fontWeight={700} noWrap>
              ChatApp
            </Typography>
          )}

          <Tooltip title={collapsed ? "Expand" : "Collapse"}>
            <IconButton onClick={() => setCollapsed((prev) => !prev)}>
              {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        <Divider />

        <Box sx={{ py: 2 }}>
          <List sx={{ display: "grid", gap: 0.5 }}>
            <SidebarItem
              to="/chats"
              label="Chats"
              icon={<ChatBubbleOutlineIcon />}
              collapsed={collapsed}
              selected={location.pathname.startsWith("/chats")}
            />

            <SidebarItem
              to="/profile"
              label="Profile"
              icon={<PersonOutlineIcon />}
              collapsed={collapsed}
              selected={location.pathname.startsWith("/profile")}
            />
          </List>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Divider />

        <Box sx={{ p: collapsed ? 1 : 2 }}>
          <Stack
            direction={collapsed ? "column" : "row"}
            spacing={1.5}
            alignItems="center"
            justifyContent={collapsed ? "center" : "flex-start"}
          >
            <Avatar sx={{ width: 36, height: 36 }}>
              {user?.username?.[0]?.toUpperCase() ?? "U"}
            </Avatar>

            {!collapsed && (
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {user?.username ?? "User"}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  Authorized
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          minHeight: "100vh",
          display: "flex",
          overflow: "hidden",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}