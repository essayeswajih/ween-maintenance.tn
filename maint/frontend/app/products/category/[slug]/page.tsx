'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Product } from '@/lib/types'
import { apiFetch } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function CategoryProductsPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(paramsPromise)
    const [products, setProducts] = useState<Product[]>([])
    const [categoryName, setCategoryName] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // 1. Fetch categories to find the matching one
        apiFetch<any[]>('/vetrine/categories')
            .then(categories => {
                // Try to find the category by matching its name to the slug
                const category = categories.find(c =>
                    c.name.toLowerCase().replace(/ /g, '-') === slug ||
                    c.name.toLowerCase() === slug.replace(/-/g, ' ')
                )

                if (category) {
                    setCategoryName(category.name)
                    // 2. Fetch products for this category
                    return apiFetch<Product[]>(`/vetrine/products?category=${encodeURIComponent(category.name)}`)
                } else {
                    // Fallback: try to use the slug as the category name directly
                    const fallbackName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                    setCategoryName(fallbackName)
                    return apiFetch<Product[]>(`/vetrine/products?category=${encodeURIComponent(fallbackName)}`)
                }
            })
            .then(data => setProducts(data))
            .catch(err => console.error('Failed to fetch products for category:', err))
            .finally(() => setIsLoading(false))
    }, [slug])

    return (
        <div className="container mx-auto px-4 py-12">
            <Link href="/products" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
                <ArrowLeft className="w-4 h-4" />
                Retour aux produits
            </Link>

            <div className="mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{categoryName || 'Chargement...'}</h1>
                <p className="text-lg text-muted-foreground">
                    Découvrez notre sélection de produits dans la catégorie {categoryName}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                                        <Button size="sm">Détails</Button>
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
                            <p className="text-muted-foreground">Aucun produit trouvé dans cette catégorie.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
