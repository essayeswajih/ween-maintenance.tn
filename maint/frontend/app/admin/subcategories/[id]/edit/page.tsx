'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { Category, SubCategory } from '@/lib/types'
import { toast } from 'sonner'

export default function EditSubCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        category_id: 0,
        slug: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subData, catData] = await Promise.all([
                    apiFetch<SubCategory>(`/vetrine/subcategories/${id}`),
                    apiFetch<Category[]>('/vetrine/categories')
                ])

                if (subData) {
                    setFormData({
                        name: subData.name || '',
                        category_id: subData.category_id || 0,
                        slug: subData.slug || '',
                    })
                }
                setCategories(catData || [])
            } catch (err) {
                console.error('Failed to fetch subcategory data:', err)
                toast.error('Sous-catégorie non trouvée')
                router.push('/admin/subcategories')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [id, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'category_id' ? parseInt(value) : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            await apiFetch(`/vetrine/subcategories/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            })
            toast.success('Sous-catégorie mise à jour')
            router.push('/admin/subcategories')
        } catch (err) {
            console.error('Failed to update subcategory:', err)
            toast.error('Erreur lors de la mise à jour')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="p-6 flex justify-center py-20">
                <p className="text-muted-foreground animate-pulse">Chargement...</p>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <Link href="/admin/subcategories" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la liste
                </Link>
                <h1 className="text-3xl font-bold">Modifier la Sous-catégorie</h1>
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
                            <label className="block text-sm font-medium mb-2">Slug</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" className="gap-2" disabled={isSaving}>
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Mise à jour...' : 'Mettre à jour'}
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
