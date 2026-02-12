'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { Category } from '@/lib/types'
import { toast } from 'sonner'

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiFetch<Category[]>('/vetrine/categories')
                setCategories(data || [])
            } catch (err) {
                console.error('Failed to fetch categories:', err)
                toast.error('Erreur lors du chargement des catégories')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleDelete = async (id: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Cela peut affecter les produits associés.')) return

        try {
            await apiFetch(`/vetrine/categories/${id}`, {
                method: 'DELETE'
            })
            setCategories(categories.filter(c => c.id !== id))
            toast.success('Catégorie supprimée')
        } catch (err) {
            console.error('Failed to delete category:', err)
            toast.error('Erreur lors de la suppression')
        }
    }

    return (
        <div className="p-6">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Gestion des Catégories</h1>
                    <p className="text-muted-foreground mt-1">Gérez vos catégories de produits principales.</p>
                </div>
                <Link href="/admin/categories/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Ajouter une catégorie
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <p className="text-muted-foreground animate-pulse">Chargement...</p>
                </div>
            ) : (
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="text-left p-4 font-semibold">Image</th>
                                    <th className="text-left p-4 font-semibold">Nom</th>
                                    <th className="text-left p-4 font-semibold">Description</th>
                                    <th className="text-left p-4 font-semibold">Sous-catégories</th>
                                    <th className="text-left p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id} className="border-b hover:bg-muted/50 transition-colors">
                                        <td className="p-4">
                                            {category.image_url ? (
                                                <div className="w-12 h-12 rounded bg-muted overflow-hidden">
                                                    <img
                                                        src={category.image_url.startsWith('http') ? category.image_url : `/uploads/${category.image_url}`}
                                                        alt={category.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=No+Image')}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                                    Aucune
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 font-medium">{category.name}</td>
                                        <td className="p-4 text-muted-foreground truncate max-w-xs">{category.description || 'N/A'}</td>
                                        <td className="p-4">
                                            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                                                {category.subcategories?.length || 0}
                                            </span>
                                        </td>
                                        <td className="p-4 flex gap-2 justify-end">
                                            <Link href={`/admin/categories/${category.id}/edit`}>
                                                <Button variant="ghost" size="sm" className="bg-transparent">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(category.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    )
}
