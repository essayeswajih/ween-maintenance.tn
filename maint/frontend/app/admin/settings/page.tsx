'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Save, Mail, Package, Truck, DollarSign } from 'lucide-react'
import { apiFetch } from '@/lib/api'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    store_name: 'Ween-Maintenance.tn',
    email: 'info@ween-maintenance.tn',
    phone: '+216 27 553 981',
    address: 'Tunis, Tunisie',
    shipping_cost: 12,
    free_shipping_threshold: 100,
    tax_rate: 19,
    currency: 'DT',
  })

  const [saved, setSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    apiFetch<any>('/settings')
      .then(data => {
        if (data) {
          setSettings({
            store_name: data.store_name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            shipping_cost: data.shipping_cost,
            free_shipping_threshold: data.free_shipping_threshold,
            tax_rate: data.tax_rate,
            currency: data.currency,
          })
        }
      })
      .catch(err => console.error('Failed to fetch settings:', err))
      .finally(() => setIsLoading(false))
  }, [])

  const handleChange = (field: string, value: string | number) => {
    setSettings({ ...settings, [field]: value })
  }

  const handleSave = () => {
    apiFetch<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
      .then(() => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      })
      .catch(err => console.error('Failed to save settings:', err))
  }

  const sections = [
    {
      icon: Mail,
      title: 'Informations de base',
      fields: [
        { label: 'Nom du magasin', name: 'store_name', type: 'text' },
        { label: 'Email', name: 'email', type: 'email' },
        { label: 'Téléphone', name: 'phone', type: 'tel' },
        { label: 'Adresse', name: 'address', type: 'text' },
      ],
    },
    {
      icon: Truck,
      title: 'Livraison',
      fields: [
        { label: 'Coût de livraison (DT)', name: 'shipping_cost', type: 'number' },
        { label: 'Livraison gratuite à partir de (DT)', name: 'free_shipping_threshold', type: 'number' },
      ],
    },
    {
      icon: DollarSign,
      title: 'Fiscalité',
      fields: [
        { label: 'Taux de taxe (%)', name: 'tax_rate', type: 'number' },
        { label: 'Devise', name: 'currency', type: 'text' },
      ],
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
        <p className="text-muted-foreground">Configurez les paramètres globaux de votre plateforme</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <p className="text-muted-foreground animate-pulse">Chargement des paramètres...</p>
        </div>
      ) : (
        <>
          {/* Notification */}
          {saved && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-800 text-sm font-medium">
              ✓ Paramètres enregistrés avec succès
            </div>
          )}

          {/* Settings Sections */}
          <div className="space-y-6 max-w-4xl">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Card key={section.title} className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Icon className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">{section.title}</h2>
                  </div>

                  <div className="space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium mb-2">{field.label}</label>
                        <input
                          type={field.type}
                          value={settings[field.name as keyof typeof settings]}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              )
            })}

            {/* Additional Settings */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Sauvegardes & Maintenance</h2>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-transparent"
                  onClick={async () => {
                    try {
                      // Use direct fetch for file download
                      const response = await fetch('/api/vetrine/settings/export', {
                        method: 'GET',
                        credentials: 'include'
                      });

                      if (!response.ok) {
                        const err = await response.json().catch(() => ({}));
                        alert('Export failed: ' + (err.detail || 'Unknown error'));
                        return;
                      }

                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = response.headers.get('content-disposition')?.split('filename=')[1] || 'backup.sql';
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                    } catch (e) {
                      console.error(e);
                      alert('An error occurred during export.');
                    }
                  }}
                >
                  Exporter les données
                </Button>

                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  Importer les données
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent text-red-600 hover:text-red-700">
                  Vider le cache
                </Button>
              </div>
            </Card>

            {/* Email Templates */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Modèles d'Email</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  Confirmation de commande
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  Notification de devis
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  Facture
                </Button>
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex gap-3">
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Enregistrer les modifications
              </Button>
              <Button variant="outline" className="bg-transparent">
                Annuler
              </Button>
            </div>
          </div>
        </>
      )
      }
    </div >
  )
}
