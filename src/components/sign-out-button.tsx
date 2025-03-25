"use client";

import { useRouter } from "next/navigation";
import { logout } from "../lib/actions/auth";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export const SignOutButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="contained"
      startIcon={<LogoutIcon />}
      onClick={() => logout(router)}
      sx={{
        backgroundColor: "#d32f2f", // Red background for sign-out
        color: "white", // White text for contrast
        fontWeight: 100,
        px: 3,
        py: 1,
        borderRadius: 2,
        "&:hover": {
          backgroundColor: "#b71c1c", // Darker red on hover
        },
      }}
    >
      Sign Out
    </Button>
  );
};