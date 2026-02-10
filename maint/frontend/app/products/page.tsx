'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, Filter } from 'lucide-react'
import { Product, ServiceCategory } from '@/lib/types'
import { apiFetch } from '@/lib/api'
import { useCart } from '@/context/cart-context'
import { toast } from 'sonner'

export default function ProductsPage({ searchParams: searchParamsPromise }: { searchParams: Promise<{ category?: string }> }) {
  const searchParams = use(searchParamsPromise)
  const { category: categoryName } = searchParams
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    setIsLoading(true)
    // Fetch products (with optional category filter)
    const productsUrl = categoryName
      ? `/vetrine/products?category=${encodeURIComponent(categoryName)}`
      : '/vetrine/products'

    apiFetch<Product[]>(productsUrl)
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch products:', err))
      .finally(() => setIsLoading(false))

    // Fetch categories (using vetrine categories)
    apiFetch<any[]>('/vetrine/categories')
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to fetch categories:', err))
  }, [categoryName])

  return (
    <>
      {/* Header */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Nos Produits</h1>
          <p className="text-lg text-muted-foreground">
            Large gamme de matériel et équipements professionnels pour tous vos besoins
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Catégories
              </h3>
              <div className="space-y-2">
                <Link
                  href="/products"
                  className={`block p-2 rounded hover:bg-muted transition-colors ${!categoryName ? 'bg-muted text-primary font-semibold' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tous les produits</span>
                  </div>
                </Link>
                {categories.map((category) => {
                  const slug = category.name.toLowerCase().replace(/ /g, '-')
                  return (
                    <Link
                      key={category.id}
                      href={`/products/category/${slug}`}
                      className={`block p-2 rounded hover:bg-muted transition-colors ${categoryName === category.name ? 'bg-muted text-primary font-semibold' : ''}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{category.name}</span>
                        <span className="text-xs text-muted-foreground">Explorer</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <h4 className="font-semibold mb-4">Prix</h4>
              <div className="space-y-2">
                {['0 - 25 DT', '25 - 50 DT', '50 - 100 DT', '100+ DT'].map((range) => (
                  <label key={range} className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">{range}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <Link key={product.id} href={`/products/${product.slug}`}>
                    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center text-5xl">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          '📦'
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">Produit</p>
                        <h3 className="font-semibold mb-2 line-clamp-2 h-12">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">{product.price.toFixed(2)} DT</span>
                          <Button size="sm" onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                            toast.success(`${product.name} ajouté au panier`);
                          }}>Ajouter</Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  {isLoading ? (
                    <p className="text-muted-foreground">Chargement des produits...</p>
                  ) : (
                    <p className="text-muted-foreground">Aucun produit trouvé.</p>
                  )}
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center gap-2">
              {[1, 2, 3, 4].map((page) => (
                <Button
                  key={page}
                  variant={page === 1 ? 'default' : 'outline'}
                  size="sm"
                >
                  {page}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
