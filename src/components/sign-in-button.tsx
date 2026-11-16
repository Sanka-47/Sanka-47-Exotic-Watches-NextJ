"use client";


import { login } from "../lib/actions/auth";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

export const SignInButton = () => {
  return (
    <Button
      variant="contained"
      startIcon={<GoogleIcon />}
      onClick={() => login()}
      sx={{
        backgroundColor: "#1976d2", // Blue background for Google sign-in
        color: "white", // White text for contrast
        fontWeight: 100,
        px: 3,
        py: 1,
        borderRadius: 2,
        "&:hover": {
          backgroundColor: "#1565c0", // Darker blue on hover
        },
      }}
    >
      Sign In With Google
    </Button>
  );
};