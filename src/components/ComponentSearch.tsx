"use client";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { Product } from "@prisma/client";
import { FiveG } from "@mui/icons-material";
import { db } from "@/db";
import { productSearch } from "@/actions";
import { useEffect, useState } from "react";
import Decimal from "decimal.js";

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
import NativeSelect from "@mui/material/NativeSelect";

import MenuItem from "@mui/material/MenuItem";

import Select, { SelectChangeEvent } from "@mui/material/Select";

interface Category {
  id: number;
  name: string;
}

export function FreeSolo() {
  const [products, setProducts] = useState<Product[]>([]); // Store multiple products
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchValue, setSearchValue] = useState("");

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

  async function handleSearch(event: React.ChangeEvent<{}>, value: string | null) {
    setSearchValue(value || "");
    
    if (value) {
      const results = await productSearch(value, selectedCategory);
      setProducts(results || []); // Store multiple products
    } else {
      setProducts([]);
    }
  }

  const handleCategoryChange = (event: SelectChangeEvent<number>) => {
    setSelectedCategory(Number(event.target.value));
  };

  return (
    <div>
      {/* Category Dropdown */}
      <FormControl fullWidth>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category-select"
          value={selectedCategory}
          label="Category"
          name="category"
          onChange={handleCategoryChange}
        >
          <MenuItem key={0} value={0}>Select</MenuItem>
          {category.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Search Input */}
      <Stack spacing={2} sx={{ width: 300 }}>
        <Autocomplete
          id="product-search"
          freeSolo
          options={products.map((p) => p.name)} // Show product names in dropdown
          renderInput={(params) => <TextField {...params} label="Search" />}
          onInputChange={(event, value) => handleSearch(event, value)}
          value={searchValue}
        />

        {/* Display searched products */}
        {products.length > 0 ? (
          <div className="mb-4">
            {products.map((product) => (
              <Card sx={{ maxWidth: 345, marginBottom: 2 }} key={product.id}>
                <Link
                  href={`/admin/product/${product.id}/view`}
                  style={{ textDecoration: "none" }}
                >
                  <CardMedia
                    sx={{ height: 140 }}
                    image={product.imageUrl_3}
                    title={product.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {product.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Add To Cart</Button>
                  </CardActions>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No products found
          </Typography>
        )}
      </Stack>
    </div>
  );
}

// 