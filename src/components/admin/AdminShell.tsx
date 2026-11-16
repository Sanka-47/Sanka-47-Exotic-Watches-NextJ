"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AnalyticsIcon from "@mui/icons-material/DataUsage";
import AddBoxIcon from "@mui/icons-material/AddBox";
import StorefrontIcon from "@mui/icons-material/Storefront";
import MenuIcon from "@mui/icons-material/Menu";
import { SignOutButton } from "@/components/sign-out-button";

const DRAWER_WIDTH = 240;

const links = [
  { label: "Dashboard", href: "/admin", icon: <DashboardIcon /> },
  { label: "Analytics", href: "/analytics", icon: <AnalyticsIcon /> },
  { label: "Add product", href: "/admin/product/add", icon: <AddBoxIcon /> },
  { label: "Storefront", href: "/", icon: <StorefrontIcon /> },
];

export function AdminShell({ children, userName }: { children: ReactNode; userName: string }) {
  const [open, setOpen] = useState(false);

  const drawer = (
    <>
      <Toolbar sx={{ px: 2, gap: 1 }}>
        <StorefrontIcon sx={{ color: "#1976d2" }} />
        <Typography variant="subtitle1" fontWeight={700} color="text.primary">
          Exotica Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {links.map((link) => (
          <ListItemButton key={link.href} component={Link} href={link.href} onClick={() => setOpen(false)}>
            <ListItemIcon sx={{ color: "text.secondary" }}>{link.icon}</ListItemIcon>
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
          {userName}
        </Typography>
        <SignOutButton />
      </Box>
    </>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#fafafa" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{ bgcolor: "#fff", color: "text.primary", borderBottom: "1px solid #e0e0e0" }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            sx={{ mr: 1, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700}>
            Admin
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              borderRight: "1px solid #e0e0e0",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          px: { xs: 2, sm: 3 },
          py: 4,
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
