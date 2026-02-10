'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, MapPin, Edit2, Trash2, Plus, Check } from 'lucide-react'

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Domicile',
      name: 'John Doe',
      street: '123 Rue de la Paix',
      city: 'Tunis',
      postalCode: '1002',
      country: 'Tunisie',
      phone: '+216 27 553 981',
      isDefault: true,
    },
    {
      id: 2,
      label: 'Bureau',
      name: 'John Doe',
      street: '45 Avenue Habib Bourguiba',
      city: 'Tunis',
      postalCode: '1000',
      country: 'Tunisie',
      phone: '+216 27 553 981',
      isDefault: false,
    },
    {
      id: 3,
      label: 'Maison de campagne',
      name: 'John Doe',
      street: '789 Route de Sfax',
      city: 'Sfax',
      postalCode: '3000',
      country: 'Tunisie',
      phone: '+216 27 553 981',
      isDefault: false,
    },
  ])

  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    label: '',
    name: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Tunisie',
    phone: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddAddress = () => {
    if (formData.label && formData.street && formData.city) {
      const newAddress = {
        id: Math.max(...addresses.map(a => a.id), 0) + 1,
        ...formData,
        isDefault: addresses.length === 0,
      }
      setAddresses([...addresses, newAddress])
      setFormData({ label: '', name: '', street: '', city: '', postalCode: '', country: 'Tunisie', phone: '' })
      setIsAddingNew(false)
    }
  }

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(a => a.id !== id))
  }

  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })))
  }

  return (
    <>
      {/* Header */}
      <section className="py-8 bg-muted/50 border-b">
        <div className="container mx-auto px-4">
          <Link href="/account" className="flex items-center gap-2 text-primary hover:underline mb-4 w-fit">
            <ArrowLeft className="w-4 h-4" />
            Retour au compte
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Mes adresses</h1>
              <p className="text-muted-foreground">Gérez vos adresses de livraison</p>
            </div>
            <Button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouvelle adresse
            </Button>
          </div>
        </div>
      </section>

      {/* Add New Address Form */}
      {isAddingNew && (
        <section className="container mx-auto px-4 py-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-6">Ajouter une nouvelle adresse</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Libellé (ex: Domicile, Bureau)</label>
                  <input
                    type="text"
                    name="label"
                    placeholder="Domicile"
                    value={formData.label}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nom complet</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Adresse</label>
                <input
                  type="text"
                  name="street"
                  placeholder="123 Rue de la Paix"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ville</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Tunis"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Code postal</label>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="1002"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Pays</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Tunisie</option>
                    <option>France</option>
                    <option>Belgique</option>
                    <option>Suisse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+216 27 553 981"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddAddress} className="flex-1">
                  Enregistrer l'adresse
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 bg-transparent"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Addresses List */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <Card key={address.id} className={`p-6 relative border-2 transition-all ${address.isDefault ? 'border-primary bg-primary/5' : 'border-border'
              }`}>
              {address.isDefault && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Défaut
                </div>
              )}

              <h3 className="text-lg font-bold mb-1">{address.label}</h3>
              <p className="text-sm text-muted-foreground mb-4">{address.name}</p>

              <div className="space-y-2 text-sm mb-6">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{address.street}</p>
                    <p>{address.postalCode} {address.city}</p>
                    <p>{address.country}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm mb-4">{address.phone}</p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 bg-transparent"
                  onClick={() => setEditingId(address.id)}
                >
                  <Edit2 className="w-4 h-4" />
                  Modifier
                </Button>
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 bg-transparent"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    <Check className="w-4 h-4" />
                    Par défaut
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
