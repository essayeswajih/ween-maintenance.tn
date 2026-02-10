'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/context/auth-context'
import { useDevis } from '@/context/devis-context'
import { DevisRequestModal } from '@/components/devis-request-modal'
import { Calendar, Clock, MapPin, Phone, CheckCircle, AlertCircle, HeadingIcon as PendingIcon, XCircle, FileText, Plus, TrendingUp } from 'lucide-react'

export default function DevisPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const { devisList, loading: devisLoading, refreshDevis } = useDevis()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // refreshDevis is called on mount by the provider

  // Redirect if not authenticated
  if (authLoading) {
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
            <h1 className="text-3xl font-bold">Mes devis</h1>
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
                Vous devez vous connecter pour voir vos devis.
              </p>
              <div className="space-y-3">
                <Link href="/login" className="block">
                  <Button className="w-full">Se connecter</Button>
                </Link>
                <Link href="/register" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    Créer un compte
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <PendingIcon className="w-5 h-5 text-yellow-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      default:
        return <AlertCircle className="w-5 h-5" />
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

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500/10'
      case 'pending':
        return 'bg-yellow-500/10'
      case 'rejected':
        return 'bg-red-500/10'
      case 'completed':
        return 'bg-blue-500/10'
      default:
        return 'bg-gray-500/10'
    }
  }

  return (
    <>
      {/* Header */}
      <section className="py-8 bg-muted/50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">Mes devis</h1>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="w-5 h-5" />
              Nouveau devis
            </Button>
          </div>
          <p className="text-muted-foreground">
            Gérez et suivez tous vos demandes de devis
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-3xl font-bold">{devisList.length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-3xl font-bold">
                    {devisList.filter((d) => d.status === 'pending').length}
                  </p>
                </div>
                <PendingIcon className="w-8 h-8 text-yellow-500 opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Acceptés</p>
                  <p className="text-3xl font-bold">
                    {devisList.filter((d) => d.status === 'accepted').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500 opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Complétés</p>
                  <p className="text-3xl font-bold">
                    {devisList.filter((d) => d.status === 'completed').length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500 opacity-20" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Devis List */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {devisLoading ? (
            <div className="text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-32 bg-muted rounded" />
                <div className="h-32 bg-muted rounded" />
              </div>
            </div>
          ) : devisList.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Aucun devis</h3>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas encore demandé de devis. Commencez par en demander un!
              </p>
              <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                <Plus className="w-5 h-5" />
                Demander un devis
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {devisList.map((devis) => (
                <Link
                  key={devis.id}
                  href={`/account/devis/${devis.id}`}
                >
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start justify-between gap-6">
                      {/* Left Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {devis.title}
                          </h3>
                          <div
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusBgColor(devis.status)}`}
                          >
                            {getStatusIcon(devis.status)}
                            <span className="font-medium">
                              {getStatusLabel(devis.status)}
                            </span>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {devis.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{devis.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{devis.preferredTimeline || 'Non spécifié'}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">
                              {new Date(devis.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Content - Price */}
                      <div className="text-right flex flex-col items-end justify-between">
                        {devis.estimatedPrice && (
                          <div>
                            <p className="text-sm text-muted-foreground">Devis estimé</p>
                            <p className="text-2xl font-bold text-primary">
                              {devis.estimatedPrice.toFixed(2)} TND
                            </p>
                          </div>
                        )}
                        {devis.finalPrice && devis.status === 'completed' && (
                          <div>
                            <p className="text-sm text-muted-foreground">Prix final</p>
                            <p className="text-lg font-semibold">
                              {devis.finalPrice.toFixed(2)} TND
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Devis Request Modal */}
      <DevisRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
