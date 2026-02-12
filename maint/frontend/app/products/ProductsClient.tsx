'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, Filter, ChevronRight } from 'lucide-react'
import { Product } from '@/lib/types'
import { apiFetch } from '@/lib/api'
import { useCart } from '@/context/cart-context'
import { toast } from 'sonner'

interface ProductsClientProps {
    initialFilters: {
        category?: string
        subcategory?: string
        search?: string
        maxPrice?: string
    }
}

export default function ProductsClient({ initialFilters }: ProductsClientProps) {
    const router = useRouter()
    const pathname = usePathname()
    const urlSearchParams = useSearchParams()

    const categoryName = initialFilters.category
    const subcategoryName = initialFilters.subcategory
    const searchFor = initialFilters.search
    const maxPriceStr = initialFilters.maxPrice

    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchInput, setSearchInput] = useState(searchFor || '')
    const { addToCart } = useCart()

    // Sync search input with search param
    useEffect(() => {
        setSearchInput(searchFor || '')
    }, [searchFor])

    useEffect(() => {
        setIsLoading(true)

        // Build query params
        const params = new URLSearchParams()
        if (categoryName) params.append('category', categoryName)
        if (subcategoryName) params.append('subcategory', subcategoryName)
        if (searchFor) params.append('search', searchFor)
        if (maxPriceStr) params.append('max_price', maxPriceStr)

        const queryString = params.toString()
        const productsUrl = queryString ? `/vetrine/products?${queryString}` : '/vetrine/products'

        apiFetch<Product[]>(productsUrl)
            .then(data => setProducts(data))
            .catch(err => console.error('Failed to fetch products:', err))
            .finally(() => setIsLoading(false))

        // Fetch categories with subcategories (now unified in one backend call)
        apiFetch<any[]>('/vetrine/categories')
            .then(data => setCategories(data))
            .catch(err => console.error('Failed to fetch categories:', err))
    }, [categoryName, subcategoryName, searchFor, maxPriceStr])

    const updateFilters = (newParams: Record<string, string | null>) => {
        const params = new URLSearchParams(urlSearchParams.toString())
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null) {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        })
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        updateFilters({ search: searchInput || null })
    }

    return (
        <>
            <section className="py-12 bg-muted/50">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Nos Produits</h1>
                    <p className="text-lg text-muted-foreground">
                        Large gamme de matériel et équipements professionnels pour tous vos besoins
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <div className="mb-8">
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </form>
                        </div>

                        <div className="mb-8">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                Catégories
                            </h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => updateFilters({ category: null, subcategory: null })}
                                    className={`w-full text-left p-2 rounded hover:bg-muted transition-colors ${!categoryName ? 'bg-muted text-primary font-semibold' : ''}`}
                                >
                                    <span className="text-sm">Tous les produits</span>
                                </button>
                                {categories.map((category) => (
                                    <div key={category.id} className="space-y-1">
                                        <button
                                            onClick={() => updateFilters({ category: category.name, subcategory: null })}
                                            className={`w-full text-left p-2 rounded hover:bg-muted transition-colors flex justify-between items-center ${categoryName === category.name && !subcategoryName ? 'bg-muted text-primary font-semibold' : ''}`}
                                        >
                                            <span className="text-sm">{category.name}</span>
                                            {category.subcategories?.length > 0 && <ChevronRight className={`w-4 h-4 transition-transform ${categoryName === category.name ? 'rotate-90' : ''}`} />}
                                        </button>

                                        {categoryName === category.name && category.subcategories?.length > 0 && (
                                            <div className="pl-4 space-y-1">
                                                {category.subcategories.map((sub: any) => (
                                                    <button
                                                        key={sub.id}
                                                        onClick={() => updateFilters({ subcategory: sub.name })}
                                                        className={`w-full text-left p-2 rounded hover:bg-muted transition-colors text-xs ${subcategoryName === sub.name ? 'text-primary font-semibold bg-muted/50' : 'text-muted-foreground'}`}
                                                    >
                                                        {sub.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h4 className="font-semibold mb-4">Prix Maximum</h4>
                            <div className="space-y-2">
                                {[
                                    { label: 'Jusqu\'à 25 DT', value: '25' },
                                    { label: 'Jusqu\'à 50 DT', value: '50' },
                                    { label: 'Jusqu\'à 100 DT', value: '100' },
                                    { label: 'Tous les prix', value: null }
                                ].map((range) => (
                                    <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price-filter"
                                            className="w-4 h-4"
                                            checked={maxPriceStr === range.value}
                                            onChange={() => updateFilters({ maxPrice: range.value })}
                                        />
                                        <span className="text-sm">{range.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

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
                                                <p className="text-xs text-muted-foreground mb-1">
                                                    {product.category_name} {product.subcategory_name ? `> ${product.subcategory_name}` : ''}
                                                </p>
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
                    </div>
                </div>
            </div>
        </>
    )
}
