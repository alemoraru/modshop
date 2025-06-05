"use client";

import Navbar from "@/components/Navbar";

/**
 * This renders the About page of the ModShop application.
 */
export default function AboutPage() {
    return (
        <main className="bg-white text-gray-900">
            <Navbar/>
            <section className="max-w-3xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold mb-6">About ModShop</h1>

                <p className="mb-4 text-lg">
                    <strong>ModShop</strong> is a simple e-commerce mock web application built for an educational
                    scenario in a Master&#39;s level course on <em>Designing Human-Centered AI Systems</em>.
                    It is designed not just to allow simulating online purchases, but to study how
                    <strong> algorithmic nudges</strong> can influence user behavior in a shopping context.
                </p>

                <p className="mb-4">
                    The core objective is to <strong>minimize impulsive purchases</strong> by implementing nudges
                    such as:
                </p>

                <ul className="list-disc list-inside mb-4">
                    <li>Alerting users when they&#39;re shopping impulsively</li>
                    <li>Confirmation prompts before purchase completion</li>
                    <li>Purchase lock timers requiring a pause before finalizing orders</li>
                </ul>

                <p className="mb-4">
                    The frontend is developed using <strong>React</strong>, <strong>TypeScript</strong>, and <strong>Tailwind
                    CSS</strong> with
                    <strong> Next.js App Router</strong>. Products are organized into categories such as clothing,
                    video games, books, and household items.
                </p>

                <p className="mb-4">
                    The frontend includes:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>Category browsing and product detail pages (via .mdx files)</li>
                    <li>User profile with sign-up/login and shopping behavior settings</li>
                    <li>Shopping cart and mock checkout functionality</li>
                    <li>Past order history view</li>
                    <li>Intelligent nudging system with multi-armed bandit learning</li>
                </ul>

                <p className="mb-4">
                    Users can identify as one of the following shopper types:
                </p>

                <ul className="list-disc list-inside">
                    <li>Impulsive Shopper</li>
                    <li>Adaptive Shopper</li>
                    <li>Frugal Shopper</li>
                </ul>
            </section>
        </main>
    );
}
