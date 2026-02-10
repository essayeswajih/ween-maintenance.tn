'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'

export interface Devis {
  id: string
  serviceId: number
  serviceType: string
  first_name: string
  last_name: string
  title: string
  description: string
  location: string
  phoneNumber: string
  email: string
  preferredTimeline: string
  status: string
  estimatedPrice?: number
  finalPrice?: number
  createdAt: string
  updatedAt: string
  proposals?: Proposal[]
}

export interface Proposal {
  id: string
  price: number
  message?: string
  status: string
  createdAt: string
  freelancer: {
    id: string
    name: string
    title?: string
    avatar?: string
    rating?: number
  }
}

interface DevisContextType {
  devisList: Devis[]
  addDevis: (devis: Omit<Devis, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateDevis: (id: string, updates: Partial<Devis>) => void
  getDevisByUserId: (userId: string) => Promise<Devis[]>
  getDevisById: (id: string) => Promise<Devis | undefined>
  refreshDevis: () => Promise<void>
  loading: boolean
}

const DevisContext = createContext<DevisContextType | undefined>(undefined)

export function DevisProvider({ children }: { children: React.ReactNode }) {
  const [devisList, setDevisList] = useState<Devis[]>([])
  const [loading, setLoading] = useState(true)

  const mapBackendToDevis = (item: any): Devis => {
    return {
      id: item.id.toString(),
      serviceId: item.service_id,
      serviceType: item.service?.name || 'Service',
      first_name: item.first_name,
      last_name: item.last_name,
      title: item.service?.name || 'Demande de devis',
      description: item.description,
      location: `${item.city}${item.address ? `, ${item.address}` : ''}`,
      phoneNumber: item.phone,
      email: item.email,
      preferredTimeline: item.preferred_timeline,
      status: item.status.toLowerCase(),
      // Backend Quotation doesn't have prices yet in the model itself, 
      // but might come from proposals. For now keeping them optional.
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      proposals: item.proposals?.map((p: any) => ({
        id: p.id.toString(),
        price: p.price,
        message: p.message,
        status: p.status,
        createdAt: p.created_at,
        freelancer: {
          id: p.freelancer?.id.toString() || 'Unknown',
          name: p.freelancer ? `${p.freelancer.first_name} ${p.freelancer.last_name}` : 'Professional',
          title: p.freelancer?.title,
          avatar: p.freelancer?.avatar,
          rating: p.freelancer?.rating,
        }
      }))
    }
  }

  const refreshDevis = async () => {
    setLoading(true)
    try {
      const data = await apiFetch('/quotations')
      if (Array.isArray(data)) {
        setDevisList(data.map(mapBackendToDevis))
      }
    } catch (error) {
      console.error('Failed to fetch devis:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshDevis()
  }, [])

  const addDevis = async (devis: any) => {
    try {
      await apiFetch('/quotations', {
        method: 'POST',
        body: JSON.stringify(devis)
      })
      await refreshDevis()
    } catch (error) {
      console.error('Failed to add devis:', error)
      throw error
    }
  }

  const updateDevis = async (id: string, updates: Partial<Devis>) => {
    // Backend doesn't support user-side updates for quotes yet in the plan
    // but we can add refresh logic if needed.
    console.warn('Update devis from user side not yet fully implemented in backend')
  }

  const getDevisByUserId = async (userId: string) => {
    // Already filtered by backend for current user
    return devisList
  }

  const getDevisById = async (id: string) => {
    try {
      const item = await apiFetch(`/quotations/${id}`)
      return mapBackendToDevis(item)
    } catch (error) {
      console.error('Failed to get devis by id:', error)
      return undefined
    }
  }

  return (
    <DevisContext.Provider
      value={{
        devisList,
        addDevis,
        updateDevis,
        getDevisByUserId,
        getDevisById,
        refreshDevis,
        loading,
      }}
    >
      {children}
    </DevisContext.Provider>
  )
}

export function useDevis() {
  const context = useContext(DevisContext)
  if (!context) {
    throw new Error('useDevis must be used within DevisProvider')
  }
  return context
}
