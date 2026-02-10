'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product } from '@/lib/types'
import { apiFetch } from '@/lib/api'

interface Settings {
    shipping_cost: number
    free_shipping_threshold: number
    tax_rate: number
}

export interface CartItem extends Product {
    quantity: number
}

interface CartContextType {
    cartItems: CartItem[]
    addToCart: (product: Product, quantity?: number) => void
    removeFromCart: (productId: number) => void
    updateQuantity: (productId: number, quantity: number) => void
    clearCart: () => void
    itemCount: number
    subtotal: number
    shippingCost: number
    taxRate: number
    freeShippingThreshold: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [settings, setSettings] = useState<Settings>({
        shipping_cost: 12.0,
        free_shipping_threshold: 100.0,
        tax_rate: 0.19
    })

    // Load from localStorage and fetch settings
    useEffect(() => {
        const saved = localStorage.getItem('cart-items')
        if (saved) {
            try {
                setCartItems(JSON.parse(saved))
            } catch (error) {
                console.error('Failed to load cart items:', error)
            }
        }

        apiFetch<any>('/settings/')
            .then(data => {
                if (data) {
                    setSettings({
                        shipping_cost: Number(data.shipping_cost) || 0,
                        free_shipping_threshold: Number(data.free_shipping_threshold) || 0,
                        tax_rate: (Number(data.tax_rate) > 1 ? Number(data.tax_rate) / 100 : Number(data.tax_rate)) || 0.19
                    })
                }
            })
            .catch(err => console.error('Failed to fetch settings:', err))
    }, [])

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('cart-items', JSON.stringify(cartItems))
    }, [cartItems])

    const addToCart = (product: Product, quantity: number = 1) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id)
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }
            return [...prev, { ...product, quantity }]
        })
    }

    const removeFromCart = (productId: number) => {
        setCartItems((prev) => prev.filter((item) => item.id !== productId))
    }

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        )
    }

    const clearCart = () => {
        setCartItems([])
    }

    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = cartItems.reduce(
        (sum, item) => sum + (item.discounted_price || item.price) * item.quantity,
        0
    )

    const shippingCost = cartItems.length > 0
        ? (settings.free_shipping_threshold > 0 && subtotal >= settings.free_shipping_threshold ? 0 : settings.shipping_cost)
        : 0

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                itemCount,
                subtotal,
                shippingCost,
                taxRate: settings.tax_rate,
                freeShippingThreshold: settings.free_shipping_threshold
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
