import Link from "next/link";
import {ShoppingCart, User} from "lucide-react";

export default function Navbar() {
    return (
        <nav className="w-full bg-white shadow-md px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
                ModShop
            </Link>

            <div className="flex items-center space-x-4">
                <Link href="/cart" className="relative">
                    <ShoppingCart className="w-6 h-6"/>
                    {/* Cart badge will go here */}
                </Link>
                <Link href="/profile">
                    <User className="w-6 h-6"/>
                </Link>
            </div>
        </nav>
    );
}
