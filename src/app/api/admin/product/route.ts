import { db } from "@/db";
import cloudinary from "@/config/cloudinary";
import { ProductData } from "@/types";
export const POST = async (req: Request) => {
    try {
        const formData = await req.formData();

        const name = formData.get('name') as string;
        const price = formData.get('price') as string;
        const quantity = parseInt(formData.get('quantity') as string);
        const description = formData.get('description') as string;
        const image = formData.get('image') as File;
        const status = '';

        const productData: ProductData = {
            name,
            description,
            price,
            quantity,
            status,
            imageUrl: '',
        };
        

    } catch (error) {
        //
    }
}
