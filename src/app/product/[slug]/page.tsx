import {readFileSync, readdirSync} from "fs";
import path from "path";
import matter from "gray-matter";
import {MDXRemote} from "next-mdx-remote/rsc";
import Navbar from "@/components/Navbar";

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
    let foundPath = "";

    for (const category of categories) {
        const {slug} = await params;
        const filePath = path.join(process.cwd(), "products", category, `${slug}.mdx`);
        try {
            const file = readFileSync(filePath, "utf-8");
            foundPath = filePath;
            const {content, data} = matter(file);
            const frontmatter = data as ProductFrontmatter;

            return (
                <main className="min-h-screen bg-white text-gray-900">
                    <Navbar/>
                    <section className="py-12 px-6 max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-10">
                            <img
                                src={frontmatter.image}
                                alt={frontmatter.title}
                                className="w-full h-auto rounded"
                            />
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{frontmatter.title}</h1>
                                <p className="text-lg text-gray-600 mb-4">{frontmatter.description}</p>
                                <p className="text-xl font-semibold text-purple-700 mb-6">${frontmatter.price}</p>
                                <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                        <article className="mt-12 prose prose-lg">
                            <MDXRemote source={content}/>
                        </article>
                    </section>
                </main>
            );
        } catch (error) {
            continue;
        }
    }

    return <div className="p-12 text-center text-red-500">Product not found.</div>;
}
