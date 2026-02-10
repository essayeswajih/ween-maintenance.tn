'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    ArrowLeft,
    FileText,
    Clock,
    User,
    CheckCircle,
    MapPin,
    Phone,
    Star,
    Droplet,
    Zap,
    Flame,
    Wrench,
    AlertCircle,
} from 'lucide-react'
import { useState } from 'react'
import { Service, Rating } from '@/lib/types'
import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface ServiceContentProps {
    service: Service | null;
    allServices: Service[];
    reviews: Rating[];
}

export default function ServiceContent({ service: initialService, allServices, reviews: initialReviews }: ServiceContentProps) {
    const [service] = useState<Service | null>(initialService)
    // reviews can be updated client side
    const [reviews, setReviews] = useState<Rating[]>(initialReviews)
    const [activeTab, setActiveTab] = useState('reviews')

    // Review form state
    const { user, isAuthenticated } = useAuth()
    const router = useRouter()
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
    const [newRating, setNewRating] = useState(5)
    const [newComment, setNewComment] = useState('')
    const [isSubmittingReview, setIsSubmittingReview] = useState(false)

    const iconMap: Record<string, any> = {
        'plumbing': Droplet,
        'electrical': Zap,
        'heating': Flame,
        'boilers': Wrench,
    }

    if (!service) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold text-destructive">Service non trouvé</h1>
                <Link href="/services">
                    <Button variant="outline">Retour aux services</Button>
                </Link>
            </div>
        )
    }

    const handleAddReviewClick = () => {
        if (!isAuthenticated) {
            router.push('/login')
            return
        }
        setIsReviewModalOpen(true)
    }

    const handleSubmitReview = async () => {
        if (!newComment.trim()) {
            toast.error('Veuillez laisser un commentaire')
            return
        }

        setIsSubmittingReview(true)
        try {
            await apiFetch('/rating', {
                method: 'POST',
                body: JSON.stringify({
                    user_id: user?.id,
                    service_id: service?.id,
                    rating: newRating,
                    comment: newComment
                })
            })

            toast.success('Merci pour votre avis !')
            setIsReviewModalOpen(false)
            setNewComment('')
            setNewRating(5)

            // Refresh reviews
            if (service) {
                try {
                    const updatedReviews = await apiFetch<Rating[]>(`/rating/service/${service.id}`)
                    setReviews(updatedReviews)
                } catch (e) {
                    console.error("Failed to refresh reviews", e)
                }
            }
        } catch (error) {
            console.error('Failed to submit review:', error)
            toast.error('Erreur lors de l\'envoi de l\'avis')
        } finally {
            setIsSubmittingReview(false)
        }
    }

    const Icon = iconMap[service.slug] || Wrench

    return (
        <>
            {/* Header */}
            <section className="py-8 bg-gradient-to-r from-primary/10 via-background to-accent/10 border-b">
                <div className="container mx-auto px-4">
                    <Link href="/services" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Retour aux services
                    </Link>
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-6xl mb-4">{service.image_url}</div>
                            <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(service.rating || 0)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-muted-foreground'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-semibold">{service.rating || '0.0'}</span>
                                    <span className="text-muted-foreground">({service.num_ratings || 0} avis)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Quick Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                <Card className="p-4 text-center border-0 bg-muted/50">
                                    <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                                    <p className="text-sm font-semibold mb-1">Durée moyenne</p>
                                    <p className="text-xs text-muted-foreground">{service.moyDuration} heures</p>
                                </Card>
                                <Card className="p-4 text-center border-0 bg-muted/50">
                                    <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
                                    <p className="text-sm font-semibold mb-1">Disponibilité</p>
                                    <p className="text-xs text-muted-foreground">{service.disponiblity}</p>
                                </Card>
                                <Card className="p-4 text-center border-0 bg-muted/50">
                                    <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                                    <p className="text-sm font-semibold mb-1">Tarif de base</p>
                                    <p className="text-xs text-muted-foreground">{service.price} TND</p>
                                </Card>
                            </div>

                            {/* Description */}
                            <p className="text-muted-foreground mb-8 leading-relaxed text-lg">{service.description}</p>

                            {/* Tabs */}
                            <div className="mb-8">
                                <div className="flex gap-8 border-b mb-8 overflow-x-auto pb-1">
                                    {['reviews', 'overview', 'process'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`pb-4 font-semibold transition-colors ${activeTab === tab
                                                ? 'border-b-2 border-primary text-primary'
                                                : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            {tab === 'reviews' && 'Avis clients'}
                                            {tab === 'overview' && 'Aperçu'}
                                            {tab === 'process' && 'Processus'}
                                        </button>
                                    ))}
                                </div>

                                {/* Overview Tab */}
                                {activeTab === 'overview' && (
                                    <div>
                                        <h3 className="text-xl font-semibold mb-6">Pourquoi choisir ce service?</h3>
                                        <ul className="space-y-4">
                                            {service.features?.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                                                    <span className="text-muted-foreground">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Process Tab */}
                                {activeTab === 'process' && (
                                    <div>
                                        <h3 className="text-xl font-semibold mb-8">Notre processus</h3>
                                        <div className="space-y-6">
                                            {service.process?.map((item) => (
                                                <div key={item.step} className="flex gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
                                                            {item.step}
                                                        </div>
                                                        {item.step < service.process!.length && (
                                                            <div className="w-1 h-12 bg-primary/20 mt-2" />
                                                        )}
                                                    </div>
                                                    <div className="pb-4">
                                                        <h4 className="font-semibold mb-1">{item.title}</h4>
                                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Reviews Tab */}
                                {activeTab === 'reviews' && (
                                    <div>
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-xl font-semibold">Avis clients</h3>
                                            <Button onClick={handleAddReviewClick} size="sm" variant="outline" className="gap-2">
                                                <Star className="w-4 h-4" />
                                                Laisser un avis
                                            </Button>
                                        </div>
                                        <div className="space-y-6">
                                            {reviews.length > 0 ? (
                                                reviews.map((review, i) => (
                                                    <Card key={i} className="p-6 border-0 bg-muted/50">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <p className="font-semibold">{review.user?.full_name || 'Client'}</p>
                                                                <div className="flex gap-1 mt-1">
                                                                    {[...Array(5)].map((_, j) => (
                                                                        <Star
                                                                            key={j}
                                                                            className={`w-4 h-4 ${j < review.rating
                                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                                : 'text-muted-foreground'
                                                                                }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">
                                                                {new Date(review.created_at).toLocaleDateString('fr-FR', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                        <p className="text-muted-foreground">{review.comment}</p>
                                                    </Card>
                                                ))
                                            ) : (
                                                <p className="text-muted-foreground italic">Aucun avis pour le moment.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <Card className="p-6 sticky top-24 border-0 bg-gradient-to-br from-primary/5 to-accent/5">
                                {/* Price */}
                                <div className="mb-8">
                                    <p className="text-sm text-muted-foreground mb-2">À partir de</p>
                                    <p className="text-3xl font-bold text-primary mb-1">{service.price} TND</p>
                                    <p className="text-xs text-muted-foreground">par {service.price_unit}</p>
                                    <p className="text-xs text-muted-foreground mt-4 flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                                        Le prix final peut varier selon votre demande spécifique
                                    </p>
                                </div>

                                {/* CTA Button */}
                                <Link href="/services/request" className="block mb-4">
                                    <Button className="w-full gap-2" size="lg">
                                        <FileText className="w-5 h-5" />
                                        Demander un devis
                                    </Button>
                                </Link>

                                {/* Contact Info */}
                                <div className="space-y-3 pt-6 border-t">
                                    <p className="text-sm font-semibold mb-3">Questions?</p>
                                    <div className="space-y-2">
                                        <a href="tel:+21629999999" className="flex items-center gap-2 text-sm text-primary hover:underline">
                                            <Phone className="w-4 h-4" />
                                            +216 27 553 981
                                        </a>
                                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            Réponse en moins de 2h
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            {/* Trust Badges */}
                            <div className="mt-6 space-y-3">
                                <Card className="p-4 text-center border-0 bg-muted/50">
                                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                    <p className="text-sm font-semibold">Experts certifiés</p>
                                </Card>
                                <Card className="p-4 text-center border-0 bg-muted/50">
                                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                    <p className="text-sm font-semibold">Garantie 2 ans</p>
                                </Card>
                                <Card className="p-4 text-center border-0 bg-muted/50">
                                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                    <p className="text-sm font-semibold">Satisfaction 100%</p>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* Related Services */}
                    <div className="mt-16">
                        <h3 className="text-2xl font-bold mb-8">Autres services</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {allServices
                                .filter((s) => s.slug !== (service?.slug || ''))
                                .map((svc) => (
                                    <Link key={svc.id} href={`/services/${svc.slug}`}>
                                        <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-2 cursor-pointer h-full flex flex-col">
                                            <div className="text-6xl mb-4">{svc.image_url}</div>
                                            <h4 className="font-semibold mb-2 flex-1">{svc.name}</h4>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-semibold">{svc.rating || '0.0'}</span>
                                                <span className="text-muted-foreground">({svc.num_ratings || 0})</span>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Review Modal */}
            <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                <DialogContent className="sm:max-width-[425px]">
                    <DialogHeader>
                        <DialogTitle>Laisser un avis pour {service.name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Votre note</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setNewRating(star)}
                                        className="focus:outline-none"
                                        type="button"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= newRating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-muted-foreground'
                                                } transition-colors hover:scale-110`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Votre commentaire</label>
                            <Textarea
                                placeholder="Racontez-nous votre expérience..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsReviewModalOpen(false)}
                            disabled={isSubmittingReview}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSubmitReview}
                            disabled={isSubmittingReview}
                        >
                            {isSubmittingReview ? 'Envoi...' : 'Publier l\'avis'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
