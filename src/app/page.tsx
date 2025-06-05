import Link from "next/link";
import {Metadata} from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
    title: "ModShop | Home",
    description: "Shop smart with ModShop: your personalized e-commerce experience.",
};

export default function HomePage() {
    const categories = [
        {name: "Clothing", slug: "clothing"},
        {name: "Video Games", slug: "video-games"},
        {name: "Books", slug: "books"},
        {name: "Household Items", slug: "household"},
    ];

    return (
        <main className="min-h-screen bg-white text-gray-900">
            <Navbar/>
            <section className="py-12 px-6 text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to ModShop</h1>
                <p className="text-lg mb-8">Your behavior-aware shopping experience.</p>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 max-w-5xl mx-auto">
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/category/${category.slug}`}
                            className="border border-gray-200 rounded-2xl shadow p-6 transition-all duration-200
                            hover:scale-105 hover:border-blue-500 hover:shadow-lg focus:outline-none focus:ring-2
                            focus:ring-blue-400 cursor-pointer hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100"
                        >
                            <h2 className="text-xl font-semibold">{category.name}</h2>
                            <p className="text-sm mt-2 text-gray-600">Explore
                                our {category.name.toLowerCase()} collection</p>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
