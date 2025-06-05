"use client";
import Image from "next/image";

interface OrderCardProps {
    order: {
        id: string;
        items: { title: string; price: number; quantity: number; image: string }[];
        total: number;
        date: string;
    };
}

export default function OrderCard({order}: OrderCardProps) {
    return (
        <div className="border rounded p-4">
            <div className="flex justify-between mb-2">
                <span className="font-semibold">Order #{order.id}</span>
                <span className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</span>
            </div>
            <div className="space-y-2">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                        <Image
                            src={item.image}
                            alt={item.title}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-gray-600">${item.price} x {item.quantity}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-2 text-right font-bold">Total: €{order.total.toFixed(2)}</div>
        </div>
    );
}

