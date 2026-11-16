import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export function AdminProductHeader({ productCount }: { productCount: number }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight={700}>
          Products
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {productCount} {productCount === 1 ? "product" : "products"} in inventory
        </Typography>
      </Box>
      <Button
        component={Link}
        href="/admin/product/add"
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ textTransform: "none" }}
      >
        Add product
      </Button>
    </Box>
  );
}
