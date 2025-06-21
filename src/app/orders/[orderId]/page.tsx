"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import {notFound, useParams} from "next/navigation";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";

interface OrderItem {
    title: string;
    price: number;
    quantity: number;
    image: string;
    slug?: string;
}

interface Order {
    id: string;
    userEmail: string;
    items: OrderItem[];
    total: number;
    date: string;
}

/**
 * OrderDetailPage component displays the details of a specific order.
 */
export default function OrderDetailPage() {
    const params = useParams();
    const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = localStorage.getItem("modshop_orders");
        if (!stored) {
            setOrder(null);
            setLoading(false);
            return;
        }
        const allOrders = JSON.parse(stored) as Order[];
        const found = allOrders.find((o) => o.id === orderId) || null;
        setOrder(found);
        setLoading(false);
    }, [orderId]);

    if (loading) return <div className="text-center py-10">Loading order...</div>;
    if (!order) return notFound();

    return (
        <main className="bg-white py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h1 className="text-3xl font-bold text-blue-900">Order #{order.id}</h1>
                    <span className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleString()}</span>
                </div>
                <div className="bg-gray-50 rounded-2xl shadow p-6 mb-10">
                    <h2 className="text-xl font-semibold mb-6 text-gray-900">Items in this Order</h2>
                    <ul className="divide-y divide-gray-200">
                        {order.items.map((item, idx) => (
                            <li key={idx} className="flex flex-col sm:flex-row items-center gap-4 py-5">
                                <Link href={`/product/${item.slug || ''}`}
                                      className="shrink-0 group rounded-lg border border-gray-200 bg-white p-2 hover:shadow-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400">
                                    <Image src={item.image} alt={item.title} width={80} height={80}
                                           className="w-20 h-20 object-cover rounded"/>
                                </Link>
                                <div className="flex-1 w-full min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className="font-semibold text-lg text-gray-900 truncate">{item.title}</div>
                                        <div className="text-base text-blue-700 font-bold">€{item.price}</div>
                                    </div>
                                    <div className="flex flex-row items-center gap-4 mt-1">
                                        <span className="text-sm text-gray-600">Quantity: <span
                                            className="font-medium text-gray-900">{item.quantity}</span></span>
                                        {item.slug && (
                                            <Link href={`/product/${item.slug}`}
                                                  className="text-xs text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1 py-0.5">View
                                                Product</Link>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="text-lg font-semibold text-gray-900">Order Total</span>
                        <span className="text-2xl font-extrabold text-blue-700">€{order.total.toFixed(2)}</span>
                    </div>
                </div>
                <div className="flex justify-center">
                    <Link href="/profile"
                          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full
                          font-semibold shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <ArrowLeft className="w-5 h-5"/>
                        Back to Orders
                    </Link>
                </div>
            </div>
        </main>
    );
}
