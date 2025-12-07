"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

/**
 * CartItem interface represents an item in the shopping cart.
 */
export interface CartItem {
    slug: string
    title: string
    price: number
    quantity: number
    image: string
    category?: string
}

interface CartContextType {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (slug: string) => void
    clearCart: () => void
    updateQuantity: (slug: string, quantity: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    useEffect(() => {
        const stored = localStorage.getItem("modshop_cart")
        if (stored) setItems(JSON.parse(stored))
    }, [])

    useEffect(() => {
        localStorage.setItem("modshop_cart", JSON.stringify(items))
    }, [items])

    const addItem = (item: CartItem) => {
        setItems(prev => {
            const existing = prev.find(p => p.slug === item.slug)
            if (existing) {
                return prev.map(p =>
                    p.slug === item.slug ? { ...p, quantity: p.quantity + item.quantity } : p
                )
            }
            return [...prev, item]
        })
    }

    const removeItem = (slug: string) => {
        setItems(prev => prev.filter(p => p.slug !== slug))
    }

    const clearCart = () => setItems([])

    const updateQuantity = (slug: string, quantity: number) => {
        setItems(prev =>
            prev.map(item =>
                item.slug === slug ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        )
    }

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error("useCart must be used within a CartProvider")
    return context
}
