'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, Eye, Trash2 } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface Order {
  id: number
  code: string
  username: string
  created_at: string
  total_amount: number
  status: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('Tous')

  const fetchOrders = async () => {
    try {
      const data = await apiFetch<Order[]>('/vetrine/orders')
      setOrders(data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) return

    try {
      await apiFetch(`/vetrine/orders/${orderId}`, { method: 'DELETE' })
      setOrders(prev => prev.filter(o => o.id !== orderId))
    } catch (error) {
      console.error('Failed to delete order:', error)
      alert('Erreur lors de la suppression de la commande')
    }
  }

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await apiFetch(`/vetrine/orders/orderStatus/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Erreur lors de la mise à jour du statut')
    }
  }

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(o.id).includes(searchQuery)
    const matchesStatus = filterStatus === 'Tous' || o.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livrée'
      case 'shipped': return 'Expédiée'
      case 'processing': return 'En traitement'
      case 'pending': return 'En attente'
      default: return status
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Gestion des Commandes</h1>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Chercher une commande (Code, Client, ID)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Tous">Tous</option>
            <option value="pending">En attente</option>
            <option value="processing">En traitement</option>
            <option value="shipped">Expédiée</option>
            <option value="delivered">Livrée</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">Commande</th>
                <th className="text-left p-4 font-semibold">Client</th>
                <th className="text-left p-4 font-semibold">Date</th>
                <th className="text-left p-4 font-semibold">Montant</th>
                <th className="text-left p-4 font-semibold">Statut</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">Chargement...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">Aucune commande trouvée</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">
                      <div className="flex flex-col">
                        <span>{order.code}</span>
                        <span className="text-xs text-muted-foreground">#{order.id}</span>
                      </div>
                    </td>
                    <td className="p-4">{order.username}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-semibold">{order.total_amount.toFixed(2)} DT</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-semibold border-none cursor-pointer focus:ring-0 ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">En attente</option>
                        <option value="processing">En traitement</option>
                        <option value="shipped">Expédiée</option>
                        <option value="delivered">Livrée</option>
                      </select>
                    </td>
                    <td className="p-4 flex gap-2">
                      {/* View button - mocked link for now or point to detail page if exists/planned */}
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="ghost" size="sm" title="Voir les détails">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
