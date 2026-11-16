"use client";

import { Box, Button, Typography } from "@mui/material";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <Box sx={{ maxWidth: 480, mx: "auto", py: 12, textAlign: "center" }}>
      <Typography variant="h5" fontWeight={700}>
        Something went wrong
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        The page could not be loaded. Try again, or come back in a moment.
      </Typography>
      <Button variant="contained" onClick={reset}>
        Try again
      </Button>
    </Box>
  );
}
