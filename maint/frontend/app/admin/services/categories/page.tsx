'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Edit, Trash2, ArrowLeft, Save, X, Image as ImageIcon } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { ServiceCategory } from '@/lib/types'
import { toast } from 'sonner'

export default function ServiceCategoriesPage() {
    const [categories, setCategories] = useState<ServiceCategory[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState<number | 'new' | null>(null)
    const [formData, setFormData] = useState<Partial<ServiceCategory>>({
        name: '',
        description: '',
        slug: '',
        image_url: ''
    })

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        setIsLoading(true)
        try {
            const data = await apiFetch<ServiceCategory[]>('/service/categories')
            setCategories(data || [])
        } catch (err) {
            console.error('Failed to fetch categories:', err)
            toast.error('Erreur lors du chargement des catégories')
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = (category: ServiceCategory | 'new') => {
        if (category === 'new') {
            setIsEditing('new')
            setFormData({ name: '', description: '', slug: '', image_url: '' })
        } else {
            setIsEditing(category.id)
            setFormData(category)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Supprimer cette catégorie ? Cela peut affecter les services liés.')) return
        try {
            await apiFetch(`/service/categories/${id}`, { method: 'DELETE' })
            setCategories(categories.filter(c => c.id !== id))
            toast.success('Catégorie supprimée')
        } catch (err) {
            console.error('Failed to delete category:', err)
            toast.error('Erreur lors de la suppression')
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const fd = new FormData()
        fd.append('file', file)
        try {
            const data = await apiFetch<{ url: string }>('/upload', { method: 'POST', body: fd })
            if (data?.url) {
                setFormData(prev => ({ ...prev, image_url: data.url }))
                toast.success('Image téléchargée')
            }
        } catch (err) {
            toast.error('Erreur upload')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const method = isEditing === 'new' ? 'POST' : 'PUT'
        const url = isEditing === 'new' ? '/service/categories' : `/service/categories/${isEditing}`

        const submissionData = {
            ...formData,
            slug: formData.slug || formData.name?.toLowerCase().replace(/ /g, '-')
        }

        try {
            await apiFetch(url, {
                method,
                body: JSON.stringify(submissionData)
            })
            toast.success(isEditing === 'new' ? 'Catégorie créée' : 'Catégorie mise à jour')
            setIsEditing(null)
            fetchCategories()
        } catch (err) {
            toast.error('Erreur lors de l\'enregistrement')
        }
    }

    return (
        <div className="p-6">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Link href="/admin/services" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2">
                        <ArrowLeft className="w-4 h-4" />
                        Retour aux services
                    </Link>
                    <h1 className="text-3xl font-bold">Catégories de Services</h1>
                </div>
                <Button onClick={() => handleEdit('new')} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nouvelle catégorie
                </Button>
            </div>

            {isEditing && (
                <Card className="p-6 mb-8 border-primary/20">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {isEditing === 'new' ? 'Ajouter une catégorie' : 'Modifier la catégorie'}
                            </h2>
                            <Button type="button" variant="ghost" onClick={() => setIsEditing(null)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nom</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border rounded-md bg-background"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Slug (optionnel)</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md bg-background"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                    className="w-full px-3 py-2 border rounded-md bg-background"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Image (Optionnel - URL, Emoji ou Upload)</label>
                                <div className="flex items-center gap-4">
                                    {formData.image_url ? (
                                        <div className="w-16 h-16 rounded overflow-hidden border flex items-center justify-center bg-muted text-2xl">
                                            {formData.image_url.startsWith('http') || formData.image_url.startsWith('/') ? (
                                                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <span>{formData.image_url}</span>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={formData.image_url}
                                            onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                            placeholder="Lien d'image ou emoji"
                                            className="w-full px-3 py-2 border rounded-md bg-background mb-2"
                                        />
                                        <input type="file" onChange={handleImageUpload} className="text-xs block w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-4 justify-end">
                            <Button type="button" variant="outline" onClick={() => setIsEditing(null)} className="bg-transparent">
                                Annuler
                            </Button>
                            <Button type="submit" className="gap-2">
                                <Save className="w-4 h-4" />
                                Enregistrer
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {isLoading ? (
                <div className="text-center py-10 text-muted-foreground animate-pulse">Chargement...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map(cat => (
                        <Card key={cat.id} className="overflow-hidden group">
                            <div className="h-32 bg-muted relative">
                                {cat.image_url ? (
                                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleEdit(cat)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(cat.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{cat.description || 'Aucune description'}</p>
                                <div className="mt-2 text-xs font-mono text-muted-foreground bg-muted p-1 rounded inline-block">
                                    {cat.slug}
                                </div>
                            </div>
                        </Card>
                    ))}
                    {categories.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl">
                            <p className="text-muted-foreground">Aucune catégorie trouvée</p>
                            <Button variant="link" onClick={() => handleEdit('new')}>
                                Créer la première catégorie
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
