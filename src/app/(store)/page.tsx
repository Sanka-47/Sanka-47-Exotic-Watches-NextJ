import type { Metadata } from "next";
import { Box, Typography } from "@mui/material";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductPagination } from "@/components/store/ProductPagination";
import { ProductSearch } from "@/components/store/ProductSearch";
import { getCategories, getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop luxury watches",
  description: "Browse the Exotica Watches collection.",
};

interface HomePageProps {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}

function parsePositiveInt(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim().slice(0, 100);
  const categoryId = parsePositiveInt(params.category);
  const requestedPage = parsePositiveInt(params.page) ?? 1;

  const [categories, result] = await Promise.all([
    getCategories(),
    getProducts({ search: query || undefined, categoryId, page: requestedPage }),
  ]);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Exotic watches, curated
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {result.total} {result.total === 1 ? "timepiece" : "timepieces"} available
        </Typography>
      </Box>

      <ProductSearch
        categories={categories}
        initialQuery={query}
        initialCategoryId={categoryId}
      />

      {result.items.length === 0 ? (
        <Box sx={{ py: 10, textAlign: "center", color: "text.secondary" }}>
          <Typography variant="h6">No watches match your search.</Typography>
          <Typography variant="body2">Try a different name or category.</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
          }}
        >
          {result.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Box>
      )}

      <ProductPagination
        page={result.page}
        pageCount={result.pageCount}
        query={query}
        categoryId={categoryId}
      />
    </Box>
  );
}
