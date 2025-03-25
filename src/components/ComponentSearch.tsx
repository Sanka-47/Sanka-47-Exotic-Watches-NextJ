"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Product } from "@prisma/client";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { productSearch } from "@/actions";

interface Category {
  id: number;
  name: string;
}

export function FreeSolo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/category");
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Function to fetch products based on search value and category
  const fetchProducts = async (search: string, categoryId: number) => {
    const results = await productSearch(search, categoryId);
    setProducts(results || []);
  };

  // Fetch products when the category changes
  useEffect(() => {
    fetchProducts(searchValue, selectedCategory);
  }, [selectedCategory]);

  // Handle search input changes
  async function handleSearch(event: React.ChangeEvent<{}>, value: string | null) {
    const newSearchValue = value || "";
    setSearchValue(newSearchValue);
    fetchProducts(newSearchValue, selectedCategory);
  }

  // Handle category selection changes
  const handleCategoryChange = (event: SelectChangeEvent<number>) => {
    setSelectedCategory(Number(event.target.value));
  };

  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", py: 4, px: { xs: 2, sm: 3 } }}>
      {/* Category and Search Bar in a Row */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Stack on small screens, row on larger
          gap: 2,
          mb: 4,
          alignItems: "center",
        }}
      >
        {/* Category Selector */}
        <FormControl sx={{ width: { xs: "100%", sm: "30%" } }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category-select"
            value={selectedCategory}
            label="Category"
            name="category"
            onChange={handleCategoryChange}
            size="small" // Smaller size for the category selector
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(0, 0, 0, 0.1)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <MenuItem value={0}>All Categories</MenuItem>
            {category.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Search Bar */}
        <Autocomplete
          id="product-search"
          freeSolo
          options={products.map((p) => p.name)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Products"
              variant="outlined"
              size="small"
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.2)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1976d2", // Primary color for focus
                  },
                },
              }}
            />
          )}
          onInputChange={(event, value) => handleSearch(event, value)}
          value={searchValue}
          sx={{ width: { xs: "100%", sm: "70%" } }}
        />
      </Box>

      {/* Product Cards */}
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
            gap: { xs: "2", sm: 3 }, // Increased gap for better spacing
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
                    height: { xs: 140, sm: 160 }, // Smaller height on mobile
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
          No products found
        </Typography>
      )}
    </Box>
  );
}