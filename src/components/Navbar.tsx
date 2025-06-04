"use client";

import Link from "next/link";
import {ShoppingCart, User} from "lucide-react";
import {useCart} from "@/context/CartContext";

export default function Navbar() {
    const {items} = useCart ? useCart() : {items: []};
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav className="w-full bg-white shadow-md px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
                ModShop
            </Link>

            <div className="flex items-center space-x-4">
                <Link href="/cart" className="relative">
                    <ShoppingCart className="w-6 h-6"/>
                    {cartCount > 0 && (
                        <span
                            className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                            {cartCount}
                        </span>
                    )}
                </Link>
                <Link href="/profile">
                    <User className="w-6 h-6"/>
                </Link>
            </div>
        </nav>
    );
}
