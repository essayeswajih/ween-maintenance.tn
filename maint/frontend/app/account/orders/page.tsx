'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Package, Truck, Clock, CheckCircle, AlertCircle, Eye, Download, Loader2 } from 'lucide-react'
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
  items?: OrderItem[]
}

export default function OrdersPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    // Fetch user orders
    const fetchOrders = async () => {
      if (!user) return

      try {
        setIsLoadingOrders(true)
        const ordersData = await apiFetch<Order[]>('/vetrine/orders')
        setOrders(ordersData)
      } catch (err) {
        console.error('Failed to fetch orders:', err)
        setError('Failed to load orders')
      } finally {
        setIsLoadingOrders(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user, authLoading, router])

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

  // Format order items for display
  const formatOrderItems = (order: Order): string => {
    if (!order.items || order.items.length === 0) {
      return 'Articles de commande'
    }
    return order.items
      .map(item => {
        const parts = [item.name || `Article #${item.product_id}`]
        if (item.quantity > 1) parts.push(`x${item.quantity}`)
        return parts.join(' ')
      })
      .join(', ')
  }

  // Format date to French format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => getStatusLabel(order.status) === selectedStatus)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Livré':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'En livraison':
        return <Truck className="w-5 h-5 text-blue-600" />
      case 'Préparation':
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <Package className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Livré':
        return 'bg-green-100 text-green-800'
      case 'En livraison':
        return 'bg-blue-100 text-blue-800'
      case 'Préparation':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Show loading state
  if (authLoading || isLoadingOrders) {
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

  return (
    <>
      {/* Header */}
      <section className="py-8 bg-muted/50 border-b">
        <div className="container mx-auto px-4">
          <Link href="/account" className="flex items-center gap-2 text-primary hover:underline mb-4 w-fit">
            <ArrowLeft className="w-4 h-4" />
            Retour au compte
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Mes commandes</h1>
          <p className="text-muted-foreground">Suivez et gérez vos commandes</p>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { value: 'all', label: 'Toutes les commandes' },
            { value: 'Livré', label: 'Livrées' },
            { value: 'En livraison', label: 'En livraison' },
            { value: 'Préparation', label: 'En préparation' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedStatus(filter.value)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${selectedStatus === filter.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-muted'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {/* Orders List */}
      <section className="container mx-auto px-4 pb-12">
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Card key={order.id} className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">
                      {getStatusIcon(getStatusLabel(order.status))}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">Commande #{order.code}</h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(getStatusLabel(order.status))}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{formatOrderItems(order)}</p>
                      <p className="text-xs text-muted-foreground">
                        Commande du {formatDate(order.created_at)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Numéro de suivi: {order.code}
                      </p>
                    </div>
                  </div>

                  {/* Total and Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{order.total_amount.toFixed(2)} DT</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/account/orders/${order.code}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">Détails</span>
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Facture</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {getStatusLabel(order.status) !== 'Livré' && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progression</span>
                      <span className="font-medium">
                        {getStatusLabel(order.status) === 'Préparation' ? '33%' : getStatusLabel(order.status) === 'En livraison' ? '66%' : '100%'}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all"
                        style={{
                          width: getStatusLabel(order.status) === 'Préparation' ? '33%' : getStatusLabel(order.status) === 'En livraison' ? '66%' : '100%'
                        }}
                      />
                    </div>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune commande trouvée</p>
              <Link href="/products" className="mt-4 inline-block">
                <Button>Continuer le shopping</Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Summary */}
        {filteredOrders.length > 0 && (
          <Card className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5">
            <h3 className="font-bold mb-4">Résumé des commandes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nombre de commandes</p>
                <p className="text-2xl font-bold">{filteredOrders.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Montant total</p>
                <p className="text-2xl font-bold text-primary">
                  {filteredOrders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)} DT
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commande moyenne</p>
                <p className="text-2xl font-bold">
                  {(filteredOrders.reduce((sum, order) => sum + order.total_amount, 0) / filteredOrders.length).toFixed(2)} DT
                </p>
              </div>
            </div>
          </Card>
        )}
      </section>
    </>
  )
}
