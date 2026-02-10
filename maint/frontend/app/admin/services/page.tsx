'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Edit, Trash2, Search, Settings } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { Service } from '@/lib/types'
import { toast } from 'sonner'

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiFetch<Service[]>('/service')
        setServices(data || [])
      } catch (err) {
        console.error('Failed to fetch admin services:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchServices()
  }, [])

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce service?')) return

    try {
      await apiFetch(`/service/${id}`, {
        method: 'DELETE'
      })
      setServices(services.filter(s => s.id !== id))
    } catch (err) {
      console.error('Failed to delete service:', err)
      toast.error('Erreur lors de la suppression')
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Gestion des Services</h1>
          <div className="flex items-center gap-4">
            <Link href="/admin/services/categories">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Settings className="w-4 h-4" />
                Gérer les catégories
              </Button>
            </Link>
            <Link href="/admin/services/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Ajouter un service
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Chercher un service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <p className="text-muted-foreground animate-pulse">Chargement des services...</p>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-semibold">Service</th>
                  <th className="text-left p-4 font-semibold">Description</th>
                  <th className="text-left p-4 font-semibold">Note</th>
                  <th className="text-left p-4 font-semibold">Statut</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{service.name}</td>
                    <td className="p-4 text-sm text-muted-foreground line-clamp-1 truncate max-w-xs">{service.description}</td>
                    <td className="p-4">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">
                        {service.rating} ({service.num_ratings})
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                        Actif
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <Link href={`/admin/services/${service.id}/edit`}>
                        <Button variant="ghost" size="sm" className="bg-transparent text-foreground">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-transparent text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
