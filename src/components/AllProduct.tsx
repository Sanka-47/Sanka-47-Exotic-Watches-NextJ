"use server";
import React from "react";
import { Product } from "@prisma/client";
import { db } from "@/db";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { FreeSolo } from "./ComponentSearch";


async function AllProduct() {
  const products: Product[] = await db.product.findMany();
  function handleSearch(term: string) {
    console.log(term);
  }

  return (
    <div>
      {/* <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder="ds"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      /> */}

      <FreeSolo />

      {
      
      
      products.map((product) => (
        <Card sx={{ maxWidth: 345 }} key={product.id}>
          <Link
            href={`/admin/product/${product.id}/view`}
            style={{ textDecoration: "none" }}
          >
            <CardMedia
              sx={{ height: 340 }}
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
  );
}

export default AllProduct;
