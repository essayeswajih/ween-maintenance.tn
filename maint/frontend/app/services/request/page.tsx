'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/context/auth-context'

interface Category {
  id: number
  name: string
  description: string | null
  image_url: string | null
  slug: string
}

interface Service {
  id: number
  name: string
  description: string | null
  price: number
  category_id: number | null
  image_url: string | null
  slug: string
}

interface FormData {
  service_id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  postal_code: string
  description: string
  preferred_timeline: string
}

export default function ServiceRequestPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState<'category' | 'service' | 'form'>('category')
  const [categories, setCategories] = useState<Category[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    service_id: 0,
    first_name: '',
    last_name: '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    postal_code: '',
    description: '',
    preferred_timeline: '',
  })

  // Update form data when user logs in or changes
  useEffect(() => {
    if (user) {
      const nameParts = user.full_name?.split(' ') || []
      setFormData(prev => ({
        ...prev,
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }))
    }
  }, [user])

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await apiFetch<Category[]>('/service/categories')
        setCategories(data)
      } catch (err) {
        setError('Erreur lors du chargement des catégories')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Fetch services when category is selected
  const handleCategorySelect = async (categoryId: number) => {
    setSelectedCategory(categoryId)
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch<Service[]>(`/service/category/${categoryId}`)
      setServices(data)
      setStep('service')
    } catch (err) {
      setError('Erreur lors du chargement des services')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleServiceSelect = (serviceId: number) => {
    setSelectedService(serviceId)
    setFormData({ ...formData, service_id: serviceId })
    setStep('form')
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await apiFetch('/quotations', {
        method: 'POST',
        body: JSON.stringify(formData),
      })
      router.push('/services/request/confirmation')
    } catch (err) {
      setError('Erreur lors de l\'envoi de la demande. Veuillez réessayer.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Header */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Demander un devis</h1>
          <p className="text-lg text-muted-foreground">
            Obtenez un devis gratuit et sans engagement pour vos besoins de maintenance
          </p>
        </div>
      </section>

      {/* Progress Indicator */}
      <div className="container mx-auto px-4 pt-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className={`flex items-center ${step === 'category' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'category' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Catégorie</span>
            </div>
            <div className="flex-1 h-0.5 bg-muted mx-4" />
            <div className={`flex items-center ${step === 'service' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'service' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Service</span>
            </div>
            <div className="flex-1 h-0.5 bg-muted mx-4" />
            <div className={`flex items-center ${step === 'form' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'form' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Détails</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-3xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive">
              {error}
            </div>
          )}

          {/* Step 1: Category Selection */}
          {step === 'category' && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Sélectionnez une catégorie de service</h2>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                  <p className="mt-4 text-muted-foreground">Chargement des catégories...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="flex items-start p-6 border rounded-lg cursor-pointer hover:bg-muted/50 hover:border-primary transition-all text-left"
                    >
                      <div className="text-4xl mr-4">{category.image_url || '📋'}</div>
                      <div>
                        <p className="font-semibold text-lg mb-1">{category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {category.description || 'Services de ' + category.name.toLowerCase()}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Step 2: Service Selection */}
          {step === 'service' && (
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Sélectionnez un service</h2>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep('category')
                    setSelectedCategory(null)
                    setServices([])
                  }}
                >
                  ← Retour
                </Button>
              </div>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                  <p className="mt-4 text-muted-foreground">Chargement des services...</p>
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Aucun service disponible dans cette catégorie.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service.id)}
                      className="flex items-start p-6 border rounded-lg cursor-pointer hover:bg-muted/50 hover:border-primary transition-all text-left"
                    >
                      <div className="text-4xl mr-4">{service.image_url || '🔧'}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-lg mb-1">{service.name}</p>
                            <p className="text-sm text-muted-foreground mb-2">
                              {service.description || 'Service de ' + service.name.toLowerCase()}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-lg font-bold text-primary">{service.price} DT</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Step 3: Form */}
          {step === 'form' && (
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Complétez votre demande</h2>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep('service')
                    setSelectedService(null)
                  }}
                >
                  ← Retour
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Vos informations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom *</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        placeholder="Votre nom"
                        required
                        className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Prénom *</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        placeholder="Votre prénom"
                        required
                        className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="votre@email.com"
                        required
                        className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Téléphone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+216 27 553 981"
                        required
                        className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Localisation</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">Adresse *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Votre adresse"
                      required
                      className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Ville *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Tunis"
                        required
                        className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Code postal</label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        placeholder="1000"
                        className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Détails du projet</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Décrivez votre projet *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Donnez-nous les détails de votre projet..."
                      rows={6}
                      required
                      className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">
                      Délai souhaité
                    </label>
                    <select
                      name="preferred_timeline"
                      value={formData.preferred_timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Sélectionnez un délai</option>
                      <option value="Urgent (1-2 jours)">Urgent (1-2 jours)</option>
                      <option value="Normal (1-2 semaines)">Normal (1-2 semaines)</option>
                      <option value="Sans urgence (2+ semaines)">Sans urgence (2+ semaines)</option>
                    </select>
                  </div>
                </div>

                {/* Submit */}
                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? 'Envoi en cours...' : 'Envoyer la demande de devis'}
                </Button>
              </form>
            </Card>
          )}

          {/* Info */}
          <Card className="mt-8 p-6 bg-muted/50">
            <h3 className="font-bold text-lg mb-4">À savoir</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span>✓</span>
                <span>Devis gratuit et sans engagement</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Réponse rapide dans les 24h</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Experts certifiés et expérimentés</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Service disponible 24h/24 pour les urgences</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}
