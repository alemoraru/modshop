import { readdirSync, readFileSync } from "fs"
import path from "path"
import matter from "gray-matter"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { pageParams } from "@/lib/types"
import ProductCard from "@/components/ProductCard"

export const metadata: Metadata = {
    title: "ModShop | Category",
    description: "Browse products by category",
}

/**
 * This component renders a category page, displaying all products in a specific category.
 * @param props - Contains the category slug from the URL parameters.
 */
export default async function CategoryPage(props: { params: pageParams }) {
    const { slug } = await props.params

    // Map slugs to actual folder names if needed
    const categoryMap: Record<string, string> = {
        clothing: "clothing",
        "video-games": "video-games",
        books: "books",
        household: "household",
        "household-items": "household", // fallback for old slug
    }
    const categoryFolder = categoryMap[slug]
    if (!categoryFolder) notFound()

    const dirPath = path.join(process.cwd(), "products", categoryFolder)
    let products = []
    try {
        products = readdirSync(dirPath)
            .filter(file => file.endsWith(".mdx"))
            .map(file => {
                const filePath = path.join(dirPath, file)
                const fileContent = readFileSync(filePath, "utf-8")
                const { data } = matter(fileContent)
                return {
                    slug: data.slug,
                    title: data.title,
                    price: data.price,
                    image: data.image,
                    description: data.description,
                }
            })
    } catch (e) {
        console.error(`Error reading category files: ${dirPath}`, e)
        notFound()
    }

    return (
        <main className="bg-white text-gray-900">
            <section className="py-12 px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold capitalize mb-1 flex items-end gap-2">
                        {slug.replace("-", " ")} Collection
                        <span className="hidden sm:inline text-base font-normal text-gray-500 pb-1 align-middle">
                            ({products.length} items available)
                        </span>
                    </h1>
                    <span className="block sm:hidden text-base font-normal text-gray-500 align-middle mt-1">
                        {products.length} items available
                    </span>
                </div>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                    {products.map(product => (
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
            </section>
        </main>
    )
}
