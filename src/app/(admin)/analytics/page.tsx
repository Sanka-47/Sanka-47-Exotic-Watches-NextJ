import type { Metadata } from "next";
import Link from "next/link";
import { Box, Button, Card, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import { getLowStockProducts } from "@/lib/products";
import { formatUsd } from "@/lib/money";
import { formatStatus, getStatusColor } from "@/lib/stock";
import MyChart from "@/components/MyChart";
import TotalVisitors from "@/components/TotalVisitors";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function AnalyticsPage() {
  const lowStockProducts = await getLowStockProducts();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Stock &amp; analytics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor low stock products and storefront traffic.
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Low stock ({lowStockProducts.length})
      </Typography>

      {lowStockProducts.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center", mb: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Every product is above the low-stock threshold.
          </Typography>
        </Card>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            mb: 4,
          }}
        >
          {lowStockProducts.map((product) => (
            <Card key={product.id}>
              <CardMedia
                component="img"
                image={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                sx={{ height: 160, objectFit: "cover" }}
              />
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600} noWrap>
                    {product.name}
                  </Typography>
                  <Chip
                    size="small"
                    label={formatStatus(product.status)}
                    sx={{ bgcolor: getStatusColor(product.status), color: "#fff" }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {product.quantity} left · {formatUsd(product.price)}
                </Typography>
                <Button
                  component={Link}
                  href={`/admin/product/${product.id}/view`}
                  size="small"
                  sx={{ mt: 1, textTransform: "none" }}
                >
                  View details
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
        }}
      >
        <Card sx={{ p: 2 }}>
          <MyChart />
        </Card>
        <Card sx={{ p: 2 }}>
          <TotalVisitors />
        </Card>
      </Box>
    </Box>
  );
}
