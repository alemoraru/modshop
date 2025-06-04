import {Metadata} from "next";
import {notFound} from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const mockProducts = Array.from({length: 10}, (_, i) => ({
    id: `prod-${i}`,
    title: `Product ${i + 1}`,
    price: (i + 1) * 10,
    image: "/images/products/sample.jpg",
}));

export const metadata: Metadata = {
    title: "ModShop | Category",
    description: "Browse products by category",
};

export default async function CategoryPage({params}: { params: { slug: string } }) {
    const {slug} = await params;
    const knownCategories = ["clothing", "video-games", "books", "household-items"];
    if (!knownCategories.includes(slug)) notFound();

    return (
        <main className="min-h-screen bg-white text-gray-900">
            <Navbar/>
            <section className="py-12 px-6">
                <h1 className="text-3xl font-bold mb-8 capitalize">{slug.replace("-", " ")} Collection</h1>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                    {mockProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            className="border rounded-xl p-4 hover:shadow"
                        >
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-40 object-cover rounded"
                            />
                            <div className="mt-2">
                                <h2 className="font-semibold">{product.title}</h2>
                                <p className="text-sm text-gray-600">${product.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
