import Link from "next/link";
import Image from "next/image";
import { AppBar, Box, Button, Chip, Toolbar, Typography } from "@mui/material";
import { auth } from "@/auth";
import { SignInButton } from "@/components/sign-in-button";
import { SignOutButton } from "@/components/sign-out-button";

export default async function StoreHeader() {
  const session = await auth();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: "#fff", color: "text.primary", borderBottom: "1px solid #e0e0e0" }}
    >
      <Toolbar sx={{ width: "100%", maxWidth: 1400, mx: "auto", gap: 2 }}>
        <Box
          component={Link}
          href="/"
          sx={{ display: "flex", alignItems: "center", gap: 1, textDecoration: "none" }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "#1976d2",
              display: "inline-block",
            }}
          />
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Exotica Watches
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        {session?.user.role === "ADMIN" ? (
          <Button component={Link} href="/admin" size="small">
            Admin
          </Button>
        ) : null}

        {session?.user ? (
          <>
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "Signed-in user"}
                width={32}
                height={32}
                style={{ borderRadius: "50%" }}
              />
            ) : null}
            <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
              {session.user.name ?? session.user.email}
            </Typography>
            {session.user.role === "ADMIN" ? (
              <Chip label="Admin" size="small" color="primary" variant="outlined" />
            ) : null}
            <SignOutButton />
          </>
        ) : (
          <SignInButton />
        )}
      </Toolbar>
    </AppBar>
  );
}
