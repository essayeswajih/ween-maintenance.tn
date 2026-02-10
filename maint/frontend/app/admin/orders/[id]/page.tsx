'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft, Package, User, MapPin, CreditCard, Clock } from 'lucide-react'
import { apiFetch } from '@/lib/api'

interface OrderItem {
    id: number
    product_id: number
    quantity: number
    price: number
    name?: string
    color?: string
    size?: string
    product?: {
        name: string
        image_url?: string
        image2_url?: string
        description?: string
    }
}

interface Order {
    id: number
    code: string
    username: string
    email: string
    telephone: string
    location: string
    total_amount: number
    status: string
    created_at: string
    payment_method: string
    items: OrderItem[]
}

export default function OrderDetailsPage() {
    const params = useParams()
    const [order, setOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await apiFetch<Order>(`/vetrine/orders/${params.id}`)
                setOrder(data)
            } catch (error) {
                console.error('Failed to fetch order:', error)
            } finally {
                setIsLoading(false)
            }
        }

        if (params.id) {
            fetchOrder()
        }
    }, [params.id])

    if (isLoading) {
        return <div className="p-8 text-center">Chargement...</div>
    }

    if (!order) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Commande introuvable</h1>
                <Link href="/admin/orders">
                    <Button>Retour aux commandes</Button>
                </Link>
            </div>
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800'
            case 'shipped': return 'bg-blue-100 text-blue-800'
            case 'processing': return 'bg-yellow-100 text-yellow-800'
            case 'pending': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/orders">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        Commande {order.code}
                        <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Placée le {new Date(order.created_at).toLocaleDateString()} à {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Articles commandés
                        </h2>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 py-4 border-b last:border-0">
                                    <div className="w-20 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                                        {item.product?.image_url && (
                                            <img
                                                src={item.product.image_url}
                                                alt={item.name || 'Product'}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.name || item.product?.name}</h3>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            {item.price.toFixed(2)} DT x {item.quantity}
                                        </p>
                                        {item.size && <p className="text-xs text-muted-foreground">Taille: {item.size}</p>}
                                        {item.color && <p className="text-xs text-muted-foreground">Couleur: {item.color}</p>}
                                    </div>
                                    <div className="font-semibold">
                                        {(item.price * item.quantity).toFixed(2)} DT
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Sous-total</span>
                                <span>{order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)} DT</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Taxe (19%)</span>
                                <span>{(order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0) * 0.19).toFixed(2)} DT</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Livraison</span>
                                <span>{(order.total_amount - (order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0) * 1.19)).toFixed(2)} DT</span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-lg pt-2 border-t">
                                <span>Total</span>
                                <span>{order.total_amount.toFixed(2)} DT</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar - Customer Info */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Client
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-muted-foreground block">Nom complet</span>
                                <span className="font-medium">{order.username}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block">Email</span>
                                <span className="font-medium">{order.email}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block">Téléphone</span>
                                <span className="font-medium">{order.telephone}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Livraison
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-muted-foreground block">Adresse</span>
                                <span className="font-medium">{order.location}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Paiement
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-muted-foreground block">Méthode</span>
                                <span className="font-medium">{order.payment_method === 'delivery' ? 'Paiement à la livraison' : order.payment_method}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
