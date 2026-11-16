"use server";
import MyChart from "@/components/MyChart";
import TotalVisitors from "@/components/TotalVisitors";
import { db } from "@/db";
import { Product } from "@prisma/client";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default async function StockDashboardPage() {
  // Fetch low stock products (quantity < 4)
  const lowStockProducts: Product[] = await db.product.findMany({
    where: {
      quantity: {
        lt: 4,
      },
    },
  });

  // Log the fetched products to verify data
  console.log("Low Stock Products:", lowStockProducts);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Header */}
      <Box
        component="header"
        sx={{
          bgcolor: "white",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 2, sm: 3 }, py: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
            Stock Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
            Monitor low stock products and analytics
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 2, sm: 3 }, py: 6 }}>
        {/* Low Stock Products Section */}
        <Box component="section" sx={{ mb: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, color: "#1a1a1a", mb: 4 }}>
            Low Stock Products ({lowStockProducts.length})
          </Typography>
          {lowStockProducts.length === 0 ? (
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                p: 4,
                textAlign: "center",
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                No products are currently out of stock.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 3,
                overflowX: "auto",
                pb: 2,
                "&::-webkit-scrollbar": {
                  height: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                },
              }}
            >
              {lowStockProducts.map((product) => (
                <Card
                  key={product.id}
                  sx={{
                    flexShrink: 0,
                    width: 300, // Fixed width for horizontal scrolling
                    borderRadius: 3,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                    },
                    position: "relative",
                  }}
                >
                  <Link href={`/admin/product/${product.id}/view`} style={{ textDecoration: "none" }}>
                    <CardMedia
                      sx={{
                        height: 200,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                      }}
                      image={product.imageUrl_3 || "/placeholder-image.jpg"}
                      title={product.name}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: product.quantity === 0 ? "red" : "orange", // Red for out of stock, orange for low stock
                        color: "white",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      {product.quantity === 0 ? "Out of Stock" : `Low stock: ${product.quantity}`}
                    </Box>
                    <CardContent sx={{ py: 2, px: 2 }}>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                          fontWeight: 600,
                          color: "#1a1a1a",
                          fontSize: "1.25rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product.name || "Unnamed Product"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          lineHeight: 1.5,
                          fontSize: "0.875rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {product.description || "No description available"}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2, justifyContent: "center" }}>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          bgcolor: "#1976d2",
                          "&:hover": { bgcolor: "#1565c0" },
                          fontSize: "0.875rem",
                          px: 3,
                        }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Link>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* Analytics Section */}
        <Box component="section" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 3 }}>
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              p: 4,
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 500, color: "#1a1a1a", mb: 2 }}>
              Sales Chart
            </Typography>
            <Box sx={{ height: 400 }}>
              <MyChart />
            </Box>
          </Box>
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              p: 4,
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 500, color: "#1a1a1a", mb: 2 }}>
              Total Visitors
            </Typography>
            <Box sx={{ height: 400 }}>
              <TotalVisitors />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}