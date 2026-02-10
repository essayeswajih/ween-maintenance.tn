'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { API_URL, apiFetch } from '@/lib/api'

interface FournisseurFormProps {
    initialData?: any
    fournisseurId?: number
    isEdit?: boolean
}

export default function FournisseurForm({ initialData, fournisseurId, isEdit }: FournisseurFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        company_name: '',
        owner_name: '',
        email: '',
        tel: '',
        main_category: '',
        matricule_fiscale: '',
        forme_juridique: '',
        site: '',
        address: '',
        city: '',
        country: 'Tunisia',
        notes: '',
        is_active: true,
        verified: false,
        services: [] as string[]
    })

    const [servicesInput, setServicesInput] = useState('')

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...formData,
                ...initialData
            })
            if (initialData.services) {
                setServicesInput(initialData.services.join(', '))
            }
        }
    }, [initialData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        setFormData(prev => ({ ...prev, [name]: val }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Process services input
        const servicesList = servicesInput.split(',').map(s => s.trim()).filter(s => s !== '')
        const dataToSubmit = {
            ...formData,
            services: servicesList
        }

        const endpoint = isEdit
            ? `/fournisseur/${fournisseurId}`
            : `/fournisseur`

        const method = isEdit ? 'PUT' : 'POST'

        try {
            await apiFetch(endpoint, {
                method,
                body: JSON.stringify(dataToSubmit),
            })

            toast.success(isEdit ? 'Fournisseur mis à jour' : 'Fournisseur créé')
            router.push('/admin/fournisseurs')
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
                        <label className="text-sm font-medium">Nom de l'entreprise *</label>
                        <input
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md bg-background"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nom du propriétaire</label>
                        <input
                            type="text"
                            name="owner_name"
                            value={formData.owner_name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-background"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md bg-background"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Téléphone *</label>
                        <input
                            type="text"
                            name="tel"
                            value={formData.tel}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md bg-background"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Catégorie principale</label>
                        <input
                            type="text"
                            name="main_category"
                            value={formData.main_category}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-background"
                            placeholder="Ex: Plomberie"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Matricule Fiscale</label>
                        <input
                            type="text"
                            name="matricule_fiscale"
                            value={formData.matricule_fiscale}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-background"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Forme Juridique</label>
                        <input
                            type="text"
                            name="forme_juridique"
                            value={formData.forme_juridique}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-background"
                            placeholder="SARL, SUARL..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Site Web</label>
                        <input
                            type="text"
                            name="site"
                            value={formData.site}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-background"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Adresse</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-background"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Ville</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-background"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Services (séparés par des virgules)</label>
                    <input
                        type="text"
                        value={servicesInput}
                        onChange={(e) => setServicesInput(e.target.value)}
                        className="w-full p-2 border rounded-md bg-background"
                        placeholder="Réparation, Installation, Maintenance..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-2 border rounded-md bg-background"
                    />
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="verified"
                            id="verified"
                            checked={formData.verified}
                            onChange={handleChange}
                            className="w-4 h-4"
                        />
                        <label htmlFor="verified" className="text-sm font-medium">Vérifié</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="is_active"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="w-4 h-4"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium">Actif</label>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/admin/fournisseurs')}
                        disabled={loading}
                    >
                        Annuler
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Chargement...' : isEdit ? 'Enregistrer les modifications' : 'Créer le fournisseur'}
                    </Button>
                </div>
            </form>
        </Card>
    )
}
