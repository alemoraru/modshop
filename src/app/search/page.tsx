import {getAllProducts} from "@/lib/getAllProducts";
import ProductCard from "@/components/ProductCard";

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

/**
 * SearchPage component to display search results based on the query parameter.
 * @param searchParams - The search parameters from the URL, specifically the `query` parameter.
 */
export default async function SearchPage({searchParams}: { searchParams: { query?: string } }) {
    const searchParameters = await searchParams;
    const query = searchParameters.query || "";
    const allProducts = getAllProducts();
    const filtered = query ?
        allProducts
            .map(product => {
                const titleScore = stringSimilarity(product.title, query);
                const categoryScore = stringSimilarity(product.category, query);
                return {
                    product,
                    score: Math.max(titleScore, categoryScore)
                };
            })
            .filter(({score}) => score > 0.2)
            .sort((a, b) => b.score - a.score)
            .map(({product}) => product)
        : [];

    return (
        <main className="bg-white text-gray-900">
            <section className="py-12 px-6 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Search Results for &#34;{query}&#34;:</h1>
                {query === "" ? (
                    <p>Enter a search term above.</p>
                ) : filtered.length === 0 ? (
                    <p>No products found.</p>
                ) : (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                        {filtered.map(product => (
                            <ProductCard
                                key={product.slug}
                                slug={product.slug}
                                title={product.title}
                                price={product.price}
                                image={product.image}
                                description={product.description}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
