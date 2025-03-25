"use client";
import React, { useState } from "react";
import formatStatus from "@/utils/formatStatus";
import { Box, Typography, Avatar, Button, Grid, Card, CardMedia, Dialog, DialogContent } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import NumbersIcon from "@mui/icons-material/Numbers";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import GradingIcon from "@mui/icons-material/Grading";
import ProductBanner from "./ProductBanner";
import { useRouter, usePathname } from "next/navigation";

interface ProductViewProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: string;
    quantity: number;
    imageUrl: string;
    imageUrl_2: string;
    imageUrl_3: string;
    status: string;
  };
}

export default function ProductView({ product }: ProductViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // State for managing the modal and selected image
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleOrderClick = () => {
    if (!product.price) {
      alert("Price is missing or invalid!");
      return;
    }
    router.push(`/user/product/${product.id}/order?price=${product.price}`);
  };

  // Handler to open the modal and set the selected image
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setOpen(true);
  };

  // Handler to close the modal
  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <ProductBanner product={product} />
      <Box sx={{ px: { xs: 2, md: 6 }, mt: -8 }}>
        {/* Product Header Card */}
        <Card sx={{ display: "flex", alignItems: "center", p: 3, borderRadius: 3, boxShadow: 3 }}>
          <Avatar
            alt={product.name}
            src={product.imageUrl_2}
            sx={{ width: 120, height: 120, border: "4px solid #F75159" }}
          />
          <Box sx={{ ml: 3 }}>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {product.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={1}>
              {product.description}
            </Typography>
            <Button
              onClick={handleOrderClick}
              variant="contained"
              sx={{ mt: 2, borderRadius: 20, backgroundColor: "#0288d1" }}
            >
              <EditIcon sx={{ mr: 1 }} /> Order Now
            </Button>
          </Box>
        </Card>

        {/* Product Stats Grid */}
        <Grid container spacing={3} mt={3}>
          {[
            {
              label: "Product ID",
              value: product.id,
              icon: <NumbersIcon fontSize="large" />,
              color: "#865DFF",
            },
            {
              label: "Price",
              value: `$${product.price}`,
              icon: <AttachMoneyIcon fontSize="large" />,
              color: "#FF8D29",
            },
            {
              label: "Status",
              value: formatStatus(product.status),
              icon: <GradingIcon fontSize="large" />,
              color: "#DF0D00",
            },
            {
              label: "Quantity",
              value: product.quantity,
              icon: <ProductionQuantityLimitsIcon fontSize="large" />,
              color: "#0017E1",
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ p: 3, textAlign: "center", borderRadius: 3, boxShadow: 2 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    backgroundColor: item.color,
                    color: "#fff",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>
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

        {/* Product Images Grid */}
        <Grid container spacing={2} mt={3}>
          {[product.imageUrl, product.imageUrl_2, product.imageUrl_3].map((image, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 2,
                  transition: "transform 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.5)", // Hover zoom effect
                  },
                }}
                onClick={() => handleImageClick(image)}
              >
                <CardMedia
                  component="img"
                  image={image || "/placeholder-image.jpg"}
                  alt={`Product Image ${index + 1}`}
                  sx={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Zoom Modal */}
        <Dialog open={open} onClose={handleClose} maxWidth="md">
          <DialogContent sx={{ p: 0 }}>
            <Box
              component="img"
              src={selectedImage || "/placeholder-image.jpg"}
              alt="Zoomed Image"
              sx={{
                width: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
}