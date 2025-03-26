"use client";

import React from "react";
import Image from "next/image";
import { IconButton } from "@mui/material";
import {
  Box,
  Button,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  FormControl,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";
import Swal from "sweetalert2";
import * as actions from "@/actions";

interface ProductEditFormProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: string;
    quantity: number;
    imageUrl: string;
    status: string;
  };
}

export default function ProductEditForm({ product }: ProductEditFormProps) {
  const [name, setName] = useState<string>(product.name);
  const [price, setPrice] = useState<string>(product.price);
  const [quantity, setQuantity] = useState<number>(product.quantity);
  const [description, setDescription] = useState<string>(product.description);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product.imageUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      setImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("id", product.id.toString());
    formData.append("name", name);
    formData.append("price", price);
    formData.append("quantity", quantity.toString());
    formData.append("description", description);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await actions.productEdit(formData);

      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.message,
          timer: 2000,
          showConfirmButton: false,
        });
        // Redirect to the admin dashboard
        window.location.href = "/admin";
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong while updating the product!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f5f5f5",
        overflowX: "hidden",
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            maxWidth: "1200px",
            mx: "auto",
            px: { xs: 2, sm: 3, md: 4 },
            py: 4,
          }}
        >
          {/* Header Section */}
          <Box sx={{ mb: 4, borderBottom: "2px solid #e0e0e0", pb: 2 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: "#1a1a1a",
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
              }}
            >
              Update Product
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#666",
                mt: 1,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Update the details and image for this product.
            </Typography>
          </Box>

          {/* Image Upload Section */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              bgcolor: "white",
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Box sx={{ width: { xs: "100%", md: "35%" }, mb: { xs: 2, md: 0 } }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#1a1a1a", mb: 1 }}
              >
                Product Image
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#666", fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                Update or upload a new image for this product.
              </Typography>
            </Box>

            <Box sx={{ width: { xs: "100%", md: "65%" } }}>
              <label
                htmlFor="image"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <Box
                  sx={{
                    border: "2px dashed #e0e0e0",
                    borderRadius: 2,
                    p: { xs: 3, sm: 4 },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    bgcolor: "#fafafa",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#1976d2",
                      bgcolor: "#f5faff",
                      "& svg": { color: "#1976d2" },
                    },
                  }}
                >
                  <CloudUploadIcon
                    sx={{
                      fontSize: { xs: 40, sm: 48 },
                      color: "#bdbdbd",
                      transition: "color 0.3s ease",
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 2,
                      color: "#666",
                      fontWeight: 500,
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    Drag & drop an image or{" "}
                    <span
                      style={{
                        color: "#1976d2",
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                    >
                      browse
                    </span>
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#999",
                      mt: 1,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    Supports JPG, PNG
                  </Typography>
                </Box>
              </label>

              {imagePreview && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mt: 3,
                    flexWrap: "wrap",
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: { xs: 80, sm: 100 },
                      height: { xs: 80, sm: 100 },
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    <Image
                      src={imagePreview}
                      width={100}
                      height={100}
                      alt="Image preview"
                      style={{ objectFit: "cover" }}
                    />
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                        color: "#d32f2f",
                        width: 24,
                        height: 24,
                        "&:hover": { bgcolor: "#d32f2f", color: "#fff" },
                      }}
                      onClick={() => {
                        setImagePreview(null);
                        setImage(null);
                      }}
                    >
                      <Typography sx={{ fontSize: "0.75rem" }}>×</Typography>
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          {/* Product Details Section */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              bgcolor: "white",
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Box sx={{ width: { xs: "100%", md: "35%" }, mb: { xs: 2, md: 0 } }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#1a1a1a", mb: 1 }}
              >
                Product Details
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#666", fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                Update the details for this product.
              </Typography>
            </Box>

            <Box
              sx={{
                width: { xs: "100%", md: "65%" },
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
              }}
            >
              <TextField
                label="Product Name"
                fullWidth
                required
                id="name"
                name="name"
                value={name}
                onChange={(evt) => setName(evt.target.value)}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#fafafa",
                    "& fieldset": { borderColor: "#e0e0e0" },
                    "&:hover fieldset": { borderColor: "#bdbdbd" },
                    "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                  },
                  "& .MuiInputLabel-root": { color: "#666" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" },
                  "& .MuiInputBase-input": {
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  },
                }}
              />

              <FormControl fullWidth>
                <InputLabel
                  htmlFor="price"
                  sx={{ color: "#666", "&.Mui-focused": { color: "#1976d2" } }}
                >
                  Price
                </InputLabel>
                <OutlinedInput
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  label="Price"
                  fullWidth
                  required
                  id="price"
                  name="price"
                  value={price}
                  onChange={(evt) => setPrice(evt.target.value)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#fafafa",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#bdbdbd" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1976d2" },
                    "& .MuiInputBase-input": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                />
              </FormControl>

              <TextField
                type="number"
                label="Quantity"
                fullWidth
                inputProps={{ min: "0" }}
                required
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={(evt) => setQuantity(parseInt(evt.target.value))}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#fafafa",
                    "& fieldset": { borderColor: "#e0e0e0" },
                    "&:hover fieldset": { borderColor: "#bdbdbd" },
                    "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                  },
                  "& .MuiInputLabel-root": { color: "#666" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" },
                  "& .MuiInputBase-input": {
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  },
                }}
              />

              <TextField
                label="Description"
                fullWidth
                multiline
                maxRows={6}
                minRows={4}
                required
                id="description"
                name="description"
                value={description}
                onChange={(evt) => setDescription(evt.target.value)}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#fafafa",
                    "& fieldset": { borderColor: "#e0e0e0" },
                    "&:hover fieldset": { borderColor: "#bdbdbd" },
                    "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                  },
                  "& .MuiInputLabel-root": { color: "#666" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" },
                  "& .MuiInputBase-input": {
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Submit Button */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            zIndex: 20,
            bgcolor: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.05)",
            py: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Box sx={{ textAlign: "right" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                bgcolor: "linear-gradient(90deg, #1976d2, #42a5f5)",
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                color: "#fff",
                fontWeight: "bold",
                textTransform: "none",
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                borderRadius: 2,
                boxShadow: "0 2px 10px rgba(25, 118, 210, 0.3)",
                transition: "all 0.3s ease",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                "&:hover": {
                  background: "linear-gradient(90deg, #1565c0, #2196f3)",
                  boxShadow: "0 4px 15px rgba(25, 118, 210, 0.5)",
                  transform: "translateY(-2px)",
                },
                "&:disabled": {
                  bgcolor: "#bdbdbd",
                  cursor: "not-allowed",
                },
              }}
            >
              {isSubmitting ? "Updating..." : "Update Product"}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
}