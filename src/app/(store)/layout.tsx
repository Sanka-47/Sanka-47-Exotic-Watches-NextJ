import { Box } from "@mui/material";
import StoreHeader from "@/components/store/StoreHeader";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#fafafa" }}>
      <StoreHeader />
      <Box
        component="main"
        sx={{ flex: 1, width: "100%", maxWidth: 1400, mx: "auto", px: { xs: 2, sm: 3 }, py: 4 }}
      >
        {children}
      </Box>
      <Box
        component="footer"
        sx={{
          borderTop: "1px solid #e0e0e0",
          bgcolor: "#fff",
          py: 3,
          textAlign: "center",
          color: "text.secondary",
          fontSize: 14,
        }}
      >
        © {new Date().getFullYear()} Exotica Watches · Demo storefront
      </Box>
    </Box>
  );
}
