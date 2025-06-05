"use client";

import Link from "next/link";
import {ShoppingCart, User} from "lucide-react";
import {useCart} from "@/context/CartContext";

/**
 * Navbar component that displays the site logo, a shopping cart icon with item count,
 * and a user profile icon. It uses the CartContext to get the current cart state.
 */
export default function Navbar() {
    const cart = useCart();
    const items = cart?.items ?? [];
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav className="w-full bg-white shadow-md px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600 cursor-pointer">
                ModShop
            </Link>

            <div className="flex items-center space-x-4">
                <Link href="/cart" className="relative cursor-pointer group">
                    <ShoppingCart
                        className="w-6 h-6 transition-transform duration-200 group-hover:scale-110 group-hover:text-blue-600"
                    />
                    {cartCount > 0 && (
                        <span
                            className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs rounded-full w-5 h-5
                            flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                        >
                            {cartCount}
                        </span>
                    )}
                </Link>
                <Link href="/profile" className="cursor-pointer group">
                    <User
                        className="w-6 h-6 transition-transform duration-200 group-hover:scale-110 group-hover:text-blue-600"
                    />
                </Link>
            </div>
        </nav>
    );
}
