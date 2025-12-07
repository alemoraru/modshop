import { readdirSync, readFileSync } from "fs"
import path from "path"
import matter from "gray-matter"

/**
 * Represents a product with its details.
 */
export interface Product {
    slug: string
    title: string
    category: string
    price: number
    image: string
    description: string
}

/**
 * Load all products from the products directory
 * This is a server-side-only function
 */
export function getAllProducts(): Product[] {
    const productsDir = path.join(process.cwd(), "products")
    const categories = readdirSync(productsDir)

    const products: Product[] = []

    for (const category of categories) {
        const categoryDir = path.join(productsDir, category)
        try {
            const files = readdirSync(categoryDir)
            for (const file of files) {
                if (file.endsWith(".mdx")) {
                    const filePath = path.join(categoryDir, file)
                    const fileContent = readFileSync(filePath, "utf-8")
                    const { data } = matter(fileContent)

                    products.push({
                        slug: data.slug,
                        title: data.title,
                        category: data.category,
                        price: data.price,
                        image: data.image,
                        description: data.description,
                    })
                }
            }
        } catch (error) {
            console.error(`Error reading category ${category}:`, error)
        }
    }

    return products
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string): Product[] {
    return getAllProducts().filter(product => product.category === category)
}

/**
 * Find the least expensive product in a given category (excluding a specific product).
 */
export function getCheapestInCategory(category: string, excludeSlug?: string): Product | null {
    const products = getProductsByCategory(category)
    const filtered = excludeSlug ? products.filter(p => p.slug !== excludeSlug) : products

    if (filtered.length === 0) return null

    return filtered.reduce((cheapest, current) =>
        current.price < cheapest.price ? current : cheapest
    )
}
