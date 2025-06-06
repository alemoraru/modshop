import Link from "next/link";
import Image from "next/image";

export interface ProductCardProps {
    slug: string;
    title: string;
    price: number;
    image: string;
    description?: string;
    category?: string;
}

/**
 * Functional component to render a product card.
 * @param slug the unique identifier for the product
 * @param title the title of the product
 * @param price the price of the product
 * @param image the URL of the product image
 * @param category the category of the product (optional)
 */
export default function ProductCard({slug, title, price, image, category}: ProductCardProps) {
    return (
        <Link
            href={`/product/${slug}`}
            className="border rounded-xl p-4 transition-transform duration-200 hover:scale-105 hover:border-blue-500 hover:shadow-lg cursor-pointer"
        >
            <Image
                src={image}
                alt={title}
                width={400}
                height={160}
                className="w-full h-40 object-cover rounded"
            />
            <div className="mt-2">
                {category && (
                    <span
                        className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full mb-1">
                        {category}
                    </span>
                )}
                <h2 className="font-semibold">{title}</h2>
                <p className="text-sm text-gray-600">€{price}</p>
            </div>
        </Link>
    );
}
