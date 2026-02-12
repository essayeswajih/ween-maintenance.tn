'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { toast } from 'sonner'

export default function NewCategoryPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await apiFetch('/vetrine/categories', {
                method: 'POST',
                body: JSON.stringify(formData)
            })
            toast.success('Catégorie créée avec succès')
            router.push('/admin/categories')
        } catch (err) {
            console.error('Failed to create category:', err)
            toast.error('Erreur lors de la création de la catégorie')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <Link href="/admin/categories" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la liste
                </Link>
                <h1 className="text-3xl font-bold">Nouvelle Catégorie</h1>
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
                                placeholder="ex: Plomberie, Chauffage..."
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
                                placeholder="Description de la catégorie..."
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
                                placeholder="image.jpg ou https://..."
                                className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" className="gap-2" disabled={isLoading}>
                            <Save className="w-4 h-4" />
                            {isLoading ? 'Création...' : 'Créer la catégorie'}
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
