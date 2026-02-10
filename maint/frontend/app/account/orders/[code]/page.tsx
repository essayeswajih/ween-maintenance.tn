'use client'

import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Package, Truck, Clock, CheckCircle, AlertCircle, Download, PrinterIcon, MapPin, Phone, Mail, Calendar, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/context/auth-context'
import { apiFetch } from '@/lib/api'

interface OrderItem {
    id: number
    order_id: number
    product_id: number
    quantity: number
    price: number
    name?: string
    color?: string
    size?: string
}

interface Order {
    id: number
    total_amount: number
    status: string
    created_at: string
    username: string
    email: string
    telephone: string
    location: string
    payment_method: string
    payed: string
    code: string
    items: OrderItem[]
    shipping_cost?: number
    tax_amount?: number
}

export default function OrderDetailPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = use(params)
    const { user, isLoading: authLoading, isAuthenticated } = useAuth()
    const router = useRouter()
    const [order, setOrder] = useState<Order | null>(null)
    const [isLoadingOrder, setIsLoadingOrder] = useState(true)
    const [isDownloading, setIsDownloading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!authLoading && !user) {
            router.push('/login')
            return
        }

        // Fetch order details
        const fetchOrder = async () => {
            if (!user) return

            try {
                setIsLoadingOrder(true)
                // Correct endpoint for tracking number
                const orderData = await apiFetch<Order>(`/vetrine/orders/orderCode/${code}`)
                setOrder(orderData)
            } catch (err) {
                console.error('Failed to fetch order:', err)
                setError('Failed to load order details')
            } finally {
                setIsLoadingOrder(false)
            }
        }

        if (user) {
            fetchOrder()
        }
    }, [user, authLoading, router, code])

    // Map backend status to French UI labels
    const getStatusLabel = (status: string): string => {
        const statusMap: Record<string, string> = {
            'pending': 'Préparation',
            'processing': 'Préparation',
            'shipped': 'En livraison',
            'delivered': 'Livré'
        }
        return statusMap[status.toLowerCase()] || status
    }

    // Format date to French format
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    // Calculate subtotal from items
    const calculateSubtotal = (items: OrderItem[]): number => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }

    // Show loading state
    if (authLoading || isLoadingOrder) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    // Don't render if no user (will redirect)
    if (!user) {
        return null
    }

    if (error || !order) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-3xl font-bold mb-4">Commande non trouvée</h1>
                <p className="text-muted-foreground mb-6">La commande que vous recherchez n'existe pas.</p>
                <Link href="/account/orders">
                    <Button>Retour aux commandes</Button>
                </Link>
            </div>
        )
    }

    const statusLabel = getStatusLabel(order.status)
    const subtotal = calculateSubtotal(order.items)

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Livré':
                return <CheckCircle className="w-6 h-6 text-green-600" />
            case 'En livraison':
                return <Truck className="w-6 h-6 text-blue-600" />
            case 'Préparation':
                return <Clock className="w-6 h-6 text-yellow-600" />
            default:
                return <Package className="w-6 h-6 text-gray-600" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Livré':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            case 'En livraison':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
            case 'Préparation':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
        }
    }

    const handleDownloadInvoice = () => {
        setIsDownloading(true)
        setTimeout(() => {
            setIsDownloading(false)
            toast.success('Facture téléchargée avec succès!')
        }, 1000)
    }

    const handlePrintOrder = () => {
        window.print()
    }

    return (
        <>
            {/* Header */}
            <section className="py-8 bg-muted/50 border-b">
                <div className="container mx-auto px-4">
                    <Link href="/account/orders" className="flex items-center gap-2 text-primary hover:underline mb-4 w-fit">
                        <ArrowLeft className="w-4 h-4" />
                        Retour aux commandes
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold">Commande #{order.code}</h1>
                    <p className="text-muted-foreground">Détails complets de votre commande</p>
                </div>
            </section>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Card */}
                        <Card className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                {getStatusIcon(order.status)}
                                <div>
                                    <h2 className="text-2xl font-bold">{statusLabel}</h2>
                                    <p className="text-muted-foreground">Commandée le {formatDate(order.created_at)}</p>
                                </div>
                            </div>

                            {/* Progress Timeline */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="font-medium">Commande confirmée</p>
                                        <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                                    </div>
                                </div>

                                <div className="ml-3 pb-4 border-l-2 border-muted" />

                                <div className="flex items-center gap-4">
                                    {statusLabel !== 'Préparation' ? (
                                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                                    ) : (
                                        <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-medium">En préparation</p>
                                        <p className="text-sm text-muted-foreground">Votre commande est en cours de préparation</p>
                                    </div>
                                </div>

                                <div className="ml-3 pb-4 border-l-2 border-muted" />

                                <div className="flex items-center gap-4">
                                    {statusLabel === 'Livré' || statusLabel === 'En livraison' ? (
                                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                                    ) : (
                                        <AlertCircle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-medium">Expédiée</p>
                                        <p className="text-sm text-muted-foreground">
                                            {statusLabel === 'Livré' || statusLabel === 'En livraison' ? `Numéro de suivi: ${order.code}` : 'En attente'}
                                        </p>
                                    </div>
                                </div>

                                <div className="ml-3 pb-4 border-l-2 border-muted" />

                                <div className="flex items-center gap-4">
                                    {statusLabel === 'Livré' ? (
                                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                                    ) : (
                                        <AlertCircle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-medium">Livrée</p>
                                        <p className="text-sm text-muted-foreground">
                                            {statusLabel === 'Livré' ? 'Commande livrée' : 'En attente'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Items Card */}
                        <Card className="p-6">
                            <h3 className="text-lg font-bold mb-6">Détails de la commande</h3>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between py-4 border-b last:border-0">
                                        <div className="flex-1">
                                            <p className="font-medium">{item.name || `Article #${item.product_id}`}</p>
                                            <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                                            {item.color && <p className="text-sm text-muted-foreground">Couleur: {item.color}</p>}
                                            {item.size && <p className="text-sm text-muted-foreground">Taille: {item.size}</p>}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{(item.price * item.quantity).toFixed(2)} DT</p>
                                            <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} DT x {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="mt-6 space-y-3 border-t pt-6">
                                <div className="flex justify-between">
                                    <span>Sous-total</span>
                                    <span className="font-medium">{subtotal.toFixed(2)} DT</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">TVA (19%)</span>
                                    <span className="font-medium">{(order.tax_amount || (subtotal * 0.19)).toFixed(2)} DT</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Frais de livraison</span>
                                    <span className="font-medium">
                                        {(order.shipping_cost || (subtotal < 100 ? 12 : 0)).toFixed(2)} DT
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold bg-primary/10 p-3 rounded">
                                    <span>Total</span>
                                    <span className="text-primary">{(subtotal + (order.tax_amount || (subtotal * 0.19)) + (order.shipping_cost || (subtotal < 100 ? 12 : 0))).toFixed(2)} DT</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Actions */}
                        <Card className="p-6">
                            <h3 className="font-bold mb-4">Actions</h3>
                            <div className="space-y-3">
                                <Button
                                    onClick={handleDownloadInvoice}
                                    disabled={isDownloading}
                                    className="w-full gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    {isDownloading ? 'Téléchargement...' : 'Télécharger la facture'}
                                </Button>
                                <Button
                                    onClick={handlePrintOrder}
                                    variant="outline"
                                    className="w-full gap-2 bg-transparent"
                                >
                                    <PrinterIcon className="w-4 h-4" />
                                    Imprimer
                                </Button>
                                <Button variant="outline" className="w-full bg-transparent">
                                    Contacter le support
                                </Button>
                            </div>
                        </Card>

                        {/* Delivery Info */}
                        <Card className="p-6">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Truck className="w-5 h-5" />
                                Livraison
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Adresse de livraison</p>
                                    <p className="font-medium flex items-start gap-2 mt-1">
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                                        <span>{order.location}</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Numéro de suivi</p>
                                    <p className="font-medium text-primary">{order.code}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Customer Info */}
                        <Card className="p-6">
                            <h3 className="font-bold mb-4">Informations de contact</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Nom</p>
                                    <p className="font-medium">{order.username}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Phone className="w-4 h-4" /> Téléphone
                                    </p>
                                    <p className="font-medium">{order.telephone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Mail className="w-4 h-4" /> Email
                                    </p>
                                    <p className="font-medium text-primary">{order.email}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}
