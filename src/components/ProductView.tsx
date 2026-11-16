"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ProductBanner from "./ProductBanner";
import { formatUsd } from "@/lib/money";
import { formatStatus, getStatusColor } from "@/lib/stock";
import type { ProductDetail } from "@/types";

export default function ProductView({
  product,
  canOrder = false,
}: {
  product: ProductDetail;
  canOrder?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = Array.from(
    new Set([product.imageUrl, product.imageUrl_2, product.imageUrl_3].filter(Boolean)),
  );
  const inStock = product.quantity > 0;

  return (
    <>
      <ProductBanner product={product} />

      <Box sx={{ px: { xs: 0, md: 2 }, mt: 3 }}>
        <Card sx={{ p: 3, display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center" }}>
          <CardMedia
            component="img"
            image={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            sx={{ width: 140, height: 140, objectFit: "cover", borderRadius: 2 }}
          />
          <Box sx={{ flex: 1, minWidth: 240 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
              <Typography variant="h4" fontWeight={700}>
                {product.name}
              </Typography>
              <Chip
                label={formatStatus(product.status)}
                size="small"
                sx={{ bgcolor: getStatusColor(product.status), color: "#fff" }}
              />
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {product.description}
            </Typography>
            {canOrder ? (
              <Button
                onClick={() => router.push(`/product/${product.id}/order`)}
                variant="contained"
                disabled={!inStock}
                startIcon={<ShoppingCartIcon />}
                sx={{ mt: 2, textTransform: "none" }}
              >
                {inStock ? `Order now · ${formatUsd(Number(product.price))}` : "Out of stock"}
              </Button>
            ) : null}
          </Box>
        </Card>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {[
            { label: "Product ID", value: product.id },
            { label: "Price", value: formatUsd(Number(product.price)) },
            { label: "Status", value: formatStatus(product.status) },
            { label: "Stock", value: product.quantity },
          ].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.label}>
              <Card sx={{ p: 2.5, textAlign: "center" }}>
                <Typography variant="h6" fontWeight={600}>
                  {item.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            mt: 3,
          }}
        >
          {images.map((image, index) => (
            <Box
              key={`${image}-${index}`}
              onClick={() => {
                setSelectedImage(image);
                setOpen(true);
              }}
              sx={{ cursor: "zoom-in", borderRadius: 2, overflow: "hidden" }}
            >
              <CardMedia
                component="img"
                image={image}
                alt={`${product.name} image ${index + 1}`}
                sx={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              />
            </Box>
          ))}
        </Box>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
          <DialogContent sx={{ p: 0 }}>
            <Box
              component="img"
              src={selectedImage ?? product.imageUrl}
              alt={`${product.name} enlarged`}
              sx={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
}
