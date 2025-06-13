"use client";

import {useCart} from "@/context/CartContext";
import Link from "next/link";
import {useEffect, useState} from "react";
import Image from "next/image";
import {useAuth} from "@/context/AuthContext";
import NotificationPopUp from "@/components/NotificationPopUp";
import GentleNudge from "@/components/nudges/GentleNudge";
import CheaperAlternativeNudge from "@/components/nudges/CheaperNudge";
import PurchaseBlockNudge from "@/components/nudges/BlockNudge";
import {nudgeService, NudgeResponse, NudgeType} from "@/services/NudgeService";
import {Handshake, Lightbulb, ShieldAlert, History, ShoppingBasket, ShoppingBag} from "lucide-react";

/**
 * This renders the Cart page of the ModShop application.
 * It allows users to view their cart, update quantities, remove items,
 * and proceed to checkout with nudges for better shopping behavior.
 */
export default function CartPage() {
    const {items, removeItem, updateQuantity, clearCart, addItem} = useCart();
    const {user} = useAuth();
    const [checkoutAnimating, setCheckoutAnimating] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationType, setNotificationType] = useState<'success' | 'warning'>("success");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [currentNudge, setCurrentNudge] = useState<NudgeResponse | null>(null);
    const [canProceedWithCheckout, setCanProceedWithCheckout] = useState(false);

    // Read developer mode from localStorage
    const [developerMode, setDeveloperMode] = useState(false);
    useEffect(() => {
        setDeveloperMode(localStorage.getItem('modshop_developer_mode') === 'true');
    }, []);

    // Check moderation enabled state
    const [moderationEnabled, setModerationEnabled] = useState(true);
    useEffect(() => {
        setModerationEnabled(localStorage.getItem('modshop_moderation_enabled') !== 'false');
    }, []);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    /**
     * Effect to reset checkout animation after 1 second.
     */
    useEffect(() => {
        if (checkoutAnimating) {
            const timeout = setTimeout(() => setCheckoutAnimating(false), 1000);
            return () => clearTimeout(timeout);
        }
    }, [checkoutAnimating]);

    /**
     * Effect to reset nudge state when items change.
     * Checks if nudges should be triggered based on user type.
     * On top of this, it also checks if the user is logged in.
     */
    const handleCheckout = async () => {
        if (!user) {
            setNotificationType('warning');
            setNotificationMessage("Please log in to complete your purchase.");
            setShowNotification(true);
            return;
        }

        if (!moderationEnabled) {
            processCheckout();
            return;
        }

        setCheckoutLoading(true);
        if (!canProceedWithCheckout) {
            const nudgeResponse = await nudgeService.triggerNudge(items, total);
            setCheckoutLoading(false);
            if (nudgeResponse.type !== 'none') {
                setCurrentNudge(nudgeResponse);
                return;
            }
        } else {
            setCheckoutLoading(false);
        }
        processCheckout();
    };

    /**
     * Processes the checkout by creating an order object,
     * storing it in localStorage, clearing the cart,
     * and showing a success notification.
     */
    const processCheckout = () => {
        setCheckoutAnimating(true);
        setCheckoutLoading(true);

        const order = {
            id: Date.now().toString(),
            items: items.map(({slug, title, price, quantity, image}) => ({slug, title, price, quantity, image})),
            total,
            date: new Date().toISOString(),
            userEmail: user?.email || '',
        };

        const stored = localStorage.getItem("modshop_orders");
        const orders = stored ? JSON.parse(stored) : [];
        orders.push(order);
        localStorage.setItem("modshop_orders", JSON.stringify(orders));

        setTimeout(() => {
            clearCart();
            setNotificationType('success');
            setNotificationMessage("🎉 Thank you! Your order has been placed.");
            setShowNotification(true);
            setCheckoutAnimating(false);
            setCheckoutLoading(false);
            setCanProceedWithCheckout(false);
            setCurrentNudge(null);
        }, 900);
    };

    const handleNudgeAccept = (nudgeType: string) => {
        nudgeService.recordNudgeInteraction(nudgeType as NudgeType, true);

        if (nudgeType === 'alternative' && currentNudge?.data) {
            const originalItem = items[0];
            const alternativeData = currentNudge.data;

            if (alternativeData.isAlreadyCheapest) {
                if (originalItem) {
                    const savedAmount = originalItem.price * originalItem.quantity;
                    removeItem(originalItem.slug);
                    setNotificationType('success');
                    setNotificationMessage(`💰 Great thinking! You saved €${savedAmount.toFixed(2)} by removing "${originalItem.title}" from your cart.`);
                    setShowNotification(true);
                }
                setCurrentNudge(null);
                return;
            }

            if (originalItem && alternativeData.alternativeProduct && alternativeData.alternativePrice) {
                removeItem(originalItem.slug);

                addItem({
                    slug: alternativeData.alternativeSlug || `alternative-${Date.now()}`,
                    title: alternativeData.alternativeProduct,
                    price: alternativeData.alternativePrice,
                    quantity: originalItem.quantity,
                    image: alternativeData.alternativeImage || '/images/products/placeholder.jpg',
                    category: alternativeData.alternativeCategory || originalItem.category || 'general'
                });

                setNotificationType('success');
                setNotificationMessage(`Switched to ${alternativeData.alternativeProduct}! You saved €${(alternativeData.currentPrice! - alternativeData.alternativePrice).toFixed(2)}.`);
                setShowNotification(true);

                setCurrentNudge(null);
                return;
            }
        }
        setCurrentNudge(null);
    };

    const handleNudgeReject = (nudgeType: string) => {
        nudgeService.recordNudgeInteraction(nudgeType as NudgeType, false);
        setCurrentNudge(null);

        if (nudgeType === 'gentle' || nudgeType === 'block') {
            setCanProceedWithCheckout(true);
            processCheckout();
        }
    };

    const handleBlockComplete = () => {
        nudgeService.recordNudgeInteraction('block', true);
        setCurrentNudge(null);
        setCanProceedWithCheckout(true);
    };

    const triggerGentleNudge = () => {
        setCurrentNudge({
            type: 'gentle',
            data: {
                productTitle: items[0]?.title || 'this item'
            }
        });
    };

    const triggerAlternativeNudge = async () => {
        if (items.length > 0) {
            const alternative = await nudgeService.getCheaperAlternative(items[0]);
            setCurrentNudge({
                type: 'alternative',
                data: {
                    currentProduct: items[0].title,
                    currentPrice: items[0].price,
                    alternativeProduct: alternative.name,
                    alternativePrice: alternative.price,
                    alternativeSlug: alternative.slug,
                    alternativeImage: alternative.image,
                    alternativeCategory: alternative.category,
                    isAlreadyCheapest: alternative.isAlreadyCheapest
                }
            });
        }
    };

    /**
     * Forcefully triggers the block nudge based on the total price of the cart.
     */
    const triggerBlockNudge = () => {
        const nudge = nudgeService.getBlockNudge(total);
        setCurrentNudge(nudge);
    };

    return (
        <main className="bg-white text-gray-900">
            <section className="p-6 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center gap-6 py-12">
                        <p className="text-lg">Your cart is currently empty.</p>
                        <div className="flex gap-4">
                            <Link
                                href="/"
                                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
                            >
                                <ShoppingBasket className="inline-block mr-2"/> Start Shopping
                            </Link>
                            <Link
                                href="/profile"
                                className="bg-gray-200 text-gray-800 px-5 py-2 rounded hover:bg-gray-300 transition"
                            >
                                <History className="inline-block mr-2"/> View Previous Orders
                            </Link>
                        </div>
                    </div>) : (<div className="space-y-6">
                        {items.map((item) => (
                            <div
                                key={item.slug}
                                className="flex items-center gap-4 border-b pb-4 rounded group"
                            >
                                <Link
                                    href={`/product/${item.slug}`}
                                    className="shrink-0 group/image rounded transition-colors hover:bg-blue-50 cursor-pointer flex flex-col items-center justify-center"
                                    prefetch={false}
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={96}
                                        height={96}
                                        className="w-24 h-24 object-cover rounded group-hover/image:scale-105 transition-transform"
                                    />
                                </Link>
                                <div className="flex-1">
                                    <Link
                                        href={`/product/${item.slug}`}
                                        className="font-semibold text-lg group-hover/image:text-blue-700 transition-colors hover:underline cursor-pointer"
                                        prefetch={false}
                                    >
                                        {item.title}
                                    </Link>
                                    <p className="text-gray-600">€{item.price}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <label htmlFor="qty">Qty:</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onClick={e => e.stopPropagation()}
                                            onChange={(e) => updateQuantity(item.slug, parseInt(e.target.value))}
                                            className="w-16 border rounded px-2 py-1"
                                        />
                                        <button
                                            className="text-sm text-red-500 hover:underline ml-4 cursor-pointer"
                                            onClick={e => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                removeItem(item.slug);
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>))}

                        <div className="mt-8 space-y-4">
                            <div
                                className="text-xl font-bold text-gray-800 flex justify-between items-center flex-wrap gap-4">
                                <span>Total: €{total.toFixed(2)}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {developerMode && <>
                                    <button
                                        onClick={user ? triggerGentleNudge : () => {
                                            setNotificationType('warning');
                                            setNotificationMessage('Please log in to use nudges or continue with purchases.');
                                            setShowNotification(true);
                                        }}
                                        disabled={items.length === 0}
                                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 transition-all cursor-pointer"
                                    >
                                        <Lightbulb className="w-4 h-4"/>
                                        Gentle Nudge
                                    </button>

                                    <button
                                        onClick={user ? triggerAlternativeNudge : () => {
                                            setNotificationType('warning');
                                            setNotificationMessage('Please log in to use nudges or continue with purchases.');
                                            setShowNotification(true);
                                        }}
                                        disabled={items.length === 0}
                                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-green-500
                                    text-white rounded hover:bg-green-600 disabled:opacity-50 transition-all cursor-pointer"
                                    >
                                        <Handshake className="w-4 h-4"/>
                                        Alternative Nudge
                                    </button>

                                    <button
                                        onClick={user ? triggerBlockNudge : () => {
                                            setNotificationType('warning');
                                            setNotificationMessage('Please log in to use nudges or continue with purchases.');
                                            setShowNotification(true);
                                        }}
                                        disabled={items.length === 0}
                                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-red-500
                                    text-white rounded hover:bg-red-600 disabled:opacity-50 transition-all cursor-pointer"
                                    >
                                        <ShieldAlert className="w-4 h-4"/>
                                        Block Nudge
                                    </button>
                                </>}

                                <button
                                    onClick={handleCheckout}
                                    disabled={checkoutAnimating || checkoutLoading}
                                    className={`flex items-center justify-center gap-2 px-4 py-2 text-sm rounded 
                                    transition-all duration-300 cursor-pointer ${
                                        checkoutAnimating || checkoutLoading
                                            ? "bg-green-500 text-white scale-105"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                                >
                                    {checkoutLoading ? (
                                        <svg className="animate-spin h-5 w-5 mr-2 text-white"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8v8z"></path>
                                        </svg>
                                    ) : (
                                        <ShoppingBag className="w-4 h-4"/>
                                    )}
                                    {checkoutLoading ? "Processing..." : checkoutAnimating ? "Processing..." : "Buy Now"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {currentNudge?.type === 'gentle' && (
                <GentleNudge
                    productTitle={currentNudge.data?.productTitle || 'this item'}
                    onAcceptAction={() => handleNudgeAccept('gentle')}
                    onRejectAction={() => handleNudgeReject('gentle')}
                />
            )}

            {currentNudge?.type === 'alternative' && (
                <CheaperAlternativeNudge
                    currentProduct={currentNudge.data?.currentProduct || 'Current item'}
                    currentPrice={currentNudge.data?.currentPrice || 0}
                    alternativeProduct={currentNudge.data?.alternativeProduct || 'Basic Alternative'}
                    alternativePrice={currentNudge.data?.alternativePrice || 0}
                    isAlreadyCheapest={currentNudge.data?.isAlreadyCheapest || false}
                    onAcceptAction={() => handleNudgeAccept('alternative')}
                    onRejectAction={() => handleNudgeReject('alternative')}
                />
            )}

            {currentNudge?.type === 'block' && (
                <PurchaseBlockNudge
                    duration={currentNudge.data?.duration || 60}
                    onCompleteAction={handleBlockComplete}
                />)}

            <NotificationPopUp
                open={showNotification}
                message={notificationMessage}
                type={notificationType}
                onCloseAction={() => setShowNotification(false)}
            />
        </main>
    );
}
