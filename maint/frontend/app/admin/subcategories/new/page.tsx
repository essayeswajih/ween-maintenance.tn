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

export default function NewSubCategoryPage() {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        category_id: 0,
        slug: '',
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'category_id' ? parseInt(value) : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Auto-slug if empty
        const submissionData = {
            ...formData,
            slug: formData.slug || formData.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '-')
        }

        try {
            await apiFetch('/vetrine/subcategories', {
                method: 'POST',
                body: JSON.stringify(submissionData)
            })
            toast.success('Sous-catégorie créée')
            router.push('/admin/subcategories')
        } catch (err) {
            console.error('Failed to create subcategory:', err)
            toast.error('Erreur lors de la création')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <Link href="/admin/subcategories" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la liste
                </Link>
                <h1 className="text-3xl font-bold">Nouvelle Sous-catégorie</h1>
            </div>

            <Card className="max-w-2xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nom de la sous-catégorie</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="ex: Lavabos, Robinetterie..."
                                className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Catégorie Parente</label>
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

                        <div>
                            <label className="block text-sm font-medium mb-2">Slug (optionnel)</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="ex: lavabos-salle-de-bain"
                                className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Sera généré automatiquement si laissé vide.</p>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" className="gap-2" disabled={isLoading}>
                            <Save className="w-4 h-4" />
                            {isLoading ? 'Création...' : 'Créer la sous-catégorie'}
                        </Button>
                        <Link href="/admin/subcategories">
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
