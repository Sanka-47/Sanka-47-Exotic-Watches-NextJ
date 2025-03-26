"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  IconButton,
  Typography,
} from "@mui/material";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import WatchIcon from "@mui/icons-material/Watch";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { SignOutButton } from "./sign-out-button";
import { SignInButton } from "./sign-in-button";

// Import the Edu AU VIC WA NT Guides font using next/font
import { Edu_AU_VIC_WA_NT_Guides } from "next/font/google";

// Configure the font
const eduFont = Edu_AU_VIC_WA_NT_Guides({
  weight: ["400"], // Specify the weights you need (400 is regular)
  subsets: ["latin"], // Specify the subsets (latin is sufficient for English)
  display: "swap", // Ensures font loads with a fallback while downloading
});

export default function AppContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Fetch the session using useSession
  const { data: session } = useSession();

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawerLinks = [
    { name: "Home Page", icon: <HomeIcon />, path: "/" },
    { name: "Dashboard", icon: <GridViewOutlinedIcon />, path: "/admin" },
    { name: "Analytics", icon: <DataUsageIcon />, path: "/analytics" },
    { name: "Profile", icon: <AccountCircleIcon />, path: "/profile" },
    { name: "Suppliers", icon: <SupervisorAccountIcon />, path: "/suppliers" },
  ];

  const drawer = (
    <>
      <Toolbar sx={{ justifyContent: "center", alignItems: "center", gap: 1 }}>
        <Link href="/admin" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 1 }}>
          {/* <WatchIcon
            sx={{
              fontSize: { xs: 30, sm: 35 },
              color: "hsla(185, 64%, 39%, 1.0)",
            }}
          /> */}
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem" },
              fontWeight: 350,
              color: "black",
              letterSpacing: "0.05em",
              textShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
              fontFamily: eduFont.style.fontFamily, // Apply the Edu font
            }}
          >
            Exotica Watches
          </Typography>
        </Link>
      </Toolbar>

      <Divider />

      <List>
        {drawerLinks.map((drawLink, index) => (
          <ListItem key={index} disablePadding onClick={handleDrawerClose}>
            <Link
              href={drawLink.path}
              passHref
              style={{ textDecoration: "none", width: "100%" }}
            >
              <ListItemButton disableRipple sx={{ width: "100%" }}>
                <ListItemIcon sx={{ color: "rgb(75, 85, 99)" }}>
                  {drawLink.icon}
                </ListItemIcon>
                <ListItemText
                  primary={drawLink.name}
                  sx={{ color: "rgb(75, 85, 99)" }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </>
  );

  const drawerWidth = 240;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar position="fixed">
        <Toolbar
          sx={{
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
          }}
        >
          {/* Brand Name and Drawer Toggle Button - Left Side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              sx={{
                mr: 1,
                display: { sm: "none" },
                color: "black",
              }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Link href="/admin" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 1 }}>
              <WatchIcon
                sx={{
                  fontSize: { xs: 24, sm: 28 },
                  color: "#1976d2",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  fontWeight: 700,
                  background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.05em",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                  fontFamily: eduFont.style.fontFamily, // Apply the Edu font
                }}
              >
                Exotica Watch
              </Typography>
            </Link>
          </Box>

          {/* Combined User Info and Sign In/Out Buttons - Right Side */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              marginLeft: "auto",
            }}
          >
            {/* User Info Section */}
            {session && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    width={40}
                    height={40}
                    alt={session.user.name ?? "Avatar"}
                    style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid #1976d2" }}
                  />
                ) : (
                  <AccountCircleIcon sx={{ fontSize: 40, color: "#1976d2" }} />
                )}
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1976d2",
                    fontSize: { xs: "14px", sm: "16px" },
                    fontWeight: 600,
                  }}
                >
                  {session.user?.name || "User"}
                </Typography>
              </Box>
            )}

            {/* Sign In / Sign Out Buttons */}
            {session ? <SignOutButton /> : <SignInButton />}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { sm: drawerWidth } }}>
        <Drawer
          variant="permanent"
          open={true}
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          height: "100%",
          margin: "80px auto",
          padding: "2rem",
          color: "rgb(75, 85, 99)",
          width: { xs: "100%", sm: "70%" },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}