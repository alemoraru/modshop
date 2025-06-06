import {getAllProducts} from "@/lib/getAllProducts";
import Link from "next/link";
import Image from "next/image";

function stringSimilarity(a: string, b: string): number {
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a === b) return 1;
    if (a.includes(b) || b.includes(a)) return 0.8;
    let matches = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        if (a[i] === b[i]) matches++;
    }
    return matches / Math.max(a.length, b.length);
}

export default async function SearchPage({searchParams}: { searchParams: { query?: string } }) {
    const searchParameters = await searchParams;
    const query = searchParameters.query || "";
    const allProducts = getAllProducts();
    const filtered = query ?
        allProducts
            .map(product => ({
                product,
                score: stringSimilarity(product.title, query)
            }))
            .filter(({score}) => score > 0.2)
            .sort((a, b) => b.score - a.score)
            .map(({product}) => product)
        : [];

    return (
        <main className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
            {query === "" ? (
                <p>Enter a search term above.</p>
            ) : filtered.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filtered.map(product => (
                        <Link key={product.slug} href={`/product/${product.slug}`}
                              className="block border rounded p-4 hover:shadow-lg transition">
                            <Image src={product.image} alt={product.title} width={200} height={200}
                                   className="w-full h-40 object-cover rounded mb-2"/>
                            <h2 className="font-semibold text-lg">{product.title}</h2>
                            <p className="text-blue-700 font-bold">€{product.price}</p>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
