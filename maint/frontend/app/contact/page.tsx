import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Téléphone',
      details: '+216 27 553 981',
      subtext: 'Lun-Sam: 8h-18h',
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'info@ween-maintenance.tn',
      subtext: 'Réponse dans les 24h',
    },
    {
      icon: MapPin,
      title: 'Adresse',
      details: 'Tunis, Tunisie',
      subtext: 'Bureau central',
    },
    {
      icon: Clock,
      title: 'Heures',
      details: 'Lun-Sam: 8h-18h',
      subtext: 'Dim: Fermé',
    },
  ]

  return (
    <>
      {/* Header */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Nous contacter</h1>
          <p className="text-lg text-muted-foreground">
            Nous sommes toujours heureux de vous aider
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method) => {
            const Icon = method.icon
            return (
              <Card key={method.title} className="p-6 text-center">
                <Icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                <p className="font-medium mb-1">{method.details}</p>
                <p className="text-sm text-muted-foreground">{method.subtext}</p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom</label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    required
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    required
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Téléphone</label>
                <input
                  type="tel"
                  placeholder="+216 27 553 981"
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sujet</label>
                <select className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Sélectionnez un sujet</option>
                  <option>Information sur produit</option>
                  <option>Demande de service</option>
                  <option>Réclamation</option>
                  <option>Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  placeholder="Votre message..."
                  rows={6}
                  required
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>

              <Button type="submit" className="w-full">
                Envoyer le message
              </Button>
            </form>
          </Card>

          {/* Information */}
          <div>
            <Card className="p-8 mb-6">
              <h2 className="text-2xl font-bold mb-4">Informations</h2>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Siège social</h4>
                  <p className="text-muted-foreground">
                    Tunis, Tunisie
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Horaires</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>Lundi - Samedi: 8h00 - 18h00</li>
                    <li>Dimanche: Fermé</li>
                    <li>Urgence 24h/24: +216 27 553 981</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Services</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>✓ Plomberie</li>
                    <li>✓ Électricité</li>
                    <li>✓ Chauffage</li>
                    <li>✓ Chaudières</li>
                    <li>✓ Climatisation</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-primary text-primary-foreground">
              <h3 className="font-bold mb-2">Urgence?</h3>
              <p className="mb-4 opacity-90">
                Pour les urgences, appelez notre numéro d'assistance disponible 24h/24
              </p>
              <Button variant="secondary" className="w-full">
                Appeler maintenant
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Questions fréquentes</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: 'Quel est le délai de réponse?',
              a: 'Nous répondons généralement dans les 24 heures. Pour les urgences, appelez directement notre numéro d\'assistance.',
            },
            {
              q: 'Offrez-vous un service de dépannage d\'urgence?',
              a: 'Oui, nous avons un service d\'urgence disponible 24h/24 pour les interventions critiques.',
            },
            {
              q: 'Travaillez-vous en dehors de Tunis?',
              a: 'Nous couvrons toute la Tunisie. Contactez-nous pour obtenir les détails de déplacement.',
            },
            {
              q: 'Proposez-vous des garanties sur vos services?',
              a: 'Oui, tous nos services sont garantis et nous offrons un suivi client complet.',
            },
          ].map((faq, idx) => (
            <Card key={idx} className="p-6">
              <h4 className="font-semibold mb-2">{faq.q}</h4>
              <p className="text-muted-foreground">{faq.a}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
