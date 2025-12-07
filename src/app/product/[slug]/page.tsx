import { readdirSync, readFileSync } from "fs"
import path from "path"
import matter from "gray-matter"
import { MDXRemote } from "next-mdx-remote/rsc"
import ProductDetail from "@/components/ProductDetail"
import { pageParams } from "@/lib/types"

interface ProductFrontmatter {
    title: string
    slug: string
    category: string
    price: number
    image: string
    description: string
}

/**
 * This function generates static parameters for all product slugs.
 * It reads the product categories and their respective files to create a list of slugs.
 * @returns An array of objects containing the product slugs.
 */
export async function generateStaticParams() {
    const categories = readdirSync(path.join(process.cwd(), "products"))

    return categories.flatMap(category => {
        const dirPath = path.join(process.cwd(), "products", category)
        return readdirSync(dirPath).map(file => {
            const slug = file.replace(/\.mdx$/, "")
            return { slug }
        })
    })
}

/**
 * This component renders a product detail page based on the product slug.
 * @param props - Contains the product slug from the URL parameters.
 */
export default async function ProductPage(props: { params: pageParams }) {
    const categories = readdirSync(path.join(process.cwd(), "products"))
    const { slug } = await props.params

    for (const category of categories) {
        const filePath = path.join(process.cwd(), "products", category, `${slug}.mdx`)
        try {
            const file = readFileSync(filePath, "utf-8")
            const { content, data } = matter(file)
            const frontmatter = data as ProductFrontmatter
            return (
                <ProductDetail
                    frontmatter={frontmatter}
                    mdxContent={
                        <article className="prose prose-blue max-w-none">
                            <MDXRemote source={content} />
                        </article>
                    }
                />
            )
        } catch (error) {
            const err = error as NodeJS.ErrnoException
            if (err.code !== "ENOENT") {
                console.error(`Error reading product file: ${filePath}`, err)
            }
        }
    }
    return <div className="p-12 text-center text-red-500">Product not found.</div>
}
