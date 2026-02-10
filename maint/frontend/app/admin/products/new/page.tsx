'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { Category } from '@/lib/types'
import { toast } from 'sonner'

export default function NewProductPage() {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        stock_quantity: 0,
        category_id: 0,
        image_url: '',
        slug: '',
        in_stock: true,
    })

    useEffect(() => {
        apiFetch<Category[]>('/vetrine/categories')
            .then(data => {
                setCategories(data || [])
                if (data && data.length > 0) {
                    setFormData(prev => ({ ...prev, category_id: data[0].id }))
                }
            })
            .catch(err => console.error('Failed to fetch categories:', err))
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Basic slug generation if empty
        const submissionData = {
            ...formData,
            slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-')
        }

        try {
            await apiFetch('/vetrine/products', {
                method: 'POST',
                body: JSON.stringify(submissionData)
            })
            router.push('/admin/products')
        } catch (err) {
            console.error('Failed to create product:', err)
            toast.error('Erreur lors de la création du produit')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <Link href="/admin/products" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la liste
                </Link>
                <h1 className="text-3xl font-bold">Nouveau Produit</h1>
            </div>

            <Card className="max-w-2xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Nom du produit</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Prix (DT)</label>
                            <input
                                type="number"
                                name="price"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Quantité en stock</label>
                            <input
                                type="number"
                                name="stock_quantity"
                                value={formData.stock_quantity}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Catégorie</label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">URL de l'image (optionnel)</label>
                            <input
                                type="text"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" className="gap-2" disabled={isLoading}>
                            <Save className="w-4 h-4" />
                            {isLoading ? 'Enregistrement...' : 'Enregistrer le produit'}
                        </Button>
                        <Link href="/admin/products">
                            <Button variant="outline" type="button" className="bg-transparent">
                                Annuler
                            </Button>
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    )
}
