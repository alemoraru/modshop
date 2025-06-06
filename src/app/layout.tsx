import type {Metadata} from "next";
import {Gabarito} from "next/font/google";
import "./globals.css";
import React from "react";
import {CartProvider} from "@/context/CartContext";
import {AuthProvider} from "@/context/AuthContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const gabarito = Gabarito({
    variable: "--font-gabarito",
    subsets: ["latin"],
    weight: ["400", "700"],
});

export const metadata: Metadata = {
    title: "ModShop",
    description: "Shop smart with ModShop: your personalized e-commerce experience.",
    icons: {
        icon: '/modshop-icon.png',
        shortcut: '/modshop-icon.png',
        apple: '/modshop-icon.png'
    },
};

export default function RootLayout(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {
    return (
        <html lang="en" className={`${gabarito.className} ${gabarito.variable}`}>
        <body
            className={`${gabarito.className} ${gabarito.variable} font-sans antialiased`}
        ><AuthProvider>
            <CartProvider>
                <div className="min-h-screen flex flex-col">
                    <Navbar/>
                    <main className="flex-1 flex flex-col">
                        {children}
                    </main>
                    <Footer/>
                </div>
            </CartProvider>
        </AuthProvider>
        </body>
        </html>
    );
}
