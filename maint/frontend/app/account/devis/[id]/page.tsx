'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/context/auth-context'
import { useDevis } from '@/context/devis-context'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  Download,
  Edit2,
  Trash2,
} from 'lucide-react'

interface Params {
  id: string
}

export default function DevisDetailPage({ params }: { params: Promise<Params> }) {
  const unwrappedParams = use(params)
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { getDevisById, updateDevis } = useDevis()
  const [devis, setDevis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDevis = async () => {
      if (!authLoading) {
        setIsLoading(true)
        const foundDevis = await getDevisById(unwrappedParams.id)
        setDevis(foundDevis)
        setIsLoading(false)
      }
    }
    fetchDevis()
  }, [authLoading, unwrappedParams.id, getDevisById])

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4" />
          <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <section className="py-8 bg-muted/50 border-b">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Détail du devis</h1>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Authentification requise</h2>
              <p className="text-muted-foreground mb-6">
                Vous devez vous connecter pour voir les détails du devis.
              </p>
              <Link href="/login">
                <Button className="w-full">Se connecter</Button>
              </Link>
            </Card>
          </div>
        </div>
      </>
    )
  }

  if (!devis) {
    return (
      <>
        <section className="py-8 bg-muted/50 border-b">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Détail du devis</h1>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Devis non trouvé</h2>
              <p className="text-muted-foreground mb-6">
                Le devis que vous recherchez n'existe pas.
              </p>
              <Link href="/account/devis">
                <Button>Retour aux devis</Button>
              </Link>
            </Card>
          </div>
        </div>
      </>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'pending':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />
      case 'rejected':
        return <XCircle className="w-6 h-6 text-red-500" />
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-blue-500" />
      default:
        return <FileText className="w-6 h-6" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepté'
      case 'pending':
        return 'En attente'
      case 'rejected':
        return 'Rejeté'
      case 'completed':
        return 'Complété'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-500 bg-green-500/10'
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10'
      case 'rejected':
        return 'text-red-500 bg-red-500/10'
      case 'completed':
        return 'text-blue-500 bg-blue-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  return (
    <>
      {/* Header */}
      <section className="py-8 bg-muted/50 border-b">
        <div className="container mx-auto px-4">
          <Link href="/account/devis" className="flex items-center gap-2 text-primary hover:gap-3 transition-all mb-4 w-fit">
            <ArrowLeft className="w-5 h-5" />
            Retour aux devis
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{devis.title}</h1>
              <p className="text-muted-foreground">Devis #{devis.id}</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getStatusColor(devis.status)}`}>
              {getStatusIcon(devis.status)}
              <span className="font-semibold uppercase text-xs tracking-wider">{getStatusLabel(devis.status)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card className="p-8">
                <h2 className="text-xl font-bold mb-4">Description</h2>
                <p className="text-foreground leading-relaxed mb-6">
                  {devis.description}
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Type de service</p>
                    <p className="text-lg font-semibold bg-primary/10 text-primary px-3 py-2 rounded w-fit">
                      {devis.serviceType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Date de création</p>
                    <p className="text-lg font-semibold">
                      {new Date(devis.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Location and Contact */}
              <Card className="p-8">
                <h2 className="text-xl font-bold mb-6">Informations du chantier</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Localisation</p>
                      <p className="text-lg font-semibold">{devis.location}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Délai souhaité</p>
                    <p className="text-lg font-semibold">{devis.preferredTimeline || 'Non spécifié'}</p>
                  </div>
                </div>
              </Card>

              {/* Notes */}
              {devis.notes && (
                <Card className="p-8 border-blue-500/20 bg-blue-500/5">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Notes
                  </h2>
                  <p className="text-foreground leading-relaxed">{devis.notes}</p>
                </Card>
              )}

              {/* Proposals */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  Propositions reçues ({devis.proposals?.length || 0})
                </h2>

                {devis.proposals && devis.proposals.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {devis.proposals.map((proposal: any) => (
                      <Card key={proposal.id} className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Freelancer Info */}
                          <div className="flex-shrink-0 flex items-center md:items-start gap-4">
                            <div className="w-16 h-16 rounded-full bg-muted overflow-hidden flex-shrink-0 border-2 border-primary/20">
                              {proposal.freelancer.avatar ? (
                                <img src={proposal.freelancer.avatar} alt={proposal.freelancer.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xl font-bold">
                                  {proposal.freelancer.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{proposal.freelancer.name}</h3>
                              <p className="text-sm text-primary font-medium">{proposal.freelancer.title || 'Professionnel'}</p>
                              <div className="flex items-center gap-1 text-sm mt-1">
                                <CheckCircle className="w-4 h-4 text-green-500 fill-green-500/10" />
                                <span className="text-muted-foreground">{proposal.freelancer.rating || 5.0} / 5</span>
                              </div>
                            </div>
                          </div>

                          {/* Proposal Details */}
                          <div className="flex-grow space-y-3">
                            {proposal.message && (
                              <div className="p-4 bg-muted/50 rounded-lg text-sm italic text-muted-foreground border-l-4 border-primary/20">
                                "{proposal.message}"
                              </div>
                            )}
                            <p className="text-sm text-muted-foreground">
                              Offre reçue le {new Date(proposal.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>

                          {/* Price and Action */}
                          <div className="flex-shrink-0 flex flex-col items-center md:items-end justify-center gap-3">
                            <div className="text-2xl font-bold text-primary">
                              {proposal.price.toFixed(2)} DT
                            </div>
                            <Button size="sm" className="w-full md:w-auto">
                              Accepter l'offre
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center bg-muted/30">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground">Aucune proposition n'a été reçue pour le moment.</p>
                  </Card>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="p-8">
                <h2 className="text-lg font-bold mb-6">Vos coordonnées</h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Téléphone</p>
                      <p className="font-semibold">{devis.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-semibold break-all">{devis.email}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Pricing */}
              <Card className="p-8">
                <h2 className="text-lg font-bold mb-6">Tarification</h2>

                <div className="space-y-4">
                  {devis.estimatedPrice && (
                    <div className="flex items-center justify-between pb-4 border-b">
                      <span className="text-muted-foreground">Devis estimé</span>
                      <span className="font-semibold text-lg">
                        {devis.estimatedPrice.toFixed(2)} TND
                      </span>
                    </div>
                  )}

                  {devis.finalPrice && (
                    <div className="flex items-center justify-between bg-green-500/10 px-4 py-3 rounded-lg">
                      <span className="font-semibold text-green-700">Prix final</span>
                      <span className="font-bold text-lg text-green-700">
                        {devis.finalPrice.toFixed(2)} TND
                      </span>
                    </div>
                  )}

                  {!devis.estimatedPrice && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      En attente d'estimation
                    </p>
                  )}
                </div>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button className="w-full gap-2">
                  <Download className="w-5 h-5" />
                  Télécharger PDF
                </Button>

                {devis.status === 'pending' && (
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <Edit2 className="w-5 h-5" />
                    Modifier
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full gap-2 bg-transparent text-red-600 hover:bg-red-500/10"
                >
                  <Trash2 className="w-5 h-5" />
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
