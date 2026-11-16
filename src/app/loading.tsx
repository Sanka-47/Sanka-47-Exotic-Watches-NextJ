import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 12 }} role="status" aria-label="Loading">
      <CircularProgress />
    </Box>
  );
}
