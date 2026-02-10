'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, Edit, Trash2, Mail, Phone, MapPin, Briefcase, CheckCircle, XCircle, Plus } from 'lucide-react'
import { apiFetch } from '@/lib/api'

interface Freelancer {
    id: number
    first_name: string
    last_name: string
    username: string
    email: string
    tel: string | null
    title: string | null
    city: string | null
    verified: boolean
    is_active: boolean
    created_at: string
}

export default function AdminFreelancersPage() {
    const [freelancers, setFreelancers] = useState<Freelancer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const fetchFreelancers = async () => {
        try {
            setIsLoading(true)
            const data = await apiFetch<Freelancer[]>('/freelancers')
            setFreelancers(data)
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement des freelancers')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchFreelancers()
    }, [])

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce freelancer ?')) {
            try {
                await apiFetch(`/freelancers/${id}`, { method: 'DELETE' })
                setFreelancers(freelancers.filter(f => f.id !== id))
            } catch (err: any) {
                alert(err.message || 'Erreur lors de la suppression')
            }
        }
    }

    const toggleVerify = async (freelancer: Freelancer) => {
        try {
            await apiFetch(`/freelancers/${freelancer.id}`, {
                method: 'PUT',
                body: JSON.stringify({ verified: !freelancer.verified }),
            })
            setFreelancers(freelancers.map(f =>
                f.id === freelancer.id ? { ...f, verified: !f.verified } : f
            ))
        } catch (err: any) {
            alert(err.message || 'Erreur lors de la mise à jour')
        }
    }

    const filteredFreelancers = freelancers.filter(f =>
        `${f.first_name} ${f.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.title && f.title.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <div className="p-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestion des Freelancers</h1>
                    <p className="text-muted-foreground mt-1">
                        Consultez, vérifiez et gérez les profils des freelancers inscrits.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={fetchFreelancers} variant="outline" size="sm">
                        Actualiser
                    </Button>
                    <Link href="/admin/freelancers/new">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nouveau freelancer
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Search & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Chercher par nom, email ou titre professionnel..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background"
                    />
                </div>
                <Card className="p-3 flex items-center justify-center bg-primary/5 border-primary/20">
                    <span className="text-sm font-medium text-primary">Total: {freelancers.length}</span>
                </Card>
            </div>

            {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium">
                    {error}
                </div>
            )}

            {/* Freelancers Table */}
            <Card className="overflow-hidden shadow-sm border-muted">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="text-left p-4 font-semibold">Freelancer</th>
                                <th className="text-left p-4 font-semibold">Contact</th>
                                <th className="text-left p-4 font-semibold">Localisation</th>
                                <th className="text-left p-4 font-semibold">Status</th>
                                <th className="text-left p-4 font-semibold">Inscrit le</th>
                                <th className="text-right p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-muted-foreground">
                                        Chargement des données...
                                    </td>
                                </tr>
                            ) : filteredFreelancers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-muted-foreground">
                                        Aucun freelancer trouvé.
                                    </td>
                                </tr>
                            ) : (
                                filteredFreelancers.map((freelancer) => (
                                    <tr key={freelancer.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground">{freelancer.first_name} {freelancer.last_name}</span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Briefcase className="w-3 h-3" />
                                                    {freelancer.title || 'Non spécifié'}
                                                </span>
                                                <span className="text-xs text-primary font-medium">@{freelancer.username}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-muted-foreground italic text-xs">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {freelancer.email}
                                                </div>
                                                {freelancer.tel && (
                                                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        {freelancer.tel}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {freelancer.city || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => toggleVerify(freelancer)}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${freelancer.verified
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                    }`}
                                            >
                                                {freelancer.verified ? (
                                                    <><CheckCircle className="w-3.5 h-3.5" /> Vérifié</>
                                                ) : (
                                                    <><XCircle className="w-3.5 h-3.5" /> En attente</>
                                                )}
                                            </button>
                                        </td>
                                        <td className="p-4 text-muted-foreground italic">
                                            {new Date(freelancer.created_at).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/freelancers/${freelancer.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDelete(freelancer.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
