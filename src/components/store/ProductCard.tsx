import Link from "next/link";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import { formatUsd } from "@/lib/money";
import { formatStatus, getStatusColor } from "@/lib/stock";
import type { ProductListItem } from "@/types";

export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
      }}
    >
      <CardActionArea component={Link} href={`/product/${product.id}`} sx={{ height: "100%" }}>
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            image={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            sx={{ height: 220, objectFit: "cover" }}
          />
          <Chip
            size="small"
            label={formatStatus(product.status)}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: getStatusColor(product.status),
              color: "#fff",
              fontWeight: 600,
            }}
          />
        </Box>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} noWrap>
            {product.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              minHeight: 40,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1.5 }}>
            {formatUsd(product.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
