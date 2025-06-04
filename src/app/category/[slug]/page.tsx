import {readdirSync, readFileSync} from "fs";
import path from "path";
import matter from "gray-matter";
import {Metadata} from "next";
import {notFound} from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
    title: "ModShop | Category",
    description: "Browse products by category",
};

export default async function CategoryPage({params}: { params: { slug: string } }) {
    const {slug} = params;
    // Map slugs to actual folder names if needed
    const categoryMap: Record<string, string> = {
        "clothing": "clothing",
        "video-games": "video-games",
        "books": "books",
        "household": "household",
        "household-items": "household" // fallback for old slug
    };
    const categoryFolder = categoryMap[slug];
    if (!categoryFolder) notFound();

    const dirPath = path.join(process.cwd(), "products", categoryFolder);
    let products = [];
    try {
        products = readdirSync(dirPath)
            .filter((file) => file.endsWith(".mdx"))
            .map((file) => {
                const filePath = path.join(dirPath, file);
                const fileContent = readFileSync(filePath, "utf-8");
                const {data} = matter(fileContent);
                return {
                    slug: data.slug,
                    title: data.title,
                    price: data.price,
                    image: data.image,
                    description: data.description,
                };
            });
    } catch (e) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white text-gray-900">
            <Navbar/>
            <section className="py-12 px-6">
                <h1 className="text-3xl font-bold mb-8 capitalize">{slug.replace("-", " ")} Collection</h1>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                    {products.map((product) => (
                        <Link
                            key={product.slug}
                            href={`/product/${product.slug}`}
                            className="border rounded-xl p-4 transition-transform duration-200 hover:scale-105 hover:border-purple-500 hover:shadow-lg"
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
