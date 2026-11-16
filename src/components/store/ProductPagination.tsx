"use client";

import Link from "next/link";
import { Box, Pagination, PaginationItem } from "@mui/material";

function pageHref(page: number, query: string, categoryId: number | null) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (categoryId) params.set("category", String(categoryId));
  if (page > 1) params.set("page", String(page));

  const search = params.toString();
  return search ? `/?${search}` : "/";
}

export function ProductPagination({
  page,
  pageCount,
  query,
  categoryId,
}: {
  page: number;
  pageCount: number;
  query: string;
  categoryId: number | null;
}) {
  if (pageCount <= 1) return null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Pagination
        count={pageCount}
        page={page}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            href={pageHref(item.page ?? 1, query, categoryId)}
            {...item}
          />
        )}
      />
    </Box>
  );
}
