'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Edit, Trash2, Search, Eye, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { API_URL, apiFetch } from '@/lib/api'

export default function AdminFournisseursPage() {
    const [suppliers, setSuppliers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchSuppliers()
    }, [])

    const fetchSuppliers = async () => {
        setLoading(true)
        try {
            const data = await apiFetch<any[]>('/fournisseur')
            setSuppliers(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Failed to fetch suppliers:', err)
            toast.error('Erreur lors du chargement des fournisseurs')
            setSuppliers([])
        } finally {
            setLoading(false)
        }
    }

    const filteredSuppliers = suppliers.filter(s =>
        (s.company_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.owner_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.email || "").toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir désactiver ce fournisseur ?')) {
            try {
                await apiFetch(`/fournisseur/${id}`, {
                    method: 'DELETE',
                })
                toast.success('Fournisseur désactivé avec succès')
                setSuppliers(suppliers.map(s => s.id === id ? { ...s, is_active: false } : s))
            } catch (err) {
                console.error('Delete failed:', err)
                toast.error('Erreur lors de la désactivation')
            }
        }
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Gestion des Fournisseurs</h1>
                    <Link href="/admin/fournisseurs/new">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nouveau fournisseur
                        </Button>
                    </Link>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Chercher un fournisseur (nom, email, etc.)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    />
                </div>
            </div>

            {/* Suppliers Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr>
                                <th className="text-left p-4 font-semibold">Entreprise</th>
                                <th className="text-left p-4 font-semibold">Contact</th>
                                <th className="text-left p-4 font-semibold">Catégorie</th>
                                <th className="text-left p-4 font-semibold">Ville</th>
                                <th className="text-left p-4 font-semibold">Status</th>
                                <th className="text-left p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        Chargement des fournisseurs...
                                    </td>
                                </tr>
                            ) : filteredSuppliers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        Aucun fournisseur trouvé.
                                    </td>
                                </tr>
                            ) : filteredSuppliers.map((supplier) => (
                                <tr key={supplier.id} className="border-b hover:bg-muted/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium">{supplier.company_name}</div>
                                        <div className="text-xs text-muted-foreground">{supplier.owner_name}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm">{supplier.email}</div>
                                        <div className="text-xs text-muted-foreground">{supplier.tel}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-primary/5 text-primary px-2 py-1 rounded text-xs font-medium border border-primary/10">
                                            {supplier.main_category || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">
                                        {supplier.city || 'N/A'}
                                    </td>
                                    <td className="p-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            {supplier.is_active ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-red-500" />
                                            )}
                                            {supplier.verified && (
                                                <span className="text-[10px] bg-blue-100 text-blue-600 px-1 rounded font-bold uppercase">Vérifié</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <Link href={`/admin/fournisseurs/${supplier.id}/edit`}>
                                            <Button variant="ghost" size="sm" title="Modifier">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(supplier.id)}
                                            title="Désactiver"
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
        </div>
    )
}
