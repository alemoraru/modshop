"use client";

import {useCart} from "@/context/CartContext";
import React, {useState} from "react";
import Image from "next/image";
import {Check, ShoppingCart, Star} from "lucide-react";

/**
 * ProductFrontmatter interface defines the structure of the product metadata.
 * It includes the frontmatter fields from the MDX file.
 */
interface ProductFrontmatter {
    title: string;
    slug: string;
    category: string;
    price: number;
    image: string;
    description: string;
    manufacturer?: string;
    releaseDate?: string;
    material?: string;
    dimensions?: string;
    reviews?: { user: string; rating: number; comment: string }[];
}

export default function ProductDetail({frontmatter, mdxContent}: {
    frontmatter: ProductFrontmatter,
    mdxContent: React.ReactNode
}) {
    const {addItem} = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addItem({
            slug: frontmatter.slug,
            title: frontmatter.title,
            price: frontmatter.price,
            quantity: 1,
            image: frontmatter.image,
            category: frontmatter.category,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
    };

    return (
        <main className="bg-white text-gray-900">
            <section className="py-12 px-6 max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-10">
                    {/* Left side: Image and meta info */}
                    <div>
                        <Image
                            src={frontmatter.image}
                            alt={frontmatter.title}
                            width={400}
                            height={400}
                            className="w-full h-auto rounded"
                            priority
                        />

                        {/* Mobile-only title, description, price, and button */}
                        <div className="block md:hidden mt-6">
                            <h1 className="text-2xl font-bold mb-2">{frontmatter.title}</h1>
                            <p className="text-gray-600 mb-2">{frontmatter.description}</p>
                            <p className="text-xl font-semibold text-blue-700 mb-4">€{frontmatter.price}</p>
                            <button
                                className={`bg-blue-600 text-white px-5 py-2 rounded transition-all duration-300 hover:bg-blue-700 flex items-center gap-2 ${added ? 'scale-105 bg-green-500' : ''} cursor-pointer`}
                                onClick={handleAddToCart}
                                disabled={added}
                            >
                                {added ? (
                                    <span className="flex items-center gap-1">
                                        <Check/> Added
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <ShoppingCart className="p-1"/> Add to Cart
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Product specs */}
                        <div className="mt-6 space-y-2 text-sm text-gray-700">
                            {frontmatter.manufacturer &&
                                <p><strong>Manufacturer:</strong> {frontmatter.manufacturer}</p>}
                            {frontmatter.releaseDate && <p><strong>Release Date:</strong> {frontmatter.releaseDate}</p>}
                            {frontmatter.material && <p><strong>Material:</strong> {frontmatter.material}</p>}
                            {frontmatter.dimensions && <p><strong>Dimensions:</strong> {frontmatter.dimensions}</p>}
                        </div>

                        {/* Reviews */}
                        {frontmatter.reviews && frontmatter.reviews.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
                                <div className="space-y-4">
                                    {frontmatter.reviews.map((review, i) => (
                                        <div key={i} className="border rounded-md p-3 shadow-sm bg-gray-50">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-sm text-gray-800">{review.user}</span>
                                                <div className="flex items-center space-x-1">
                                                    {[...Array(5)].map((_, idx) => (
                                                        <Star
                                                            key={idx}
                                                            className={`w-4 h-4 ${idx < review.rating ? "fill-yellow-400 stroke-yellow-400" : "text-gray-300"}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right side (desktop only): Title, description, price, button, and content */}
                    <div className="hidden md:block">
                        <h1 className="text-3xl font-bold mb-2">{frontmatter.title}</h1>
                        <p className="text-lg text-gray-600 mb-4">{frontmatter.description}</p>
                        <p className="text-xl font-semibold text-blue-700 mb-6">€{frontmatter.price}</p>
                        <button
                            className={`bg-blue-600 text-white px-5 py-2 rounded transition-all duration-300 hover:bg-blue-700 flex items-center gap-2 ${added ? 'scale-105 bg-green-500' : ''} cursor-pointer`}
                            onClick={handleAddToCart}
                            disabled={added}
                        >
                            {added ? (
                                <span className="flex items-center gap-1">
                                    <Check/> Added
                                </span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <ShoppingCart className="p-1"/> Add to Cart
                                </span>
                            )}
                        </button>
                        <article className="prose prose-blue max-w-none mt-8">
                            {mdxContent}
                        </article>
                    </div>
                </div>

                {/* Mobile-only MDX content */}
                <div className="block md:hidden mt-8">
                    <article className="prose prose-blue max-w-none">
                        {mdxContent}
                    </article>
                </div>
            </section>
        </main>
    );
}
