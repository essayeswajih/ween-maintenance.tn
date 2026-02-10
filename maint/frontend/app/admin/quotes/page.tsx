'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, Eye, Trash2, UserPlus, CheckCircle, XCircle, X, Calendar, MapPin, Phone, Mail, FileText, Edit } from 'lucide-react'
import { apiFetch } from '@/lib/api'

interface Service {
  id: number
  name: string
  slug: string
}

interface QuotationProposal {
  id: number
  freelancer_id: number
  price: number
  message: string | null
  status: string
  created_at: string
}

interface Quotation {
  id: number
  service_id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  postal_code: string | null
  description: string
  preferred_timeline: string | null
  status: string
  created_at: string
  updated_at: string | null
  selected_proposal_id: number | null
  service?: Service
  proposals?: QuotationProposal[]
}

interface Freelancer {
  id: number
  first_name: string
  last_name: string
  email: string
  verified: boolean
}

export default function AdminQuotesPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedQuotationForInvite, setSelectedQuotationForInvite] = useState<number | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [editProposalId, setEditProposalId] = useState<number | null>(null)

  const fetchQuotations = async () => {
    try {
      setIsLoading(true)
      const data = await apiFetch<Quotation[]>('/quotations')
      setQuotations(data)
      setError('')
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des devis')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFreelancers = async () => {
    try {
      const data = await apiFetch<Freelancer[]>('/freelancers')
      setFreelancers(data.filter(f => f.verified))
    } catch (err) {
      console.error('Error fetching freelancers:', err)
    }
  }

  useEffect(() => {
    fetchQuotations()
    fetchFreelancers()
  }, [])

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      try {
        await apiFetch(`/quotations/${id}`, { method: 'DELETE' })
        setQuotations(quotations.filter(q => q.id !== id))
      } catch (err: any) {
        alert(err.message || 'Erreur lors de la suppression')
      }
    }
  }

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await apiFetch(`/quotations/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      })
      setQuotations(quotations.map(q =>
        q.id === id ? { ...q, status: newStatus } : q
      ))
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la mise à jour')
    }
  }

  const openEditModal = (quotation: Quotation) => {
    setEditingQuotation(quotation)
    setEditStatus(quotation.status)
    setEditProposalId(quotation.selected_proposal_id || null)
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editingQuotation) return

    try {
      const updateData: any = {}
      if (editStatus !== editingQuotation.status) {
        updateData.status = editStatus
      }
      if (editProposalId !== editingQuotation.selected_proposal_id) {
        updateData.selected_proposal_id = editProposalId || 0
      }

      await apiFetch(`/quotations/${editingQuotation.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      })

      // Refresh quotations
      await fetchQuotations()
      setShowEditModal(false)
      setEditingQuotation(null)
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la mise à jour')
    }
  }

  const handleInviteFreelancer = async (freelancerId: number) => {
    if (!selectedQuotationForInvite) return

    try {
      await apiFetch(`/quotations/${selectedQuotationForInvite}/invite`, {
        method: 'POST',
        body: JSON.stringify({ freelancer_id: freelancerId }),
      })
      alert('Freelancer invité avec succès')
      setShowInviteModal(false)
      setSelectedQuotationForInvite(null)
      fetchQuotations()
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'invitation')
    }
  }

  const openInviteModal = (quotationId: number) => {
    setSelectedQuotationForInvite(quotationId)
    setShowInviteModal(true)
  }

  const filteredQuotations = quotations.filter(q =>
    `${q.first_name} ${q.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'OPEN': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ASSIGNED': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200'
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente'
      case 'OPEN': return 'Ouvert'
      case 'ASSIGNED': return 'Assigné'
      case 'COMPLETED': return 'Terminé'
      case 'CANCELLED': return 'Annulé'
      default: return status
    }
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Devis</h1>
          <p className="text-muted-foreground mt-1">
            Consultez et gérez les demandes de devis des clients
          </p>
        </div>
        <Button onClick={fetchQuotations} variant="outline" size="sm">
          Actualiser
        </Button>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Chercher par nom, email ou ville..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background"
          />
        </div>
        <Card className="p-3 flex items-center justify-center bg-primary/5 border-primary/20">
          <span className="text-sm font-medium text-primary">Total: {quotations.length}</span>
        </Card>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      {/* Quotations Table */}
      <Card className="overflow-hidden shadow-sm border-muted">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">ID</th>
                <th className="text-left p-4 font-semibold">Client</th>
                <th className="text-left p-4 font-semibold">Service</th>
                <th className="text-left p-4 font-semibold">Localisation</th>
                <th className="text-left p-4 font-semibold">Date</th>
                <th className="text-left p-4 font-semibold">Statut</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-muted-foreground">
                    Chargement des données...
                  </td>
                </tr>
              ) : filteredQuotations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-muted-foreground">
                    Aucun devis trouvé.
                  </td>
                </tr>
              ) : (
                filteredQuotations.map((quotation) => (
                  <tr key={quotation.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-bold text-primary">#{quotation.id}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold">{quotation.first_name} {quotation.last_name}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {quotation.email}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {quotation.phone}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">Service #{quotation.service_id}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        {quotation.city}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(quotation.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(quotation.status)}`}>
                        {getStatusLabel(quotation.status)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => setSelectedQuotation(quotation)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700"
                          onClick={() => openEditModal(quotation)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {quotation.status === 'PENDING' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700"
                            onClick={() => openInviteModal(quotation.id)}
                          >
                            <UserPlus className="w-4 h-4" />
                          </Button>
                        )}
                        {quotation.status === 'PENDING' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:text-green-700"
                              onClick={() => handleStatusUpdate(quotation.id, 'OPEN')}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                              onClick={() => handleStatusUpdate(quotation.id, 'CANCELLED')}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(quotation.id)}
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

      {/* Quotation Details Modal */}
      {selectedQuotation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Détails du Devis #{selectedQuotation.id}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedQuotation(null)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Statut</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(selectedQuotation.status)}`}>
                    {getStatusLabel(selectedQuotation.status)}
                  </span>
                </div>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Prénom</label>
                  <p className="mt-1 font-medium">{selectedQuotation.first_name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Nom</label>
                  <p className="mt-1 font-medium">{selectedQuotation.last_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                    <Mail className="w-4 h-4" /> Email
                  </label>
                  <p className="mt-1">{selectedQuotation.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                    <Phone className="w-4 h-4" /> Téléphone
                  </label>
                  <p className="mt-1">{selectedQuotation.phone}</p>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Adresse
                </label>
                <p className="mt-1">{selectedQuotation.address}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedQuotation.city} {selectedQuotation.postal_code && `- ${selectedQuotation.postal_code}`}
                </p>
              </div>

              {/* Service */}
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Service demandé</label>
                <p className="mt-1 font-medium">Service #{selectedQuotation.service_id}</p>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                  <FileText className="w-4 h-4" /> Description du projet
                </label>
                <p className="mt-1 p-3 bg-muted/50 rounded-lg">{selectedQuotation.description}</p>
              </div>

              {/* Timeline */}
              {selectedQuotation.preferred_timeline && (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Délai souhaité
                  </label>
                  <p className="mt-1">{selectedQuotation.preferred_timeline}</p>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Créé le</label>
                  <p className="mt-1">{new Date(selectedQuotation.created_at).toLocaleString('fr-FR')}</p>
                </div>
                {selectedQuotation.updated_at && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Mis à jour le</label>
                    <p className="mt-1">{new Date(selectedQuotation.updated_at).toLocaleString('fr-FR')}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Invite Freelancer Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Inviter un Freelancer</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowInviteModal(false)
                  setSelectedQuotationForInvite(null)
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {freelancers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucun freelancer vérifié disponible
                </p>
              ) : (
                freelancers.map((freelancer) => (
                  <button
                    key={freelancer.id}
                    onClick={() => handleInviteFreelancer(freelancer.id)}
                    className="w-full p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                    <p className="font-semibold">{freelancer.first_name} {freelancer.last_name}</p>
                    <p className="text-sm text-muted-foreground">{freelancer.email}</p>
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Edit Quotation Modal */}
      {showEditModal && editingQuotation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Modifier le Devis #{editingQuotation.id}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowEditModal(false)
                  setEditingQuotation(null)
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Client Info (Read-only) */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-semibold">{editingQuotation.first_name} {editingQuotation.last_name}</p>
                <p className="text-sm text-muted-foreground">{editingQuotation.email}</p>
                <p className="text-sm text-muted-foreground">{editingQuotation.city}</p>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-sm font-semibold mb-2">Statut</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
                >
                  <option value="PENDING">En attente</option>
                  <option value="OPEN">Ouvert</option>
                  <option value="ASSIGNED">Assigné</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="COMPLETED">Terminé</option>
                  <option value="CANCELLED">Annulé</option>
                </select>
              </div>

              {/* Freelancer/Proposal Selector */}
              {editingQuotation.proposals && editingQuotation.proposals.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Freelancer Assigné</label>
                  <select
                    value={editProposalId || ''}
                    onChange={(e) => setEditProposalId(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
                  >
                    <option value="">Aucun freelancer assigné</option>
                    {editingQuotation.proposals.map((proposal) => (
                      <option key={proposal.id} value={proposal.id}>
                        Freelancer #{proposal.freelancer_id} - {proposal.price} DT ({proposal.status})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sélectionnez un freelancer pour assigner ce devis
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveEdit}
                  className="flex-1"
                >
                  Enregistrer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingQuotation(null)
                  }}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
