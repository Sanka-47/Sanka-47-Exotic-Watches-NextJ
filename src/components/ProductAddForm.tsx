"use client";

import MenuItem from "@mui/material/MenuItem";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import React, { useEffect, useState } from "react";
import Link from "next/link";
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
import { db } from "@/db";
import { LineAxisOutlined } from "@mui/icons-material";
import * as actions from "@/actions";

interface Category {
  id: number;
  name: string;
}

interface Product {
  name: string;
  price: string;
  quantity: number;
  description: string;
  image_1: File | null;
  image_2: File | null;
  image_3: File | null;

  category: number;
}

export default function ProductAddForm() {
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/category"); // Fetch data from Next.js API route
        const data = await response.json();
        setCategory(data); // Set the fetched data to state
        console.log(data); // Log the data to the browser console
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Optionally: Add user feedback or retry logic here
      }
    };

    fetchCategories();
  }, []);

  const [fields, setFields] = React.useState({
    name: "",
    price: "",
    quantity: 0,
    description: "",
    image_1:"",
    image_2: "",
    image_3: "",
    category: 0,
  });


  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedFiles = Array.from(files).slice(0, 3); // Limit to 3 images
  
      setImageFiles(selectedFiles);
  
      // Generate previews
      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
  
      // Update fields with image file names (or base64 if needed)
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
    const categoryId = Number(event.target.value); // Convert the selected value to a number

    setFields((prevFields) => ({
      ...prevFields,
      category: categoryId, // Update the category field in the state
    }));
  };

  return (
    <>
      <form
        action="/api/admin/product"
        method="POST"
        encType="multipart/form-data"
      >
        <Box
          sx={{ borderBottom: "1px dashed #c8cdd3", pb: 1, display: "flex" }}
        >
          <Typography variant="h5" fontWeight="bold">
            Create New Product
          </Typography>
        </Box>

        <Box
      sx={{
        my: 5,
        display: "flex",
        flexWrap: "wrap",
        borderBottom: "1px dashed #c8cdd3",
        pb: 8,
      }}
    >
      <Box
        sx={{
          px: 2,
          pb: 5,
          width: { xs: "100%", sm: "100%", md: "33.333%" },
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Image
        </Typography>
        <Typography variant="body1">
          Upload up to 3 product images here
        </Typography>
      </Box>

      <Box
        sx={{
          p: 5,
          bgcolor: "background.paper",
          boxShadow: 2,
          borderRadius: "0.25rem",
          width: { xs: "100%", sm: "100%", md: "66.667%" },
        }}
      >
        {/* IMAGE UPLOAD (Start) */}
        <label
          htmlFor="image"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
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
              borderStyle: "dashed",
              borderColor: "#d1d5db",
              borderWidth: "1px",
              borderRadius: "0.25rem",
              width: "100%",
              p: 3,
              mb: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              "&:hover": {
                borderColor: "#bcbfc4",
                "& svg": {
                  color: "#bcbfc4",
                },
              },
            }}
          >
            <CloudUploadIcon
              fontSize="large"
              sx={{
                color: "#d1d5db",
              }}
            />
            <Typography variant="body1" mt={2}>
              <span
                style={{
                  fontWeight: "bold",
                  color: "hsla(185, 64%, 39%, 1.0)",
                }}
              >
                Upload images
              </span>
            </Typography>
          </Box>
        </label>

        {/* IMAGE PREVIEWS */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {imagePreviews.map((src, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                display: "inline-flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: "0.375rem",
                border: "1px solid #E5E5E5",
                width: "7rem",
                height: "4rem",
              }}
            >
              <Image
                src={src}
                width={70}
                height={60}
                alt={`Image preview ${index + 1}`}
                loading="lazy"
                style={{ objectFit: "contain" }}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: "0.25rem",
                  right: "0.25rem",
                  height: "1rem",
                  width: "1rem",
                  backgroundColor: "#DC2626",
                  color: "#FFFFFF",
                  fontSize: "0.625rem",
                  borderRadius: "9999px",
                }}
                onClick={() => removeImage(index)}
              >
                x
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>

        <Box sx={{ my: 5, display: "flex", flexWrap: "wrap" }}>
          <Box
            sx={{
              px: 2,
              pb: 5,
              width: { xs: "100%", sm: "100%", md: "33.333%" },
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Description
            </Typography>
            <Typography variant="body1">
              Add your product details here
            </Typography>
          </Box>

          <Box
            sx={{
              p: 5,
              bgcolor: "background.paper",
              boxShadow: 2,
              borderRadius: "0.25rem",
              width: { xs: "100%", sm: "100%", md: "66.667%" },
            }}
          >
            {/* NAME (start) */}
            <TextField
              label="Name"
              fullWidth
              required
              sx={{ marginBottom: "1.2em" }}
              id="name"
              name="name"
              value={fields.name}
              onChange={handleChange}
            />

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={fields.category}
                label="category"
                name="category"
                onChange={handleCategoryChange}
              >
                {category.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* PRICE (start) */}
            <FormControl fullWidth sx={{ marginBottom: "1.2em" }}>
              <InputLabel htmlFor="price">Amount</InputLabel>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                label="Amount"
                fullWidth
                required
                id="price"
                name="price"
                value={fields.price}
                onChange={handleChange}
              />
            </FormControl>

            {/* QUANTITY (start) */}
            <TextField
              type="number"
              label="Quantity"
              fullWidth
              inputProps={{ min: "0" }}
              required
              sx={{ marginBottom: "1.4em" }}
              id="quantity"
              name="quantity"
              value={fields.quantity}
              onChange={handleChange}
            />

            {/* DESCRIPTION (start) */}
            <Box sx={{ position: "relative" }}>
              <TextField
                label="Description"
                fullWidth
                multiline
                maxRows={4}
                minRows={6}
                required
                sx={{ marginBottom: "1.2em" }}
                id="description"
                name="description"
                value={fields.description}
                onChange={handleChange}
              />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            zIndex: 20,
          }}
        >
          <Box
            sx={{
              mx: -5,
              py: { xs: 3, md: 5 },
              px: { xs: 5, lg: 8 },
              backdropFilter: "blur(20px)",
              textAlign: "end",
            }}
          >
            <Button
              type="submit"
              // onClick={()=>console.log(fields)}
              variant="contained"
              sx={{
                height: "48px",
                backgroundColor: "hsla(185, 64%, 39%, 1.0)",
                "&:hover": { backgroundColor: "hsla(185, 64%, 29%, 1.0)" },
              }}
            >
              Add Product
            </Button>
          </Box>
        </Box>
      </form>
    </>
  );
}
