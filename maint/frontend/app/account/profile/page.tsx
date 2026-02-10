'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Edit2, Save } from 'lucide-react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+216 27 553 981',
    dateOfBirth: '1990-01-15',
    gender: 'male',
    company: 'Tech Solutions',
    bio: 'Client régulier, travaux de maintenance réguliers',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    setIsEditing(false)
    console.log('Profile updated:', formData)
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
          <h1 className="text-3xl md:text-4xl font-bold">Mon profil</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles</p>
        </div>
      </section>

      {/* Profile Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl">
          {/* Profile Avatar */}
          <Card className="p-8 mb-8 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-4xl text-primary-foreground font-bold">
                {formData.firstName[0]}{formData.lastName[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{formData.firstName} {formData.lastName}</h2>
                <p className="text-muted-foreground">{formData.email}</p>
                <p className="text-sm text-muted-foreground mt-2">Membre depuis 15 Janvier 2024</p>
              </div>
            </div>
          </Card>

          {/* Edit Button */}
          <div className="flex justify-end mb-6">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  Annuler
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Modifier le profil
                </>
              )}
            </Button>
          </div>

          {/* Personal Information */}
          <Card className="p-6 mb-6">
            <h3 className="text-xl font-bold mb-6">Informations personnelles</h3>

            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prénom</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg bg-background disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nom</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg bg-background disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg bg-background disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg bg-background disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Date of Birth and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg bg-background disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Genre</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg bg-background disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium mb-2">Entreprise (optionnel)</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg bg-background disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg bg-background disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={handleSave} className="flex-1">
                    Enregistrer les modifications
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-transparent"
                  >
                    Annuler
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Account Statistics */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6">Statistiques du compte</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">12</p>
                <p className="text-sm text-muted-foreground">Commandes</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">8</p>
                <p className="text-sm text-muted-foreground">Devis</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">1,250 DT</p>
                <p className="text-sm text-muted-foreground">Dépense totale</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </>
  )
}
