'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { API_URL, apiFetch } from '@/lib/api'
import { Blog } from '@/lib/types'

interface BlogFormProps {
    initialData?: Blog
    blogId?: number
    isEdit?: boolean
}

export default function BlogForm({ initialData, blogId, isEdit }: BlogFormProps) {

    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        category: initialData?.category || '',
        image_url: initialData?.image_url || '',
        read_time: initialData?.read_time || '',
        author: initialData?.author || ''
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...formData,
                ...initialData
            })
        }
    }, [initialData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => {
            const newData = { ...prev, [name]: value }
            // Auto-generate slug from title if it's a new post and slug hasn't been manually edited
            if (name === 'title' && !isEdit) {
                newData.slug = value
                    .toLowerCase()
                    .replace(/[^\w ]+/g, '')
                    .replace(/ +/g, '-')
            }
            return newData
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const endpoint = isEdit
            ? `/blogs/${blogId}`
            : `/blogs`

        const method = isEdit ? 'PUT' : 'POST'

        try {
            await apiFetch(endpoint, {
                method,
                body: JSON.stringify(formData),
            })

            toast.success(isEdit ? 'Article mis à jour' : 'Article créé')
            router.push('/admin/articles')
            router.refresh()
        } catch (err: any) {
            console.error('Submit failed:', err)
            toast.error(err.message || 'Une erreur est survenue')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Titre</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md bg-background"
                            placeholder="Ex: Guide d'entretien plomberie"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Slug (URL)</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md bg-background"
                            placeholder="guide-entretien-plomberie"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Catégorie</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-background"
                        >
                            <option value="Plomberie">Plomberie</option>
                            <option value="Électricité">Électricité</option>
                            <option value="Chauffage">Chauffage</option>
                            <option value="Chaudières">Chaudières</option>
                            <option value="Climatisation">Climatisation</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Auteur</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-background"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Temps de lecture</label>
                        <input
                            type="text"
                            name="read_time"
                            value={formData.read_time}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-background"
                            placeholder="5 min"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Image/Emoji</label>
                        <input
                            type="text"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-background"
                            placeholder="📝 or URL"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Extrait (Excerpt)</label>
                    <textarea
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        rows={2}
                        className="w-full p-2 border rounded-md bg-background"
                        placeholder="Bref résumé de l'article..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Contenu (HTML supporté)</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows={10}
                        className="w-full p-2 border rounded-md bg-background font-mono text-sm"
                        placeholder="<h2>Introduction</h2><p>Contenu de l'article...</p>"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/admin/articles')}
                        disabled={loading}
                    >
                        Annuler
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Chargement...' : isEdit ? 'Enregistrer les modifications' : 'Publier l\'article'}
                    </Button>
                </div>
            </form>
        </Card>
    )
}
