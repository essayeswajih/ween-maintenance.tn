'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { User, Mail, Phone, Briefcase, MapPin, Globe, Award, DollarSign, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'

export default function FreelancerRegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        tel: '',
        website: '',
        title: '',
        bio: '',
        skills: '', // Will be split by comma
        services: '', // Will be split by comma
        experience_years: 0,
        hourly_rate: '',
        address: '',
        city: '',
        country: 'Tunisia',
        matricule_fiscale: '',
        cin: '',
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'experience_years' ? parseInt(value) || 0 : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            // Prepare data for API
            const payload = {
                ...formData,
                skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
                services: formData.services ? formData.services.split(',').map(s => s.trim()) : [],
                hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
            }

            await apiFetch('/freelancers', {
                method: 'POST',
                body: JSON.stringify(payload),
            })

            setSuccess(true)
            setTimeout(() => {
                router.push('/')
            }, 3000)
        } catch (err: any) {
            setError(err.message || "Erreur lors de l'inscription")
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
                <Card className="p-8 max-w-md w-full text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Inscription réussie !</h1>
                    <p className="text-muted-foreground">
                        Votre profil de freelancer a été créé avec succès. Un administrateur va examiner votre candidature.
                    </p>
                    <p className="text-sm text-muted-foreground pt-4">
                        Redirection vers l'accueil...
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => router.push('/')}>
                        Aller à l'accueil
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-12 px-4 bg-muted/30">
            <div className="w-full max-w-3xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Rejoignez Ween Maintenance en tant que Freelancer
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Mettez vos compétences au service de nos clients et développez votre activité.
                    </p>
                </div>

                <Card className="p-8 shadow-xl border-t-4 border-t-primary">
                    {error && (
                        <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-destructive" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Identity Section */}
                        <div>
                            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Informations Personnelles
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Prénom *</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nom *</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nom d'utilisateur *</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        placeholder="ex: mohamed_expert"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="votre@email.com"
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Téléphone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="tel"
                                            name="tel"
                                            value={formData.tel}
                                            onChange={handleChange}
                                            placeholder="+216 -- --- ---"
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">CIN</label>
                                    <input
                                        type="text"
                                        name="cin"
                                        value={formData.cin}
                                        onChange={handleChange}
                                        placeholder="Numéro de carte d'identité"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-muted" />

                        {/* Professional Section */}
                        <div>
                            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-primary" />
                                Informations Professionnelles
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Titre Professionnel</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="ex: Electricien Certifié, Plombier Expert"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Biographie / Description</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Parlez-nous de votre expérience et de vos services..."
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Compétences (séparées par des virgules)</label>
                                        <input
                                            type="text"
                                            name="skills"
                                            value={formData.skills}
                                            onChange={handleChange}
                                            placeholder="Electricité, Plomberie, Climatisation"
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Services (séparés par des virgules)</label>
                                        <input
                                            type="text"
                                            name="services"
                                            value={formData.services}
                                            onChange={handleChange}
                                            placeholder="Dépannage urgent, Installation, Entretien"
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Années d'expérience</label>
                                        <div className="relative">
                                            <Award className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="number"
                                                name="experience_years"
                                                value={formData.experience_years}
                                                onChange={handleChange}
                                                min="0"
                                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Tarif Horaire (TND)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="number"
                                                name="hourly_rate"
                                                value={formData.hourly_rate}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-muted" />

                        {/* Location Section */}
                        <div>
                            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                Localisation & Légal
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Adresse</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Ville</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Tunis, Sousse, etc."
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Site Web (Portfolio)</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="url"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleChange}
                                            placeholder="https://votre-site.com"
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Matricule Fiscale (optionnel)</label>
                                    <input
                                        type="text"
                                        name="matricule_fiscale"
                                        value={formData.matricule_fiscale}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full py-6 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Traitement...
                                    </span>
                                ) : 'Soumettre ma candidature'}
                            </Button>
                            <p className="text-center text-xs text-muted-foreground mt-4">
                                En soumettant ce formulaire, vous acceptez nos{' '}
                                <Link href="/legal/terms" className="text-primary hover:underline">conditions d'utilisation</Link>.
                            </p>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
