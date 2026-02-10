'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { ChevronDown } from 'lucide-react'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const categories = [
    {
      title: 'Produits',
      faqs: [
        {
          q: 'Quels types de produits vendez-vous?',
          a: 'Nous offrons une large gamme de produits pour la plomberie, l\'électricité, le chauffage et l\'installation de chaudières, incluant des équipements professionnels, des pièces détachées et des outils.',
        },
        {
          q: 'Les produits sont-ils garantis?',
          a: 'Oui, tous nos produits sont garantis selon les normes du fabricant. Les détails de la garantie sont fournis avec chaque achat.',
        },
        {
          q: 'Puis-je retourner un produit?',
          a: 'Les retours sont acceptés dans les 14 jours suivant la livraison, à condition que le produit soit en bon état et dans son emballage original.',
        },
      ],
    },
    {
      title: 'Services',
      faqs: [
        {
          q: 'Comment demander un devis?',
          a: 'Vous pouvez demander un devis en visitant notre page "Demander un devis" et en remplissant le formulaire avec les détails de votre projet.',
        },
        {
          q: 'Quel est le délai pour une intervention?',
          a: 'Le délai varie selon la nature de l\'intervention. Les urgences sont généralement traitées dans les 2-4 heures. Contactez-nous pour plus de détails.',
        },
        {
          q: 'Êtes-vous disponibles le week-end?',
          a: 'Nous sommes disponibles du lundi au samedi de 8h à 18h. Un service d\'urgence 24h/24 est disponible pour les cas critiques.',
        },
      ],
    },
    {
      title: 'Commandes & Livraison',
      faqs: [
        {
          q: 'Quels sont les frais de livraison?',
          a: 'Les frais de livraison dépendent de votre localisation. Les commandes au-delà de 100 DT bénéficient de la livraison gratuite à Tunis.',
        },
        {
          q: 'Combien de temps pour la livraison?',
          a: 'La livraison prend généralement 2-3 jours ouvrables. Des délais accélérés peuvent être arrangés contre des frais supplémentaires.',
        },
        {
          q: 'Puis-je suivre ma commande?',
          a: 'Oui, vous pouvez suivre votre commande en temps réel via votre compte ou en utilisant le lien de suivi envoyé par email.',
        },
      ],
    },
    {
      title: 'Compte & Paiement',
      faqs: [
        {
          q: 'Comment créer un compte?',
          a: 'Cliquez sur "S\'inscrire" dans le menu et remplissez le formulaire avec vos informations personnelles. Vous recevrez un email de confirmation.',
        },
        {
          q: 'Quels sont les moyens de paiement acceptés?',
          a: 'Nous acceptons les cartes bancaires, les virements bancaires, et le paiement à la livraison pour certaines zones.',
        },
        {
          q: 'Mon paiement est-il sécurisé?',
          a: 'Oui, nous utilisons le chiffrement SSL et les normes de sécurité PCI pour protéger vos informations de paiement.',
        },
      ],
    },
  ]

  return (
    <>
      {/* Header */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Questions fréquentes</h1>
          <p className="text-lg text-muted-foreground">
            Trouvez les réponses à vos questions les plus courantes
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {categories.map((category, categoryIdx) => (
            <div key={category.title} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{category.title}</h2>
              <div className="space-y-4">
                {category.faqs.map((faq, faqIdx) => {
                  const globalIdx = categoryIdx * 100 + faqIdx
                  const isOpen = openIndex === globalIdx

                  return (
                    <Card
                      key={globalIdx}
                      className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                      onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                    >
                      <div className="p-6 flex items-center justify-between">
                        <h3 className="font-semibold text-lg pr-4">{faq.q}</h3>
                        <ChevronDown
                          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''
                            }`}
                        />
                      </div>
                      {isOpen && (
                        <div className="px-6 pb-6 border-t text-muted-foreground">
                          {faq.a}
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Vous n'avez pas trouvé votre réponse?</h2>
          <p className="text-muted-foreground mb-6">
            Notre équipe de support est prête à vous aider
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="mailto:info@ween-maintenance.tn"
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Envoyez un email
            </a>
            <a
              href="tel:+21627553981"
              className="inline-flex items-center gap-2 px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
            >
              Appelez-nous
            </a>
          </div>
        </Card>
      </section>
    </>
  )
}
