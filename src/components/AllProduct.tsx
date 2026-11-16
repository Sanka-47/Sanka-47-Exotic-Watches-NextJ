"use server";

import React from "react";
import { Product } from "@prisma/client";
import { db } from "@/db";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { FreeSolo } from "./ComponentSearch";
import Box from "@mui/material/Box";

async function AllProduct() {
  const products: Product[] = await db.product.findMany();

  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", py: 4, px: { xs: 2, sm: 3 } }}>
      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <FreeSolo />
      </Box>

      {/* Product Grid */}
      {products.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // 1 column on extra small screens
              sm: "repeat(2, 1fr)", // 2 columns on small screens
              md: "repeat(3, 1fr)", // 3 columns on medium screens
              lg: "repeat(4, 1fr)", // 4 columns on large screens
            },
            gap: { xs: 2, sm: 3 }, // Increased gap for better spacing
            justifyItems: "center", // Center cards in their grid cells
          }}
        >
          {products.map((product) => (
            <Card
              key={product.id}
              sx={{
                width: "100%", // Ensure card takes full width of grid cell
                maxWidth: 300, // Constrain max width to prevent overlap
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <Link href={`/admin/product/${product.id}/view`} style={{ textDecoration: "none" }}>
                <CardMedia
                  sx={{
                    height: { xs: 160, sm: 200 }, // Smaller height on mobile
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                  image={product.imageUrl_3}
                  title={product.name}
                />
                <CardContent sx={{ py: 2, px: 2 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      fontWeight: 600,
                      color: "#1a1a1a",
                      fontSize: { xs: "1rem", sm: "1.25rem" }, // Smaller font on mobile
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.5,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Smaller font on mobile
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {product.description}
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
                      fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Smaller button on mobile
                      px: { xs: 2, sm: 3 },
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Link>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", textAlign: "center", mt: 4 }}
        >
          No products available
        </Typography>
      )}
    </Box>
  );
}

export default AllProduct;