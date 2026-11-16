"use client";

import { useEffect, useState } from "react";
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
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { productEdit } from "@/lib/actions/products";
import { useFeedback } from "@/components/feedback";
import type { EditableProduct } from "@/lib/products";

export default function ProductEditForm({ product }: { product: EditableProduct }) {
  const router = useRouter();
  const { notify } = useFeedback();

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(String(product.quantity));
  const [description, setDescription] = useState(product.description);
  const [image, setImage] = useState<{ file: File; url: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image.url);
    };
  }, [image]);

  const previewUrl = image?.url ?? product.imageUrl;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData();
    formData.set("id", String(product.id));
    formData.set("name", name);
    formData.set("price", price);
    formData.set("quantity", quantity);
    formData.set("description", description);
    if (image) formData.set("image", image.file);

    try {
      const result = await productEdit(formData);
      notify(result.message, result.success ? "success" : "error");

      if (result.success) {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      notify("Something went wrong while updating the product.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Typography variant="h5" fontWeight={700}>
        Edit product
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Update product details. Leave the image empty to keep the current photo.
      </Typography>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "grid", gap: 2 }}
          >
            <TextField label="Product name" required value={name} onChange={(e) => setName(e.target.value)} />

            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
              <TextField
                label="Price"
                required
                type="number"
                inputProps={{ min: 0.01, step: 0.01 }}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <TextField
                label="Quantity"
                required
                type="number"
                inputProps={{ min: 0, step: 1 }}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Box>

            <TextField
              label="Description"
              required
              multiline
              minRows={4}
              maxRows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Image
                src={previewUrl || "/placeholder.svg"}
                alt="Product image preview"
                width={120}
                height={120}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
              <Box>
                <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                  Replace image
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setImage({ file, url: URL.createObjectURL(file) });
                    }}
                  />
                </Button>
                {image ? (
                  <IconButton aria-label="Discard new image" onClick={() => setImage(null)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                ) : null}
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
              <Button onClick={() => router.back()} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "Saving…" : "Save changes"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
