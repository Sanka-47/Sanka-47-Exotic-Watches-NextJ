"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { productCreate } from "@/lib/actions/products";
import { useFeedback } from "@/components/feedback";
import type { CategoryOption } from "@/types";

interface Preview {
  file: File;
  url: string;
}

const MAX_IMAGES = 3;

export default function ProductAddForm({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const { notify } = useFeedback();

  const [fields, setFields] = useState({
    name: "",
    price: "",
    quantity: "0",
    description: "",
    categoryId: "",
  });
  const [previews, setPreviews] = useState<Preview[]>([]);
  const previewsRef = useRef<Preview[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  // Revoke object URLs only when the component unmounts (or an image is
  // explicitly replaced/removed), not on every state update.
  useEffect(() => {
    return () => previewsRef.current.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, []);

  function handleChange(field: keyof typeof fields) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setFields((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? [])
      .filter((file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024)
      .slice(0, MAX_IMAGES);

    previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setPreviews(selected.map((file) => ({ file, url: URL.createObjectURL(file) })));
  }

  function removePreview(url: string) {
    const target = previews.find((preview) => preview.url === url);
    if (target) URL.revokeObjectURL(target.url);
    setPreviews((current) => current.filter((preview) => preview.url !== url));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (previews.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    const formData = new FormData();
    formData.set("name", fields.name);
    formData.set("price", fields.price);
    formData.set("quantity", fields.quantity);
    formData.set("description", fields.description);
    formData.set("categoryId", fields.categoryId);
    previews.forEach((preview) => formData.append("images", preview.file));

    setSubmitting(true);
    try {
      const result = await productCreate(formData);
      notify(result.message, result.success ? "success" : "error");

      if (result.success) {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      notify("Something went wrong while creating the product.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Typography variant="h5" fontWeight={700}>
        Create product
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add details and up to {MAX_IMAGES} images. Images are stored in Cloudinary.
      </Typography>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "grid", gap: 2 }}>
              <TextField label="Product name" required value={fields.name} onChange={handleChange("name")} />

              <TextField
                select
                label="Category"
                value={fields.categoryId}
                onChange={handleChange("categoryId")}
                helperText={categories.length === 0 ? "No categories exist yet." : undefined}
              >
                <MenuItem value="">Uncategorized</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>

              <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                <TextField
                  label="Price"
                  required
                  type="number"
                  inputProps={{ min: 0.01, step: 0.01 }}
                  InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                  value={fields.price}
                  onChange={handleChange("price")}
                />
                <TextField
                  label="Quantity"
                  required
                  type="number"
                  inputProps={{ min: 0, step: 1 }}
                  value={fields.quantity}
                  onChange={handleChange("quantity")}
                />
              </Box>

              <TextField
                label="Description"
                required
                multiline
                minRows={4}
                maxRows={8}
                value={fields.description}
                onChange={handleChange("description")}
              />

              <Box>
                <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                  Choose images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleFiles}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                  JPEG, PNG, WebP or AVIF · max 5 MB each
                </Typography>
              </Box>

              {previews.length > 0 ? (
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  {previews.map((preview) => (
                    <Box key={preview.url} sx={{ position: "relative" }}>
                      <Image
                        src={preview.url}
                        alt="Selected product image"
                        width={110}
                        height={110}
                        unoptimized
                        style={{ objectFit: "cover", borderRadius: 8 }}
                      />
                      <IconButton
                        size="small"
                        aria-label="Remove image"
                        onClick={() => removePreview(preview.url)}
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          bgcolor: "rgba(255,255,255,0.9)",
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              ) : null}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
              <Button onClick={() => router.back()} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "Creating…" : "Create product"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
