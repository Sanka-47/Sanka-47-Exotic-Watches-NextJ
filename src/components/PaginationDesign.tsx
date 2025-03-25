"use client";

import React from "react";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";

export function PaginationDesign() {
  // Dummy values for pagination (non-functional)
  const totalPages = 5; // Example: 5 pages
  const currentPage = 1; // Example: Current page is 1

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
        pb: 2,
      }}
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={() => {}} // Empty handler since it's non-functional
        color="primary"
        size="medium"
        sx={{
          "& .MuiPaginationItem-root": {
            borderRadius: "8px",
            fontWeight: 500,
            transition: "background-color 0.2s ease-in-out",
            "&:hover": {
              bgcolor: "rgba(25, 118, 210, 0.1)", // Subtle hover effect
            },
          },
          "& .Mui-selected": {
            bgcolor: "#1976d2",
            color: "white",
            "&:hover": {
              bgcolor: "#1565c0",
            },
          },
          "& .MuiPaginationItem-ellipsis": {
            display: "flex",
            alignItems: "center",
          },
        }}
      />
    </Box>
  );
}