"use client";

import {useAuth} from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import {useEffect, useState} from "react";
import LoginForm from "@/components/LoginForm";
import OrderCard from "@/components/OrderCard";
import {ChevronDown} from "lucide-react";

interface Order {
    id: string;
    userEmail: string;
    items: { title: string; price: number; quantity: number; image: string }[];
    total: number;
    date: string;
}

export default function ProfilePage() {
    const {user, login, logout} = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [sortDescending, setSortDescending] = useState(true);

    useEffect(() => {
        if (user) {
            const stored = localStorage.getItem("modshop_orders");
            if (stored) {
                const allOrders = JSON.parse(stored) as Order[];
                const filteredOrders = allOrders.filter((o) => o.userEmail === user.email);
                const sortedOrders = filteredOrders.sort((a, b) =>
                    sortDescending
                        ? new Date(b.date).getTime() - new Date(a.date).getTime()
                        : new Date(a.date).getTime() - new Date(b.date).getTime()
                );
                setOrders(sortedOrders);
            }
        }
    }, [user, sortDescending]);

    if (!user) {
        return (
            <main className="bg-white text-gray-900">
                <Navbar/>
                <section className="py-12 px-6 max-w-md mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Login</h1>
                    <LoginForm onLoginAction={login}/>
                </section>
            </main>
        );
    }

    return (
        <main className="bg-white text-gray-900">
            <Navbar/>
            <section className="py-12 px-6 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Profile</h1>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                    >
                        Logout
                    </button>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Past Orders</h2>
                    <button
                        onClick={() => setSortDescending((prev) => !prev)}
                        className="flex items-center gap-2 text-sm text-blue-600 border border-blue-200 px-3 py-1
                        rounded-md w-36 justify-center transition-all hover:bg-blue-50 cursor-pointer"
                    >
                        <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${sortDescending ? "rotate-180" : "rotate-0"}`}
                        />
                        {sortDescending ? "Newest First" : "Oldest First"}
                    </button>
                </div>

                {orders.length === 0 ? (
                    <p className="text-gray-500">No past orders found.</p>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order}/>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
