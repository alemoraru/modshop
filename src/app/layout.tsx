import type { Metadata } from "next"
import { Gabarito } from "next/font/google"
import "./globals.css"
import React from "react"
import { CartProvider } from "@/context/CartContext"
import { AuthProvider } from "@/context/AuthContext"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import { Analytics } from "@vercel/analytics/next"

const gabarito = Gabarito({
    variable: "--font-gabarito",
    subsets: ["latin"],
    weight: ["400", "700"],
})

export const metadata: Metadata = {
    title: "ModShop",
    description: "Shop smart with ModShop: your personalized e-commerce experience.",
    icons: {
        icon: "/modshop-icon.png",
        shortcut: "/modshop-icon.png",
        apple: "/modshop-icon.png",
    },
    metadataBase: new URL("https://modshop.vercel.app"),
    openGraph: {
        title: "ModShop",
        description:
            "An educational e-commerce web app designed to minimize impulsive buying behavior through algorithmic behavioral nudges.",
        url: "https://modshop.vercel.app",
        siteName: "ModShop",
        images: [
            {
                url: "/modshop-og-image.png",
                width: 1200,
                height: 630,
                alt: "ModShop - Your personalized behavior-aware e-commerce experience.",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "ModShop",
        description:
            "An educational e-commerce web app designed to minimize impulsive buying behavior through algorithmic behavioral nudges.",
        images: ["/modshop-og-image.png"],
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={`${gabarito.className} ${gabarito.variable}`}>
            <body className={`${gabarito.className} ${gabarito.variable} font-sans antialiased`}>
                <AuthProvider>
                    <CartProvider>
                        <div className="min-h-screen flex flex-col">
                            <Navbar />
                            <main className="flex-1 flex flex-col">
                                {children}
                                <Analytics />
                            </main>
                            <Footer />
                        </div>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    )
}
