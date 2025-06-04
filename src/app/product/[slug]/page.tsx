import {readFileSync, readdirSync} from "fs";
import path from "path";
import matter from "gray-matter";
import {MDXRemote} from "next-mdx-remote/rsc";
import ProductDetail from "@/components/ProductDetail";

interface ProductFrontmatter {
    title: string;
    slug: string;
    category: string;
    price: number;
    image: string;
    description: string;
}

export async function generateStaticParams() {
    const categories = readdirSync(path.join(process.cwd(), "products"));
    const slugs = categories.flatMap((category) => {
        const dirPath = path.join(process.cwd(), "products", category);
        return readdirSync(dirPath).map((file) => {
            const slug = file.replace(/\.mdx$/, "");
            return {slug};
        });
    });
    return slugs;
}

export default async function ProductPage({params}: { params: { slug: string } }) {
    const categories = readdirSync(path.join(process.cwd(), "products"));
    for (const category of categories) {
        const {slug} = await params;
        const filePath = path.join(process.cwd(), "products", category, `${slug}.mdx`);
        try {
            const file = readFileSync(filePath, "utf-8");
            const {content, data} = matter(file);
            const frontmatter = data as ProductFrontmatter;
            const mdxContent = <MDXRemote source={content}/>;
            return <ProductDetail frontmatter={frontmatter} mdxContent={mdxContent}/>;
        } catch (error) {
            console.error(`Error reading product file: ${filePath}`, error);
        }
    }
    return <div className="p-12 text-center text-red-500">Product not found.</div>;
}

