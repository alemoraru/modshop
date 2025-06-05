import { NextResponse } from "next/server";
import { getAllProducts, getCheapestInCategory } from "@/utils/productLoader";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const exclude = searchParams.get('exclude');
    
    if (category) {
        // Get cheapest product in category
        const cheapest = getCheapestInCategory(category, exclude || undefined);
        return NextResponse.json(cheapest);
    }
    
    // Get all products
    const products = getAllProducts();
    return NextResponse.json(products);
}
