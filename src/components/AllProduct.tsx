

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


async function AllProduct() {
  const products: Product[] = await db.product.findMany();

  return (
    <div>
      {products.map((product) => (
        <Card sx={{ maxWidth: 345 }} key={product.id}>
          <Link 
            href={`/admin/product/${product.id}/view`} 
           
            style={{ textDecoration: 'none' }}
          >
            <CardMedia
              sx={{ height: 140 }}
              image={product.imageUrl}
              title={product.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {product.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
