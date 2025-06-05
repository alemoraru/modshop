"use client";

import Navbar from "@/components/Navbar";
import {useCart} from "@/context/CartContext";
import Link from "next/link";
import {useEffect, useState} from "react";
import Image from "next/image";
import {useAuth} from "@/context/AuthContext";
import NotificationPopUp from "@/components/NotificationPopUp";

export default function CartPage() {
    const {items, removeItem, updateQuantity, clearCart} = useCart();
    const {user} = useAuth();
    const [checkoutAnimating, setCheckoutAnimating] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    useEffect(() => {
        if (checkoutAnimating) {
            const timeout = setTimeout(() => setCheckoutAnimating(false), 1000);
            return () => clearTimeout(timeout);
        }
    }, [checkoutAnimating]);

    const handleCheckout = () => {
        if (!user) {
            alert("Please log in to complete your purchase.");
            return;
        }
        setCheckoutAnimating(true);

        const order = {
            id: Date.now().toString(),
            items,
            total,
            date: new Date().toISOString(),
            userEmail: user.email,
        };

        const stored = localStorage.getItem("modshop_orders");
        const orders = stored ? JSON.parse(stored) : [];
        orders.push(order);
        localStorage.setItem("modshop_orders", JSON.stringify(orders));

        clearCart();
        setShowNotification(true);
        setCheckoutAnimating(false);
    };

    return (
        <main className="bg-white text-gray-900">
            <Navbar/>
            <section className="p-6 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

                {items.length === 0 ? (
                    <p>
                        Your cart is empty. <Link href="/" className="text-blue-600">Start shopping!</Link>
                    </p>
                ) : (
                    <div className="space-y-6">
                        {items.map((item) => (
                            <div
                                key={item.slug}
                                className="flex items-center gap-4 border-b pb-4"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={96}
                                    height={96}
                                    className="w-24 h-24 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h2 className="font-semibold text-lg">{item.title}</h2>
                                    <p className="text-gray-600">€{item.price}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <label htmlFor="qty">Qty:</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.slug, parseInt(e.target.value))}
                                            className="w-16 border rounded px-2 py-1"
                                        />
                                        <button
                                            className="text-sm text-red-500 hover:underline ml-4 cursor-pointer"
                                            onClick={() => removeItem(item.slug)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-between items-center mt-8">
                            <p className="text-xl font-bold">Total: €{total.toFixed(2)}</p>
                            <button
                                className={`bg-blue-600 text-white px-6 py-2 rounded transition-all duration-300 hover:bg-blue-700 cursor-pointer ${checkoutAnimating ? "scale-110 bg-green-500" : ""}`}
                                onClick={handleCheckout}
                                disabled={checkoutAnimating}
                            >
                                {checkoutAnimating ? "Processing..." : "Buy Now"}
                            </button>
                        </div>
                    </div>
                )}
            </section>

            <NotificationPopUp
                open={showNotification}
                message="🎉 Thank you! Your order has been placed."
                onCloseAction={() => setShowNotification(false)}
            />
        </main>
    );
}
