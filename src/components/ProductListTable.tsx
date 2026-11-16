"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Image from "next/image";
import { productDelete } from "@/lib/actions/products";
import { formatUsd } from "@/lib/money";
import { formatStatus, getStatusColor } from "@/lib/stock";
import { useFeedback } from "@/components/feedback";
import type { ProductListItem } from "@/types";

export default function ProductListTable({ products }: { products: ProductListItem[] }) {
  const router = useRouter();
  const { confirm, notify } = useFeedback();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(product: ProductListItem) {
    const confirmed = await confirm({
      title: "Delete this product?",
      message: `“${product.name}” and its images will be permanently removed.`,
      confirmLabel: "Delete",
      destructive: true,
    });

    if (!confirmed) return;

    setDeletingId(product.id);
    try {
      const result = await productDelete(product.id);
      notify(result.message, result.success ? "success" : "error");
      if (result.success) router.refresh();
    } catch {
      notify("Something went wrong while deleting the product.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  const columns: GridColDef<ProductListItem>[] = [
    {
      field: "imageUrl",
      headerName: "Image",
      width: 90,
      sortable: false,
      renderCell: ({ row }) => (
        <Image
          src={row.imageUrl || "/placeholder.svg"}
          alt={row.name}
          width={40}
          height={40}
          style={{ borderRadius: 8, objectFit: "cover" }}
        />
      ),
    },
    { field: "name", headerName: "Name", width: 180 },
    { field: "categoryName", headerName: "Category", width: 140 },
    {
      field: "description",
      headerName: "Description",
      width: 240,
      renderCell: ({ row }) => (
        <span
          style={{
            color: "#6b7280",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {row.description}
        </span>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      renderCell: ({ row }) => <strong>{formatUsd(row.price)}</strong>,
    },
    { field: "quantity", headerName: "Stock", width: 90, type: "number" },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: ({ row }) => (
        <Chip
          size="small"
          label={formatStatus(row.status)}
          sx={{ bgcolor: getStatusColor(row.status), color: "#fff", fontWeight: 600 }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Tooltip title="Edit">
            <IconButton
              component={Link}
              href={`/admin/product/${row.id}/edit`}
              aria-label={`Edit ${row.name}`}
              size="small"
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton
              component={Link}
              href={`/admin/product/${row.id}/view`}
              aria-label={`View ${row.name}`}
              size="small"
            >
              <RemoveRedEyeOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <span>
              <IconButton
                onClick={() => void handleDelete(row)}
                disabled={deletingId === row.id}
                aria-label={`Delete ${row.name}`}
                size="small"
                color="error"
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", bgcolor: "#fff", borderRadius: 2, p: 1 }}>
      <DataGrid
        rows={products}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        autoHeight
        sx={{ border: "none" }}
      />
    </Box>
  );
}
