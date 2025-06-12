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
    const [menuOpen, setMenuOpen] = useState(false);
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && search.trim()) {
            router.push(`/search?query=${encodeURIComponent(search.trim())}`);
        }
    };

    return (
        <>
            <nav
                className="w-full bg-blue-600 shadow-md px-4 py-3 flex items-center justify-between flex-wrap gap-2 z-0">
                {/* Left: Hamburger + Logo */}
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap min-w-0">
                    {/* Hamburger/X menu (mobile only) */}
                    <button
                        className={`mr-2 p-2 rounded-md focus:outline-none transition-colors duration-200 sm:hidden border-none shadow-none`}
                        onClick={() => setMenuOpen(v => !v)}
                        aria-label={menuOpen ? 'Close menu' : 'Open categories menu'}
                        tabIndex={0}
                        type="button"
                    >
                        {menuOpen ? (
                            <span className="relative w-7 h-7 flex items-center justify-center">
                                <span className="block absolute h-0.5 w-6 bg-white rounded rotate-45"
                                      style={{top: '1.1rem'}}></span>
                                <span className="block absolute h-0.5 w-6 bg-white rounded -rotate-45"
                                      style={{top: '1.1rem'}}></span>
                            </span>
                        ) : (
                            <span className="relative w-7 h-7 flex flex-col items-center justify-center">
                                <span
                                    className="block absolute h-0.5 w-6 bg-white rounded transition-all duration-300 ease-in-out top-2"></span>
                                <span
                                    className="block absolute h-0.5 w-6 bg-white rounded transition-all duration-300 ease-in-out top-3.5"></span>
                                <span
                                    className="block absolute h-0.5 w-6 bg-white rounded transition-all duration-300 ease-in-out top-5"></span>
                            </span>
                        )}
                    </button>
                    <Link
                        href="/"
                        className="text-2xl font-bold text-white cursor-pointer flex items-center gap-1 shrink-0"
                    >
                        <Home className="w-5 h-5 text-white"/>
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
                            className="w-full px-4 py-2 pr-10 border border-white text-blue-700 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-white transition-all"
                            style={{borderRadius: '9999px'}}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none">
                            <Search className="w-5 h-5"/>
                        </span>
                    </div>
                </div>

                {/* Right: Cart and Profile */}
                <div className="flex items-center space-x-4 shrink-0">
                    <Link href="/cart" className="relative cursor-pointer group text-white">
                        <span className="relative flex items-center">
                          <ShoppingCart
                              className="w-6 h-6 transition-all duration-200 group-hover:text-white group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"/>
                          <span
                              className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-80 group-hover:bg-white/20 transition-all duration-200 z-[-1]"/>
                        </span>
                        {cartCount > 0 && (
                            <span
                                className="absolute -top-3 -right-3 bg-white text-blue-600 text-xs rounded-full w-5 h-5 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <Link href="/profile" className="cursor-pointer group text-white">
                        <span className="relative flex items-center">
                          <User
                              className="w-6 h-6 transition-all duration-200 group-hover:text-white group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"/>
                          <span
                              className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-80 group-hover:bg-white/20 transition-all duration-200 z-[-1]"/>
                        </span>
                    </Link>
                </div>
            </nav>

            {/* Hamburger dropdown menu (mobile drop-down from top, navbar stays visible, with slide-in effect) */}
            {menuOpen && (
                <div className="fixed left-0 top-0 w-full z-50 sm:hidden">
                    {/* Keep navbar visible, overlay menu below it */}
                    <div
                        className="absolute left-0 top-[60px] w-full bg-white shadow-2xl flex flex-col py-8 px-6 gap-2 transition-transform duration-300 transform translate-y-0 animate-navbar-slide-down"
                        style={{zIndex: 51}}
                    >
                        <Link href="/category/books"
                              className="px-4 py-3 text-blue-700 font-semibold hover:bg-blue-100 hover:text-blue-900 rounded-lg transition-colors flex items-center gap-2 text-lg"
                              onClick={() => setMenuOpen(false)}>
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"/>Books
                        </Link>
                        <Link href="/category/clothing"
                              className="px-4 py-3 text-blue-700 font-semibold hover:bg-blue-100 hover:text-blue-900 rounded-lg transition-colors flex items-center gap-2 text-lg"
                              onClick={() => setMenuOpen(false)}>
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"/>Clothing
                        </Link>
                        <Link href="/category/household"
                              className="px-4 py-3 text-blue-700 font-semibold hover:bg-blue-100 hover:text-blue-900 rounded-lg transition-colors flex items-center gap-2 text-lg"
                              onClick={() => setMenuOpen(false)}>
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"/>Household
                        </Link>
                        <Link href="/category/video-games"
                              className="px-4 py-3 text-blue-700 font-semibold hover:bg-blue-100 hover:text-blue-900 rounded-lg transition-colors flex items-center gap-2 text-lg"
                              onClick={() => setMenuOpen(false)}>
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"/>Video Games
                        </Link>
                    </div>
                </div>
            )}

            {/* Desktop sub-navbar for categories */}
            <div className="hidden sm:flex w-full bg-white border-b border-blue-200 px-4 py-2 z-10">
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
                        className="w-full px-4 py-2 pr-10 border border-white text-blue-700 bg-white rounded-full my-2 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                        style={{borderRadius: '9999px'}}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none">
                        <Search className="w-5 h-5"/>
                    </span>
                </div>
            </div>
        </>
    );
}
