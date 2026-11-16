import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Box sx={{ maxWidth: 480, mx: "auto", py: 12, textAlign: "center" }}>
      <Typography variant="h3" fontWeight={700} color="primary">
        404
      </Typography>
      <Typography variant="h6" sx={{ mt: 1 }}>
        We could not find that page
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        The watch or page you are looking for does not exist.
      </Typography>
      <Button component={Link} href="/" variant="contained">
        Back to the store
      </Button>
    </Box>
  );
}
