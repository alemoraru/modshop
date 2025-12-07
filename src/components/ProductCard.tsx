import Link from "next/link"
import Image from "next/image"

export interface ProductCardProps {
    slug: string
    title: string
    price: number
    image: string
    description?: string
    category?: string
}

/**
 * Functional component to render a product card.
 * @param slug the unique identifier for the product
 * @param title the title of the product
 * @param price the price of the product
 * @param image the URL of the product image
 * @param category the category of the product (optional)
 */
export default function ProductCard({ slug, title, price, image, category }: ProductCardProps) {
    return (
        <Link
            href={`/product/${slug}`}
            className="group border rounded-2xl p-0 bg-white shadow-sm hover:shadow-xl transition-all
            duration-200 hover:scale-[1.03] hover:border-blue-500 cursor-pointer flex flex-col overflow-hidden"
        >
            <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-contain transition-transform duration-200"
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority={false}
                />
                {category && (
                    <span
                        className="absolute top-3 left-3 bg-blue-100 text-blue-700 text-xs
                        font-semibold px-2 py-1 rounded-full shadow"
                    >
                        {category}
                    </span>
                )}
            </div>
            <div className="flex-1 flex flex-col justify-between p-4 gap-2">
                <h2 className="font-semibold text-lg text-gray-800 truncate" title={title}>
                    {title}
                </h2>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-blue-600 font-bold text-base">€{price}</span>
                    <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
                        View details →
                    </span>
                </div>
            </div>
        </Link>
    )
}
