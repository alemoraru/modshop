"use client";
import {useAuth} from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import {useEffect, useState} from "react";

interface Order {
    id: string;
    items: { title: string; price: number; quantity: number; image: string }[];
    total: number;
    date: string;
}

export default function ProfilePage() {
    const {user, login, logout} = useAuth();
    const [emailInput, setEmailInput] = useState("");
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
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            if (emailInput) login(emailInput);
                        }}
                        className="space-y-4"
                    >
                        <input
                            type="email"
                            placeholder="Email"
                            value={emailInput}
                            onChange={e => setEmailInput(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                        <button type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded w-full hover:bg-blue-700">
                            Login
                        </button>
                    </form>
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
                    <button onClick={logout}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Logout
                    </button>
                </div>
                <h2 className="text-2xl font-semibold mb-4">Past Orders</h2>
                {orders.length === 0 ? (
                    <p className="text-gray-500">No past orders found.</p>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="border rounded p-4">
                                <div className="flex justify-between mb-2">
                                    <span className="font-semibold">Order #{order.id}</span>
                                    <span
                                        className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</span>
                                </div>
                                <div className="space-y-2">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <img src={item.image} alt={item.title}
                                                 className="w-12 h-12 object-cover rounded"/>
                                            <div className="flex-1">
                                                <div className="font-medium">{item.title}</div>
                                                <div
                                                    className="text-sm text-gray-600">${item.price} x {item.quantity}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-2 text-right font-bold">Total: ${order.total.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

