"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, MenuItem, TextField } from "@mui/material";
import type { CategoryOption } from "@/types";

export function ProductSearch({
  categories,
  initialQuery,
  initialCategoryId,
}: {
  categories: CategoryOption[];
  initialQuery: string;
  initialCategoryId: number | null;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [categoryId, setCategoryId] = useState(initialCategoryId ? String(initialCategoryId) : "");
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (categoryId) params.set("category", categoryId);

      const search = params.toString();
      router.replace(search ? `/?${search}` : "/");
    }, 350);

    return () => clearTimeout(timer);
  }, [query, categoryId, router]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        mb: 4,
        alignItems: { xs: "stretch", sm: "center" },
      }}
    >
      <TextField
        label="Search watches"
        size="small"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        sx={{ flex: 1, bgcolor: "#fff" }}
      />
      <TextField
        select
        label="Category"
        size="small"
        value={categoryId}
        onChange={(event) => setCategoryId(event.target.value)}
        sx={{ width: { xs: "100%", sm: 240 }, bgcolor: "#fff" }}
      >
        <MenuItem value="">All categories</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category.id} value={String(category.id)}>
            {category.name}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
