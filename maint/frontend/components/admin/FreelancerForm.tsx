'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { apiFetch } from '@/lib/api'

interface FreelancerFormProps {
    initialData?: any
    freelancerId?: number
    isEdit?: boolean
}

export default function FreelancerForm({ initialData, freelancerId, isEdit }: FreelancerFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        tel: '',
        website: '',
        title: '',
        bio: '',
        skills: [] as string[],
        services: [] as string[],
        experience_years: 0,
        hourly_rate: '',
        address: '',
        city: '',
        country: 'Tunisia',
        matricule_fiscale: '',
        cin: '',
        avatar: '',
        cover_image: '',
        verified: false,
        is_active: true,
        notes: '',
        blocked_reason: ''
    })

    const [skillsInput, setSkillsInput] = useState('')
    const [servicesInput, setServicesInput] = useState('')

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...formData,
                ...initialData
            })
            if (initialData.skills) {
                setSkillsInput(initialData.skills.join(', '))
            }
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

        // Process skills and services input
        const skillsList = skillsInput.split(',').map(s => s.trim()).filter(s => s !== '')
        const servicesList = servicesInput.split(',').map(s => s.trim()).filter(s => s !== '')

        const dataToSubmit = {
            ...formData,
            skills: skillsList,
            services: servicesList,
            hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        }

        const endpoint = isEdit
            ? `/freelancers/${freelancerId}`
            : `/freelancers`

        const method = isEdit ? 'PUT' : 'POST'

        try {
            await apiFetch(endpoint, {
                method,
                body: JSON.stringify(dataToSubmit),
            })

            toast.success(isEdit ? 'Freelancer mis à jour' : 'Freelancer créé')
            router.push('/admin/freelancers')
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
                {/* Personal Information */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Informations Personnelles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Prénom *</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nom *</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nom d'utilisateur *</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md bg-background"
                            />
                        </div>
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
                            <label className="text-sm font-medium">Téléphone</label>
                            <input
                                type="text"
                                name="tel"
                                value={formData.tel}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">CIN</label>
                            <input
                                type="text"
                                name="cin"
                                value={formData.cin}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md bg-background"
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Information */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Informations Professionnelles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Titre Professionnel</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md bg-background"
                                placeholder="Ex: Plombier Expert"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Site Web</label>
                            <input
                                type="text"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md bg-background"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Biographie</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={3}
                                className="w-full p-2 border rounded-md bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Compétences (séparées par des virgules)</label>
                            <input
                                type="text"
                                value={skillsInput}
                                onChange={(e) => setSkillsInput(e.target.value)}
                                className="w-full p-2 border rounded-md bg-background"
                                placeholder="Plomberie, Électricité..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Services (séparés par des virgules)</label>
                            <input
                                type="text"
                                value={servicesInput}
                                onChange={(e) => setServicesInput(e.target.value)}
                                className="w-full p-2 border rounded-md bg-background"
                                placeholder="Dépannage, Installation..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Années d'expérience</label>
                            <input
                                type="number"
                                name="experience_years"
                                value={formData.experience_years}
                                onChange={handleChange}
                                min="0"
                                className="w-full p-2 border rounded-md bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tarif Horaire (TND)</label>
                            <input
                                type="number"
                                name="hourly_rate"
                                value={formData.hourly_rate}
                                onChange={handleChange}
                                step="0.01"
                                className="w-full p-2 border rounded-md bg-background"
                            />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Localisation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>
                </div>

                {/* Admin Notes */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Notes Admin</h3>
                    <div className="space-y-4">
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
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/admin/freelancers')}
                        disabled={loading}
                    >
                        Annuler
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Chargement...' : isEdit ? 'Enregistrer les modifications' : 'Créer le freelancer'}
                    </Button>
                </div>
            </form>
        </Card>
    )
}
