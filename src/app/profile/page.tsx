"use client";
import {useAuth} from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import {useEffect, useState} from "react";
import LoginForm from "@/components/LoginForm";
import OrderCard from "@/components/OrderCard";

interface Order {
    id: string;
    items: { title: string; price: number; quantity: number; image: string }[];
    total: number;
    date: string;
}

export default function ProfilePage() {
    const {user, login, logout} = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (user) {
            const stored = localStorage.getItem("modshop_orders");
            if (stored) {
                const allOrders = JSON.parse(stored) as Order[];
                setOrders(allOrders.filter(o => o.userEmail === user.email));
            }
        }
    }, [user]);

    if (!user) {
        return (
            <main className="min-h-screen bg-white text-gray-900">
                <Navbar/>
                <section className="py-12 px-6 max-w-md mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Login</h1>
                    <LoginForm onLoginAction={login}/>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white text-gray-900">
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
                <h2 className="text-2xl font-semibold mb-4">Past Orders</h2>
                {orders.length === 0 ? (
                    <p className="text-gray-500">No past orders found.</p>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <OrderCard key={order.id} order={order}/>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
