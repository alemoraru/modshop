"use client";

import Link from "next/link";
import {ShoppingCart, User, Home, Search} from "lucide-react";
import {useCart} from "@/context/CartContext";
import {useRouter} from "next/navigation";
import React, {useState} from "react";

/**
 * Navbar component that displays the site logo, a shopping cart icon with item count,
 * and a user profile icon. It uses the CartContext to get the current cart state.
 */
export default function Navbar() {
    const cart = useCart();
    const items = cart?.items ?? [];
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const router = useRouter();
    const [search, setSearch] = useState("");
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && search.trim()) {
            router.push(`/search?query=${encodeURIComponent(search.trim())}`);
        }
    };

    return (
        <>
            <nav className="w-full bg-white shadow-md px-4 py-3 flex items-center justify-between flex-wrap gap-2 z-0">
                {/* Left: Logo + breadcrumbs on desktop */}
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap min-w-0">
                    <Link
                        href="/"
                        className="text-2xl font-bold text-blue-600 cursor-pointer flex items-center gap-1 shrink-0"
                    >
                        <Home className="w-5 h-5"/>
                        ModShop
                    </Link>
                </div>

                {/* Center: Search bar (hidden on mobile) */}
                <div className="flex-1 justify-center px-2 hidden sm:flex">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Search products..."
                            className="w-full px-4 py-2 pr-10 border text-gray-600 border-gray-500 rounded-full
                            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                            style={{borderRadius: '9999px'}}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
                            <Search className="w-5 h-5"/>
                        </span>
                    </div>
                </div>

                {/* Right: Cart and Profile */}
                <div className="flex items-center space-x-4 shrink-0">
                    <Link href="/cart" className="relative cursor-pointer group text-black">
                        <ShoppingCart
                            className="w-6 h-6 transition-transform duration-200 group-hover:scale-110 group-hover:text-blue-600"/>
                        {cartCount > 0 && (
                            <span
                                className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <Link href="/profile" className="cursor-pointer group text-black">
                        <User
                            className="w-6 h-6 transition-transform duration-200 group-hover:scale-110 group-hover:text-blue-600"/>
                    </Link>
                </div>
            </nav>

            {/* Desktop sub-navbar for categories */}
            <div className="hidden sm:flex w-full bg-blue-50 border-b border-blue-200 px-4 py-2 z-10">
                <div className="flex gap-6 mx-auto">
                    <Link href="/category/books"
                          className="text-blue-700 font-medium transition-colors duration-200 hover:text-white
                          hover:bg-blue-600 px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Books
                    </Link>
                    <Link href="/category/clothing"
                          className="text-blue-700 font-medium transition-colors duration-200 hover:text-white
                          hover:bg-blue-600 px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Clothing
                    </Link>
                    <Link href="/category/household"
                          className="text-blue-700 font-medium transition-colors duration-200 hover:text-white
                          hover:bg-blue-600 px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Household
                    </Link>
                    <Link href="/category/video-games"
                          className="text-blue-700 font-medium transition-colors duration-200 hover:text-white
                          hover:bg-blue-600 px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Video Games
                    </Link>
                </div>
            </div>

            {/* Mobile search sub-navbar */}
            <div className="sm:hidden w-full bg-blue-600 shadow px-4 py-2 flex items-center z-10">
                <div className="relative w-full">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        placeholder="Search products..."
                        className="w-full px-4 py-2 pr-10 border text-gray-600 border-gray-500 rounded-full my-2
                        focus:outline-none focus:ring-2 focus:ring-white-500 transition-all bg-white"
                        style={{borderRadius: '9999px'}}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
                        <Search className="w-5 h-5"/>
                    </span>
                </div>
            </div>
        </>
    );
}
