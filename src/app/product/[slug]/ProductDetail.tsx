"use client";

import {useCart} from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import React, {useState} from "react";

interface ProductFrontmatter {
    title: string;
    slug: string;
    category: string;
    price: number;
    image: string;
    description: string;
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
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
    };
    return (
        <main className="min-h-screen bg-white text-gray-900">
            <Navbar/>
            <section className="py-12 px-6 max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-10">
                    <img
                        src={frontmatter.image}
                        alt={frontmatter.title}
                        className="w-full h-auto rounded"
                    />
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{frontmatter.title}</h1>
                        <p className="text-lg text-gray-600 mb-4">{frontmatter.description}</p>
                        <p className="text-xl font-semibold text-purple-700 mb-6">${frontmatter.price}</p>
                        <button
                            className={`bg-purple-600 text-white px-6 py-2 rounded transition-all duration-300 hover:bg-purple-700 flex items-center gap-2 ${added ? 'scale-105 bg-green-500' : ''}`}
                            onClick={handleAddToCart}
                            disabled={added}
                        >
                            {added ? (
                                <span className="flex items-center gap-1">✔ Added</span>
                            ) : (
                                "Add to Cart"
                            )}
                        </button>
                    </div>
                </div>
                <article className="mt-12 prose prose-lg">
                    {mdxContent}
                </article>
            </section>
        </main>
    );
}
