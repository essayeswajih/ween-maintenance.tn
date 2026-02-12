'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { SubCategory } from '@/lib/types'
import { toast } from 'sonner'

export default function AdminSubCategoriesPage() {
    const [subcategories, setSubcategories] = useState<SubCategory[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiFetch<SubCategory[]>('/vetrine/subcategories')
                setSubcategories(data || [])
            } catch (err) {
                console.error('Failed to fetch subcategories:', err)
                toast.error('Erreur lors du chargement des sous-catégories')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleDelete = async (id: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette sous-catégorie ?')) return

        try {
            await apiFetch(`/vetrine/subcategories/${id}`, {
                method: 'DELETE'
            })
            setSubcategories(subcategories.filter(s => s.id !== id))
            toast.success('Sous-catégorie supprimée')
        } catch (err) {
            console.error('Failed to delete subcategory:', err)
            toast.error('Erreur lors de la suppression')
        }
    }

    return (
        <div className="p-6">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Gestion des Sous-catégories</h1>
                    <p className="text-muted-foreground mt-1">Gérez vos catégories de produits secondaires.</p>
                </div>
                <Link href="/admin/subcategories/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Ajouter une sous-catégorie
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
                                    <th className="text-left p-4 font-semibold">ID</th>
                                    <th className="text-left p-4 font-semibold">Nom</th>
                                    <th className="text-left p-4 font-semibold">Slug</th>
                                    <th className="text-left p-4 font-semibold">Catégorie Parente</th>
                                    <th className="text-left p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subcategories.map((sub) => (
                                    <tr key={sub.id} className="border-b hover:bg-muted/50 transition-colors">
                                        <td className="p-4 text-muted-foreground">#{sub.id}</td>
                                        <td className="p-4 font-medium">{sub.name}</td>
                                        <td className="p-4 font-mono text-xs">{sub.slug}</td>
                                        <td className="p-4">
                                            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">
                                                {sub.category_name || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-4 flex gap-2 justify-end">
                                            <Link href={`/admin/subcategories/${sub.id}/edit`}>
                                                <Button variant="ghost" size="sm" className="bg-transparent">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(sub.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {subcategories.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            Aucune sous-catégorie trouvée.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    )
}
