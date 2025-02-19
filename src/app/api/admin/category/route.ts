import { db } from "@/db";
import { Categories } from "@prisma/client";

export async function GET() {
    try {
      const products: Categories[] = await db.categories.findMany();
      const json = JSON.stringify(products);
      return new Response(json, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      return new Response(JSON.stringify({ error: 'Error fetching products' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }