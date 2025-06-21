"use client";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";

interface OrderCardProps {
    order: {
        id: string;
        items: { title: string; price: number; quantity: number; image: string; slug?: string }[];
        total: number;
        date: string;
    };
}

/**
 * OrderCard component displays a summary of an order including its ID, items, and total price.
 * @param order - The order object containing details like ID, items, total price, and date.
 */
export default function OrderCard({order}: OrderCardProps) {
    const router = useRouter();
    return (
        <div className="flex flex-col md:flex-row items-stretch border rounded-xl shadow-sm bg-white overflow-hidden">
            {/* Left: Price and View Order button */}
            <div
                className="flex flex-row md:flex-col items-center md:items-start bg-blue-50 px-4 py-4 md:w-36 gap-4 md:gap-2 border-b md:border-b-0 md:border-r border-blue-100"
            >
                <div className="text-xl font-bold text-blue-700">€{order.total.toFixed(2)}</div>
                <button
                    onClick={() => router.push(`/orders/${order.id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700z transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-semibold cursor-pointer"
                >
                    View Order
                </button>
            </div>
            {/* Right: Order details */}
            <div className="flex-1 p-4 flex flex-col gap-2">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-1">
                    <span className="font-semibold text-base">Order #{order.id}</span>
                    <span className="text-xs text-gray-500">{new Date(order.date).toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <Link href={`/product/${item.slug || ''}`} className="group flex items-center gap-3">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 object-cover rounded group-hover:scale-105 transition-transform"
                                />
                                <div className="flex-1">
                                    <div
                                        className="font-medium group-hover:underline group-hover:text-blue-700 transition-colors text-base">
                                        {item.title}
                                    </div>
                                    <div className="text-sm text-gray-600">€{item.price} x {item.quantity}</div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
