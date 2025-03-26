"use client";

import * as React from "react";
import { DataGrid, GridColDef, GridCellParams } from "@mui/x-data-grid";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useState } from "react";

import { ProductStatus } from "@/types";
import * as actions from "@/actions";
import { formatToUSD } from "@/utils/moneyFormat";
import { getStatusColor } from "@/utils/status";
import formatStatus from "@/utils/formatStatus";

interface ProductData {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  status: string;
  categoryId: number;
  categoryName: string;
}

interface ProductListTableProps {
  products: ProductData[];
}

export default function ProductListTable({ products }: ProductListTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  React.useEffect(() => {
    console.log(products);
  }, [products]);

  const handleDelete = async (id: number) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setIsDeleting(id);

    try {
      const response = await actions.productDelete(id);

      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.message,
          timer: 2000,
          showConfirmButton: false,
        });
        // Refresh the page to reflect the updated product list
        router.refresh();
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong while deleting the product!",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const rows = products;

  const columns: GridColDef[] = [
    {
      field: "imageUrl",
      headerName: "Product",
      width: 100,
      renderCell: (params: GridCellParams) => {
        const imageUrl = products.find(
          (product) => product.id === params.id
        )?.imageUrl;

        return (
          <Image
            src={imageUrl || "/placeholder-image.jpg"} // Fallback image
            alt="product name"
            width={40}
            height={40}
            style={{
              borderRadius: "8px",
              objectFit: "cover",
              border: "1px solid #e0e0e0",
            }}
            priority
          />
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <span style={{ fontWeight: 500, color: "#1a1a1a" }}>
          {params.value as string}
        </span>
      ),
    },
    {
      field: "categoryName",
      headerName: "Category",
      width: 130,
      renderCell: (params: GridCellParams) => (
        <span style={{ color: "#6b7280" }}>{params.value as string}</span>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      renderCell: (params: GridCellParams) => (
        <span
          style={{
            color: "#6b7280",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {params.value as string}
        </span>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      renderCell: (params: GridCellParams) => {
        const paramVal = params.formattedValue as number;
        const formattedPrice = formatToUSD(paramVal);
        return <span style={{ fontWeight: 500, color: "#1a1a1a" }}>{formattedPrice}</span>;
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 120,
      renderCell: (params: GridCellParams) => (
        <span style={{ color: "#1a1a1a" }}>{params.value as number}</span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params: GridCellParams) => {
        const status = params.formattedValue as ProductStatus;
        const statusColor = getStatusColor(status);
        const statusValue = formatStatus(status);

        return (
          <span
            style={{
              backgroundColor: statusColor || "#1976d2",
              color: "#fff",
              padding: "4px 12px",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {statusValue}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Tooltip title="Edit">
            <Link href={`/admin/product/${params.id}/edit`}>
              <IconButton
                sx={{
                  color: "#1976d2",
                  "&:hover": {
                    bgcolor: "rgba(25, 118, 210, 0.1)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="View">
            <Link href={`/admin/product/${params.id}/view`}>
              <IconButton
                sx={{
                  color: "#4caf50",
                  "&:hover": {
                    bgcolor: "rgba(76, 175, 80, 0.1)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <RemoveRedEyeOutlinedIcon fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDelete(params.id as number)}
              disabled={isDeleting === params.id}
              sx={{
                color: isDeleting === params.id ? "#bdbdbd" : "#ef5350",
                "&:hover": {
                  bgcolor: "rgba(239, 83, 80, 0.1)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease-in-out",
                cursor: isDeleting === params.id ? "not-allowed" : "pointer",
              }}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", bgcolor: "#f5f5f5", p: 2, borderRadius: 2 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        sx={{
          bgcolor: "#ffffff",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: "#f5f5f5",
            borderBottom: "1px solid #e0e0e0",
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600,
              color: "#1a1a1a",
              fontSize: "0.875rem",
              textTransform: "uppercase",
            },
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #f0f0f0",
            color: "#1a1a1a",
            fontSize: "0.875rem",
            "&:focus": {
              outline: "none",
            },
          },
          "& .MuiDataGrid-row": {
            "&:hover": {
              bgcolor: "rgba(25, 118, 210, 0.05)",
            },
            transition: "background-color 0.2s ease-in-out",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid #e0e0e0",
            bgcolor: "#f5f5f5",
            "& .MuiTablePagination-root": {
              color: "#1a1a1a",
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              fontSize: "0.875rem",
            },
          },
          "& .MuiDataGrid-columnSeparator": {
            color: "#e0e0e0",
          },
          "& .MuiDataGrid-scrollbar": {
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              bgcolor: "#f0f0f0",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#bdbdbd",
              borderRadius: "4px",
              "&:hover": {
                bgcolor: "#a0a0a0",
              },
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}