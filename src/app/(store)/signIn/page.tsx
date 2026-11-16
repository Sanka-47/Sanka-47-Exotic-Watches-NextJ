import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { getCurrentUser } from "@/lib/auth-guards";
import { SignInButton } from "@/components/sign-in-button";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function SignInPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: { xs: 6, md: 12 } }}>
      <Card sx={{ width: "100%", maxWidth: 420, borderRadius: 3 }}>
        <CardContent sx={{ p: 5, textAlign: "center" }}>
          <Typography variant="h5" fontWeight={700}>
            Sign in to Exotica Watches
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 4 }}>
            Sign in with Google to place an order. Admin accounts are provisioned through the
            ADMIN_EMAILS environment variable.
          </Typography>
          <SignInButton />
        </CardContent>
      </Card>
    </Box>
  );
}
