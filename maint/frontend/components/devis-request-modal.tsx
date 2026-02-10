'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Calendar, MapPin, Phone, Mail, FileText, ArrowLeft } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'

interface DevisRequestModalProps {
  isOpen: boolean
  onClose: () => void
  serviceId?: number
  categoryId?: number
}

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

export function DevisRequestModal({
  isOpen,
  onClose,
  serviceId,
  categoryId,
}: DevisRequestModalProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState<'category' | 'service' | 'form'>('category')
  const [categories, setCategories] = useState<Category[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(categoryId || null)
  const [selectedService, setSelectedService] = useState<number | null>(serviceId || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    service_id: serviceId || 0,
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
    if (!isOpen) return

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
  }, [isOpen])

  // If serviceId is provided, fetch its category and go directly to form
  useEffect(() => {
    if (!isOpen || !serviceId) return

    const fetchServiceDetails = async () => {
      setLoading(true)
      try {
        const allServices = await apiFetch<Service[]>('/service')
        const service = allServices.find(s => s.id === serviceId)

        if (service && service.category_id) {
          setSelectedCategory(service.category_id)
          setSelectedService(serviceId)
          setFormData({ ...formData, service_id: serviceId })
          setStep('form')
        }
      } catch (err) {
        console.error('Error fetching service:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchServiceDetails()
  }, [isOpen, serviceId])

  // Fetch services when category is selected
  const handleCategorySelect = async (catId: number) => {
    setSelectedCategory(catId)
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch<Service[]>(`/service/category/${catId}`)
      setServices(data)
      setStep('service')
    } catch (err) {
      setError('Erreur lors du chargement des services')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleServiceSelect = (svcId: number) => {
    setSelectedService(svcId)
    setFormData({ ...formData, service_id: svcId })
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

      // Close modal and show success
      onClose()
      alert('Votre demande de devis a été envoyée avec succès!')

      // Reset form
      setFormData({
        service_id: 0,
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        description: '',
        preferred_timeline: '',
      })
      setStep('category')
      setSelectedCategory(null)
      setSelectedService(null)
    } catch (err) {
      setError('Erreur lors de l\'envoi de la demande. Veuillez réessayer.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleBack = () => {
    if (step === 'service') {
      setStep('category')
      setSelectedCategory(null)
    } else if (step === 'form') {
      // If service was pre-selected, go back to category
      if (serviceId) {
        onClose()
      } else {
        setStep('service')
        setSelectedService(null)
      }
    }
  }

  const handleClose = () => {
    setStep('category')
    setSelectedCategory(null)
    setSelectedService(null)
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b p-6 bg-background z-10">
          <div className="flex items-center gap-3">
            {step !== 'category' && !serviceId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                disabled={loading || submitting}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h2 className="text-2xl font-bold">Demander un devis</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={submitting}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress Indicator */}
        {!serviceId && (
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-6">
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
        )}

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Category Selection */}
          {step === 'category' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Sélectionnez une catégorie</h3>
              {loading ? (
                <p className="text-center py-8 text-muted-foreground">Chargement...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        {category.image_url && (
                          <span className="text-3xl">{category.image_url}</span>
                        )}
                        <div>
                          <h4 className="font-semibold">{category.name}</h4>
                          {category.description && (
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Service Selection */}
          {step === 'service' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Sélectionnez un service</h3>
              {loading ? (
                <p className="text-center py-8 text-muted-foreground">Chargement...</p>
              ) : services.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Aucun service disponible</p>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service.id)}
                      className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{service.name}</h4>
                          {service.description && (
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          )}
                        </div>
                        <span className="font-bold text-primary">{service.price} DT</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Form */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Vos informations</h3>

              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prénom *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nom *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Adresse *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ville *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
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
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description du projet *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Décrivez votre projet en détail..."
                />
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Délai souhaité
                </label>
                <select
                  name="preferred_timeline"
                  value={formData.preferred_timeline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Sélectionnez un délai</option>
                  <option value="Urgent (dans les 24h)">Urgent (dans les 24h)</option>
                  <option value="Cette semaine">Cette semaine</option>
                  <option value="Ce mois-ci">Ce mois-ci</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={submitting}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? 'Envoi en cours...' : 'Envoyer la demande'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  )
}

