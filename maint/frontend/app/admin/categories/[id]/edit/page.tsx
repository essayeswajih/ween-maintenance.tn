'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { Category } from '@/lib/types'
import { toast } from 'sonner'

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: '',
    })

    useEffect(() => {
        apiFetch<Category>(`/vetrine/categories/${id}`)
            .then(data => {
                if (data) {
                    setFormData({
                        name: data.name || '',
                        description: data.description || '',
                        image_url: data.image_url || '',
                    })
                }
            })
            .catch(err => {
                console.error('Failed to fetch category:', err)
                toast.error('Catégorie non trouvée')
                router.push('/admin/categories')
            })
            .finally(() => setIsLoading(false))
    }, [id, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            await apiFetch(`/vetrine/categories/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            })
            toast.success('Catégorie mise à jour')
            router.push('/admin/categories')
        } catch (err) {
            console.error('Failed to update category:', err)
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
                <Link href="/admin/categories" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la liste
                </Link>
                <h1 className="text-3xl font-bold">Modifier la Catégorie</h1>
            </div>

            <Card className="max-w-2xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nom de la catégorie</label>
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
                            <label className="block text-sm font-medium mb-2">URL de l'image</label>
                            <input
                                type="text"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" className="gap-2" disabled={isSaving}>
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Mise à jour...' : 'Mettre à jour'}
                        </Button>
                        <Link href="/admin/categories">
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
