import Image from "next/image";
import { Box, Typography } from "@mui/material";
import type { ProductDetail } from "@/types";

export default function ProductBanner({ product }: { product: ProductDetail }) {
  const heroImage = product.imageUrl_3 || product.imageUrl_2 || product.imageUrl;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 4,
        px: { xs: 3, md: 5 },
        py: { xs: 4, md: 5 },
        background: "linear-gradient(135deg, #eef4ff, #ffffff)",
        borderRadius: 3,
        border: "1px solid #e0e0e0",
      }}
    >
      <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520 }}>
          {product.description}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", width: "100%" }}>
        <Image
          src={heroImage}
          alt={product.name}
          width={420}
          height={320}
          priority
          style={{ width: "100%", maxWidth: 420, height: "auto", borderRadius: 12 }}
        />
      </Box>
    </Box>
  );
}
