'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Star, Heart, Share2, Truck, RotateCcw, Shield, ShoppingCart, Plus, Minus } from 'lucide-react'
import { Product } from '@/lib/types'
import { useCart } from '@/context/cart-context'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ProductContentProps {
    product: Product | null;
}

export default function ProductContent({ product }: ProductContentProps) {
    const [quantity, setQuantity] = useState(1)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [activeTab, setActiveTab] = useState('description')
    const { addToCart } = useCart()
    const router = useRouter()

    if (!product) {
        return (
            <>
                <section className="py-8 bg-muted/50 border-b">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl font-bold">Produit non trouvé</h1>
                    </div>
                </section>
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-muted-foreground mb-6">Désolé, ce produit n'existe pas.</p>
                    <Link href="/products">
                        <Button>Retour aux produits</Button>
                    </Link>
                </div>
            </>
        )
    }

    const discountPercent = product.discounted_price
        ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
        : 0

    return (
        <>
            {/* Header */}
            <section className="py-8 bg-muted/50 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/products" className="hover:text-primary">Produits</Link>
                        <span>/</span>
                        {product.category_name ? (
                            <>
                                <Link
                                    href={`/products/category/${product.category_name.toLowerCase().replace(/ /g, '-')}`}
                                    className="hover:text-primary"
                                >
                                    {product.category_name}
                                </Link>
                                <span>/</span>
                            </>
                        ) : (
                            <>
                                <Link href="/products" className="hover:text-primary">Produit</Link>
                                <span>/</span>
                            </>
                        )}
                        <span>{product.name}</span>
                    </div>
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                </div>
            </section>

            {/* Product Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Product Image */}
                    <div className="lg:col-span-1">
                        <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center text-9xl p-8 sticky top-4 overflow-hidden relative">
                            {product.image_url ? (
                                <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    fill
                                    priority
                                    className="object-contain"
                                />
                            ) : (
                                '📦'
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:col-span-2">
                        {/* Category & Rating */}
                        <div className="mb-6">
                            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">{product.category}</span>
                        </div>

                        {/* Title & Price */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold mb-4">{product.name}</h2>

                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="text-4xl font-bold text-primary">{(product.discounted_price || product.price).toFixed(2)} DT</span>
                                {product.discounted_price && (
                                    <>
                                        <span className="text-xl text-muted-foreground line-through">{product.price.toFixed(2)} DT</span>
                                        <span className="text-sm font-semibold bg-accent text-accent-foreground px-3 py-1 rounded-full">
                                            -{discountPercent}%
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Rating & Stock */}
                            <div className="flex items-center gap-6 mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < Math.floor(product.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-semibold">{product.rating || 5.0}</span>
                                    <span className="text-muted-foreground">({product.num_ratings || 0} avis)</span>
                                </div>

                                <div className={`font-semibold ${product.stock_quantity > 0 ? 'text-green-600' : 'text-destructive'}`}>
                                    {product.stock_quantity > 0 ? `${product.stock_quantity} en stock` : 'Rupture de stock'}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose prose-sm max-w-none mb-8">
                            <p>{product.description}</p>
                        </div>

                        {/* Features List */}
                        {product.features && product.features.length > 0 && (
                            <div className="mb-8">
                                <h3 className="font-semibold mb-4">Caractéristiques principales</h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {product.features.map((feature: string, index: number) => (
                                        <li key={index} className="flex items-start gap-2 text-sm">
                                            <span className="text-primary font-bold">✓</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="bg-muted/50 p-6 rounded-lg mb-8">
                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <label className="text-sm font-medium mb-3 block">Quantité</label>
                                <div className="flex items-center gap-4 w-fit">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="bg-transparent"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="text-lg font-semibold min-w-8 text-center">{quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(quantity + 1)}
                                        disabled={quantity >= product.stock_quantity}
                                        className="bg-transparent"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <Button
                                className="w-full gap-2 mb-3"
                                disabled={product.stock_quantity === 0}
                                onClick={() => {
                                    addToCart(product, quantity);
                                    toast.success(`${quantity} x ${product.name} ajouté au panier`);
                                }}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Ajouter au panier
                            </Button>

                            {/* Secondary Actions */}
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 bg-transparent gap-2"
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                >
                                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-destructive text-destructive' : ''}`} />
                                    {isWishlisted ? 'Sauvegardé' : 'Sauvegarder'}
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent gap-2">
                                    <Share2 className="w-4 h-4" />
                                    Partager
                                </Button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Card className="p-4 text-center">
                                <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                                <p className="text-xs font-medium">Livraison gratuite</p>
                                <p className="text-xs text-muted-foreground">Pour commandes &gt;100DT</p>
                            </Card>
                            <Card className="p-4 text-center">
                                <RotateCcw className="w-6 h-6 text-primary mx-auto mb-2" />
                                <p className="text-xs font-medium">Retours gratuits</p>
                                <p className="text-xs text-muted-foreground">Jusqu\'à 30 jours</p>
                            </Card>
                            <Card className="p-4 text-center">
                                <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                                <p className="text-xs font-medium">Garantie</p>
                                <p className="text-xs text-muted-foreground">2 ans minimum</p>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="border-t pt-12">
                    {/* Tab Navigation */}
                    <div className="flex gap-8 mb-8 border-b">
                        {['description', 'specifications', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
                                    }`}
                            >
                                {tab === 'description' ? 'Description' : tab === 'specifications' ? 'Spécifications' : 'Avis'}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div>
                        {/* Description Tab */}
                        {activeTab === 'description' && (
                            <div className="prose prose-sm max-w-none">
                                <p>{product.description}</p>
                                {product.features && product.features.length > 0 && (
                                    <>
                                        <h3>Caractéristiques</h3>
                                        <ul>
                                            {product.features.map((feature: string, index: number) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Specifications Tab */}
                        {activeTab === 'specifications' && (
                            <div className="space-y-4">
                                {product.materials && (
                                    <div className="flex justify-between py-3 border-b">
                                        <span className="font-medium">Matériaux</span>
                                        <span className="text-muted-foreground">{product.materials.join(', ')}</span>
                                    </div>
                                )}
                                {product.sku && (
                                    <div className="flex justify-between py-3 border-b">
                                        <span className="font-medium">SKU</span>
                                        <span className="text-muted-foreground">{product.sku}</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-3 border-b">
                                    <span className="font-medium">Statut</span>
                                    <span className="text-muted-foreground">{product.in_stock ? 'En stock' : 'Indisponible'}</span>
                                </div>
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-6">
                                <div className="mb-8">
                                    <h3 className="font-semibold mb-4">Avis clients ({product.num_ratings || 0})</h3>
                                    <p className="text-sm text-muted-foreground">Aucun avis pour le moment.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Similar Products Placeholder */}
                <div className="mt-20 pt-12 border-t text-center">
                    <h2 className="text-2xl font-bold mb-8">Découvrez plus de produits</h2>
                    <Link href="/products">
                        <Button variant="outline">Voir tout le catalogue</Button>
                    </Link>
                </div>
            </div>
        </>
    )
}
