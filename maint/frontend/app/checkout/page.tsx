'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card as UIComponent } from '@/components/ui/card'
import { Truck, Edit as Credit, Car, Lock } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { useCart } from '@/context/cart-context'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'

export default function CheckoutPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { cartItems, subtotal, shippingCost, taxRate, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  })

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('delivery')

  // Autofill when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        fullName: user.full_name || '',
        phone: user.phone || ''
      }))
    }
  }, [isAuthenticated, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      alert('Veuillez remplir tous les champs obligatoires (Nom, Email, Téléphone, Adresse)')
      return
    }

    if (cartItems.length === 0) {
      alert('Votre panier est vide')
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.discounted_price || item.price,
          name: item.name
        })),
        username: formData.fullName,
        email: formData.email,
        telephone: formData.phone,
        location: `${formData.address}, ${formData.city} ${formData.zipCode}`.trim(),
        payment_method: paymentMethod
      }

      await apiFetch('/vetrine/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      })

      clearCart()
      router.push('/checkout/confirmation')
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('Une erreur est survenue lors de la commande. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement...</div>
  }

  return (
    <>
      {/* Header */}
      <section className="py-8 bg-muted/50 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Paiement</h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-8">
              {[
                { number: 1, title: 'Panier', active: false },
                { number: 2, title: 'Livraison', active: false },
                { number: 3, title: 'Paiement', active: true },
              ].map((step) => (
                <div
                  key={step.number}
                  className="flex items-center flex-1"
                >
                  <div
                    className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full font-bold ${step.active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {step.number}
                  </div>
                  {step.number < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${step.active ? 'bg-primary' : 'bg-muted'
                        }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            {/* Shipping Information Form */}
            <UIComponent className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Informations de livraison
              </h2>

              <div className="space-y-4">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom complet</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+216 00 000 000"
                    />
                  </div>
                </div>

                {/* Address Info */}
                <div>
                  <label className="block text-sm font-medium mb-2">Adresse</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="123 Rue de la Paix"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ville</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Tunis"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Code Postal</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="1000"
                    />
                  </div>
                </div>
              </div>
            </UIComponent>

            {/* Payment Method */}
            <UIComponent className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Credit className="w-5 h-5" />
                Méthode de paiement
              </h2>

              <div className="space-y-4">
                {[
                  { id: 'card', name: 'Carte bancaire', description: 'Visa, MasterCard, etc. (Bientôt disponible)' },
                  { id: 'bank', name: 'Virement bancaire', description: 'Transfert direct depuis votre banque (Bientôt disponible)' },
                  { id: 'delivery', name: 'Paiement à la livraison', description: 'Payer le livreur' },
                ].map((method) => (
                  <label key={method.id} className={`flex items-center p-4 border rounded cursor-pointer hover:bg-muted/50 ${paymentMethod === method.id ? 'border-primary bg-primary/5' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="w-4 h-4 text-primary"
                    />
                    <div className="ml-3">
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="mt-6 p-6 bg-muted/50 rounded border animate-in fade-in slide-in-from-top-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Informations de carte</h4>
                    <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Bientôt disponible</span>
                  </div>
                  <div className="space-y-4 opacity-60">
                    <div>
                      <label className="block text-sm font-medium mb-2">Numéro de carte</label>
                      <input
                        type="text"
                        disabled
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border rounded bg-background focus:outline-none cursor-not-allowed"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Expiration</label>
                        <input
                          type="text"
                          disabled
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border rounded bg-background focus:outline-none cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CVV</label>
                        <input
                          type="text"
                          disabled
                          placeholder="123"
                          className="w-full px-4 py-2 border rounded bg-background focus:outline-none cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </UIComponent>

            {/* Terms */}
            <label className="flex items-start gap-3 mb-6">
              <input type="checkbox" className="w-4 h-4 rounded mt-1" defaultChecked />
              <span className="text-sm text-muted-foreground">
                J'accepte les <Link href="/legal/terms" className="text-primary hover:underline">conditions générales</Link> et la
                <Link href="/legal/privacy-policy" className="text-primary hover:underline"> politique de confidentialité</Link>
              </span>
            </label>

            {/* Submit */}
            <Button
              size="lg"
              className="w-full gap-2"
              onClick={handleSubmit}
              disabled={isSubmitting || cartItems.length === 0}
            >
              <Lock className="w-5 h-5" />
              {isSubmitting ? 'Traitement...' : 'Commander'}
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <UIComponent className="p-6 sticky top-20">
              <h3 className="font-bold text-lg mb-4">Résumé de commande</h3>

              <div className="space-y-3 mb-4 pb-4 border-b">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground">Qtd: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{(item.discounted_price || item.price) * item.quantity} DT</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{subtotal.toFixed(2)} DT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>{shippingCost.toFixed(2)} DT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxe ({taxRate * 100}%)</span>
                  <span>{(subtotal * taxRate).toFixed(2)} DT</span>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold text-primary">{(subtotal + shippingCost + (subtotal * taxRate)).toFixed(2)} DT</span>
              </div>
            </UIComponent>
          </div>
        </div>
      </div>
    </>
  )
}
