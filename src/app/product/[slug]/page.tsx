import {readFileSync, readdirSync} from "fs";
import path from "path";
import matter from "gray-matter";
import {MDXRemote} from "next-mdx-remote/rsc";
import ProductDetail from "@/components/ProductDetail";
import {pageParams} from "@/lib/types";

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

export default async function ProductPage(props: { params: pageParams }) {
    const categories = readdirSync(path.join(process.cwd(), "products"));
    for (const category of categories) {
        const {slug} = await props.params;
        const filePath = path.join(process.cwd(), "products", category, `${slug}.mdx`);
        try {
            const file = readFileSync(filePath, "utf-8");
            const {content, data} = matter(file);
            const frontmatter = data as ProductFrontmatter;
            return (
                <ProductDetail
                    frontmatter={frontmatter}
                    mdxContent={
                        <article className="prose prose-blue max-w-none mt-12">
                            <MDXRemote source={content}/>
                        </article>
                    }
                />
            );
        } catch (error) {
            console.error(`Error reading product file: ${filePath}`, error);
        }
    }
    return <div className="p-12 text-center text-red-500">Product not found.</div>;
}
