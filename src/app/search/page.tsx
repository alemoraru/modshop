"use client";

import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
    title: string;
    slug: string;
    category: string;
    price: number;
    image: string;
    description: string;
}

// Placeholder for fetching all products. Will be replaced with real data fetching.
async function fetchAllProducts(): Promise<Product[]> {
    // TODO: Replace with real fetch logic
    return [];
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function searchProducts() {
            setLoading(true);
            const allProducts = await fetchAllProducts();
            // TODO: Add string similarity filtering here
            setResults(allProducts);
            setLoading(false);
        }
        if (query) searchProducts();
    }, [query]);

    return (
        <main className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
            {loading ? (
                <p>Loading...</p>
            ) : results.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {results.map(product => (
                        <Link key={product.slug} href={`/product/${product.slug}`} className="block border rounded p-4 hover:shadow-lg transition">
                            <Image src={product.image} alt={product.title} width={200} height={200} className="w-full h-40 object-cover rounded mb-2" />
                            <h2 className="font-semibold text-lg">{product.title}</h2>
                            <p className="text-blue-700 font-bold">€{product.price}</p>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}

