import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface ProductMeta {
    title: string
    slug: string
    category: string
    price: number
    image: string
    description: string
}

const PRODUCTS_DIR = path.join(process.cwd(), "products")

function getAllProductFiles(dir: string): string[] {
    let results: string[] = []
    const list = fs.readdirSync(dir)
    list.forEach(file => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllProductFiles(filePath))
        } else if (file.endsWith(".mdx")) {
            results.push(filePath)
        }
    })
    return results
}

export function getAllProducts(): ProductMeta[] {
    const files = getAllProductFiles(PRODUCTS_DIR)
    return files.map(filePath => {
        const fileContents = fs.readFileSync(filePath, "utf8")
        const { data } = matter(fileContents)
        return {
            title: data.title || "",
            slug: data.slug || path.basename(filePath, ".mdx"),
            category: data.category || "",
            price: data.price || 0,
            image: data.image || "",
            description: data.description || "",
        }
    })
}
