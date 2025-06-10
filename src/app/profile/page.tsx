"use client";

import {useAuth} from "@/context/AuthContext";
import {useEffect, useState} from "react";
import LoginForm from "@/components/LoginForm";
import OrderCard from "@/components/OrderCard";
import NotificationPopUp from "@/components/NotificationPopUp";
import {ChevronDown, DownloadIcon, LogOut} from "lucide-react";

interface Order {
    id: string;
    userEmail: string;
    items: {
        title: string;
        price: number;
        quantity: number;
        image: string
    }[];
    total: number;
    date: string;
}

type ShopperType = 'frugal' | 'adaptive' | 'impulsive' | null;

/**
 * This component renders the user profile page, allowing users to view their past orders,
 * select their shopping behavior profile, and manage their account (i.e., logging out).
 */
export default function ProfilePage() {
    const {user, login, logout} = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [sortDescending, setSortDescending] = useState(true);
    const [shopperType, setShopperType] = useState<ShopperType>(null);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationType, setNotificationType] = useState<'success' | 'warning'>("success");
    const [notificationMessage, setNotificationMessage] = useState("");

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

            const storedShopperType = localStorage.getItem(`modshop_shopper_type_${user.email}`);
            if (storedShopperType) {
                setShopperType(storedShopperType as ShopperType);
            }
        }
    }, [user, sortDescending]);

    const handleShopperTypeSelection = (type: ShopperType) => {
        if (user && type) {
            setShopperType(type);
            localStorage.setItem(`modshop_shopper_type_${user.email}`, type);
        }
    };

    const getShopperTypeDescription = (type: ShopperType) => {
        switch (type) {
            case 'frugal':
                return "You prefer to save money and make careful purchasing decisions.";
            case 'adaptive':
                return "You balance between saving and spending based on the situation.";
            case 'impulsive':
                return "You enjoy spontaneous purchases and trying new products.";
            default:
                return null;
        }
    };

    const handleDownload = () => {
        const statsRaw = localStorage.getItem("modshop_nudge_stats");
        const savingsRaw = localStorage.getItem("modshop_nudge_savings"); // optional savings per type

        // Check if stats and user are available
        // If not, show a warning notification
        if (!statsRaw || !user) {
            setNotificationType('warning');
            setNotificationMessage("No stats found or user not logged in.");
            setShowNotification(true);
            console.warn("No stats found or user not logged in.");
            return;
        }

        const stats = JSON.parse(statsRaw);
        const savings = savingsRaw ? JSON.parse(savingsRaw) : {
            gentle: 0,
            alternative: 0,
            block: 0
        };

        const rows = [
            ["User", "NudgeType", "Shown", "Accepted", "Savings"],
            [user.email, "gentle", stats.gentle.shown || 0, stats.gentle.accepted || 0, savings.gentle || 0],
            [user.email, "alternative", stats.alternative.shown || 0, stats.alternative.accepted || 0, savings.alternative || 0],
            [user.email, "block", stats.block.shown || 0, stats.block.accepted || 0, savings.block || 0]
        ];

        const csvContent = rows.map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `nudge_stats_${user.email}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    if (!user) {
        return (
            <main className="bg-white text-gray-900">
                <section className="py-12 px-6 max-w-md mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Login</h1>
                    <LoginForm onLoginAction={login}/>
                </section>
            </main>
        );
    }

    return (
        <main className="bg-white text-gray-900">
            <section className="py-12 px-6 max-w-2xl mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Profile</h1>
                        <p className="text-gray-600">{user.email}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 rounded-md border border-blue-600
                            text-blue-700 bg-white hover:bg-blue-50 transition-colors font-medium text-base
                            shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                        >
                            <DownloadIcon className="w-5 h-5"/>
                            <span>Download Stats</span>
                        </button>

                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 rounded-md border border-red-600
                            text-red-700 bg-white hover:bg-red-50 transition-colors font-medium
                            text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
                        >
                            <LogOut className="w-5 h-5"/>
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <h2 className="text-xl font-semibold mb-4">Shopping Behavior Profile</h2>
                    <p className="text-gray-600 mb-4">
                        Help us personalize your experience by selecting your shopping style:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <button
                            onClick={() => handleShopperTypeSelection('frugal')}
                            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                shopperType === 'frugal'
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                            }`}
                        >
                            <div className="text-2xl mb-2">💰</div>
                            <h3 className="font-semibold">Frugal Shopper</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Budget-conscious and careful with purchases
                            </p>
                        </button>

                        <button
                            onClick={() => handleShopperTypeSelection('adaptive')}
                            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                shopperType === 'adaptive'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                            }`}
                        >
                            <div className="text-2xl mb-2">⚖️</div>
                            <h3 className="font-semibold">Adaptive Shopper</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Flexible spending based on needs and situation
                            </p>
                        </button>

                        <button
                            onClick={() => handleShopperTypeSelection('impulsive')}
                            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                shopperType === 'impulsive'
                                    ? 'border-red-500 bg-red-50 text-red-700'
                                    : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50'
                            }`}
                        >
                            <div className="text-2xl mb-2">⚡</div>
                            <h3 className="font-semibold">Impulsive Shopper</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Enjoys spontaneous purchases and new products
                            </p>
                        </button>
                    </div>

                    {shopperType && (
                        <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                            <p className="text-sm text-gray-700">
                                <strong>Your Profile:</strong> {getShopperTypeDescription(shopperType)}
                            </p>
                        </div>
                    )}
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

            <NotificationPopUp
                open={showNotification}
                message={notificationMessage}
                type={notificationType}
                onCloseAction={() => setShowNotification(false)}
            />
        </main>
    );
}
