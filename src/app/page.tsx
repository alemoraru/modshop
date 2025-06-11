import Link from "next/link";
import {Metadata} from "next";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
    title: "ModShop | Home",
    description: "Shop smart with ModShop: your personalized e-commerce experience.",
};

/**
 * HomePage component that serves as the landing page for the ModShop application.
 */
export default function HomePage() {
    const categories = [
        {name: "Clothing", slug: "clothing"},
        {name: "Video Games", slug: "video-games"},
        {name: "Books", slug: "books"},
        {name: "Household Items", slug: "household"},
    ];

    // Example featured products (static for now for demonstration purposes)
    const featuredProducts = [
        {
            slug: "classic-white-sneakers",
            title: "Classic White Sneakers",
            price: 44.99,
            image: "/images/products/classic-white-sneakers.png",
            category: "Clothing"
        },
        {
            slug: "atomic-habits",
            title: "Atomic Habits",
            price: 21.50,
            image: "/images/products/atomic-habits.jpg",
            category: "Books"
        },
        {
            slug: "modern-kitchen-chair",
            title: "Modern Kitchen Chair",
            price: 54.99,
            image: "/images/products/modern-kitchen-chair.jpg",
            category: "Household"
        },
        {
            slug: "super-mario-odyssey",
            title: "Super Mario Odyssey",
            price: 59.99,
            image: "/images/products/super-mario-odyssey.jpg",
            category: "Video Games"
        },
    ];

    return (
        <main className="bg-white text-gray-900">

            {/* Hero Banner */}
            <section
                className="relative bg-gradient-to-br from-blue-100 to-blue-300 py-10 px-6 text-center mb-12 overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-5xl font-extrabold mb-4 text-blue-900 drop-shadow">Welcome to ModShop</h1>
                    <p className="text-xl mb-8 text-blue-800">Your behavior-aware shopping experience. Discover products
                        tailored for you!</p>
                    <Link href="/about"
                          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-lg
                          font-semibold shadow hover:bg-blue-700 transition"
                    >
                        Learn More
                    </Link>
                </div>
            </section>

            {/* Categories */}
            <section className="pt-0 pb-8 px-6 text-center">
                <h2 className="text-3xl font-bold mb-6">Shop by Category</h2>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 max-w-5xl mx-auto">
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/category/${category.slug}`}
                            className="border border-gray-500 rounded-2xl shadow p-6 transition-all duration-200
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

            {/* Featured Products */}
            <section className="py-12 px-6 bg-gray-100">
                <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 max-w-6xl mx-auto">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.slug} {...product} />
                    ))}
                </div>
            </section>
        </main>
    );
}
