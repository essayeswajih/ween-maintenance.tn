'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { Product, Category } from '@/lib/types'
import { toast } from 'sonner'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Record<number, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          apiFetch<Product[]>('/vetrine/products?limit=100'),
          apiFetch<any[]>('/vetrine/categories')
        ])

        setProducts(productsData || [])

        // Map category IDs to names
        const catMap: Record<number, string> = {}
        categoriesData.forEach((cat: any) => {
          catMap[cat.id] = cat.name
        })
        setCategories(catMap)
      } catch (err) {
        console.error('Failed to fetch admin products:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) return

    try {
      await apiFetch(`/vetrine/products/${id}`, {
        method: 'DELETE'
      })
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      console.error('Failed to delete product:', err)
      toast.error('Erreur lors de la suppression')
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Gestion des Produits</h1>
          <Link href="/admin/products/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un produit
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Chercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <p className="text-muted-foreground animate-pulse">Chargement des produits...</p>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-semibold">Produit</th>
                  <th className="text-left p-4 font-semibold">Catégorie</th>
                  <th className="text-left p-4 font-semibold">Prix</th>
                  <th className="text-left p-4 font-semibold">Stock</th>
                  <th className="text-left p-4 font-semibold">Statut</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const status = product.stock_quantity > 0 ? 'Actif' : 'Rupture'
                  return (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium">{product.name}</td>
                      <td className="p-4">{categories[product.category_id] || 'N/A'}</td>
                      <td className="p-4 font-semibold">{product.price.toFixed(2)} DT</td>
                      <td className="p-4">
                        <span className={product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                          {product.stock_quantity} unités
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${status === 'Actif'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="ghost" size="sm" className="gap-2 bg-transparent text-foreground">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-transparent text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
