"use client";

import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React, { useEffect, useState } from "react";
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
import Swal from 'sweetalert2';

interface Category {
  id: number;
  name: string;
}

export default function ProductAddForm() {
  const [category, setCategory] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null); // Add error state
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/category");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        console.log("Fetched categories:", data);
        setCategory(data);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  const [fields, setFields] = React.useState({
    name: "",
    price: "",
    quantity: 0,
    description: "",
    image_1: "",
    image_2: "",
    image_3: "",
    category: 0,
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedFiles = Array.from(files).slice(0, 3);
      setImageFiles(selectedFiles);

      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);

      setFields((prevFields) => ({
        ...prevFields,
        image_1: selectedFiles[0] ? selectedFiles[0].name : "",
        image_2: selectedFiles[1] ? selectedFiles[1].name : "",
        image_3: selectedFiles[2] ? selectedFiles[2].name : "",
      }));
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleCategoryChange = (event: SelectChangeEvent<number>) => {
    const categoryId = Number(event.target.value);
    setFields((prevFields) => ({
      ...prevFields,
      category: categoryId,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", fields.name);
    formData.append("price", fields.price);
    formData.append("quantity", String(fields.quantity));
    formData.append("description", fields.description);
    formData.append("category", String(fields.category));

    imageFiles.forEach((file) => {
      formData.append("image", file);
    });

    try {
      const response = await fetch('/api/admin/product', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: data.message,
          timer: 2000,
          showConfirmButton: false,
        });
        window.location.href = '/admin';
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message || 'Something went wrong while uploading the product!',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If there's an error, display it
  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

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
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Box
          sx={{
            flex: 1,
            maxWidth: "1200px",
            mx: "auto",
            px: { xs: 2, sm: 3, md: 4 },
            py: 4,
          }}
        >
          <Box sx={{ mb: 4, borderBottom: "2px solid #e0e0e0", pb: 2 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: "#1a1a1a",
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
              }}
            >
              Create New Product
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#666",
                mt: 1,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Add a new product to your inventory with details and images.
            </Typography>
          </Box>

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
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#1a1a1a", mb: 1 }}>
                Product Images
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#666", fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                Upload up to 3 high-quality images to showcase your product.
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
                  multiple
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
                    Drag & drop images or{" "}
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
                    Supports JPG, PNG, up to 3 images
                  </Typography>
                </Box>
              </label>

              {imagePreviews.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mt: 3,
                    flexWrap: "wrap",
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >
                  {imagePreviews.map((src, index) => (
                    <Box
                      key={index}
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
                        src={src}
                        width={100}
                        height={100}
                        alt={`Image preview ${index + 1}`}
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
                        onClick={() => removeImage(index)}
                      >
                        <Typography sx={{ fontSize: "0.75rem" }}>×</Typography>
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>

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
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#1a1a1a", mb: 1 }}>
                Product Details
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#666", fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                Provide detailed information about your product.
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
                value={fields.name}
                onChange={handleChange}
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
                  id="demo-simple-select-label"
                  sx={{ color: "#666", "&.Mui-focused": { color: "#1976d2" } }}
                >
                  Category
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={fields.category}
                  label="Category"
                  name="category"
                  onChange={handleCategoryChange}
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#fafafa",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#bdbdbd" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1976d2" },
                    "& .MuiSelect-select": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                >
                  {category.length > 0 ? (
                    category.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value={0} disabled>
                      No categories available
                    </MenuItem>
                  )}
                </Select>
              </FormControl>

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
                  value={fields.price}
                  onChange={handleChange}
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
                value={fields.quantity}
                onChange={handleChange}
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
                value={fields.description}
                onChange={handleChange}
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
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
}