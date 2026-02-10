'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Download, Printer, Mail } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function InvoiceDetailPage() {
  const params = useParams()
  const invoiceId = params.id as string

  // Invoice data
  const invoiceData = {
    'INV-2024-001': {
      id: 'INV-2024-001',
      date: '22 Janvier 2024',
      dueDate: '22 Février 2024',
      amount: 450.50,
      status: 'Payée',
      description: 'Commande de matériel de plomberie',
      orderId: '#12345',
      invoiceNumber: 'INV-2024-001',
      companyName: 'Ween-Maintenance.tn',
      companyAddress: 'Rue de la Maintenance, 1000 Tunis',
      companyPhone: '+216 27 553 981',
      companyEmail: 'info@ween-maintenance.tn',
      customerName: 'Ahmed Hassan',
      customerEmail: 'ahmed@example.com',
      customerPhone: '+216 27 553 981',
      customerAddress: 'Avenue Principal, Tunis',
      items: [
        { name: 'Tuyauterie Cuivre 22mm', quantity: 5, unitPrice: 45.00, total: 225.00 },
        { name: 'Robinet Thermostatique', quantity: 2, unitPrice: 79.99, total: 159.98 },
        { name: 'Frais de livraison', quantity: 1, unitPrice: 65.52, total: 65.52 },
      ],
      subtotal: 450.50,
      tax: 0,
      total: 450.50,
      paymentMethod: 'Carte Bancaire',
      paymentStatus: 'Payée',
      paymentDate: '22 Janvier 2024',
      notes: 'Merci pour votre commande! Livraison effectuée avec succès.',
    },
    'INV-2024-002': {
      id: 'INV-2024-002',
      date: '18 Janvier 2024',
      dueDate: '18 Février 2024',
      amount: 890.00,
      status: 'Payée',
      description: 'Intervention plomberie + matériel',
      orderId: '#12340',
      invoiceNumber: 'INV-2024-002',
      companyName: 'Ween-Maintenance.tn',
      companyAddress: 'Rue de la Maintenance, 1000 Tunis',
      companyPhone: '+216 27 553 981',
      companyEmail: 'info@ween-maintenance.tn',
      customerName: 'Fatima Ben',
      customerEmail: 'fatima@example.com',
      customerPhone: '+216 27 553 981',
      customerAddress: 'Boulevard Habib Bourguiba, Tunis',
      items: [
        { name: 'Intervention plombier (4 heures)', quantity: 1, unitPrice: 450.00, total: 450.00 },
        { name: 'Tuyauterie et raccords', quantity: 1, unitPrice: 240.00, total: 240.00 },
        { name: 'Frais de déplacement', quantity: 1, unitPrice: 50.00, total: 50.00 },
        { name: 'Frais de service', quantity: 1, unitPrice: 150.00, total: 150.00 },
      ],
      subtotal: 890.00,
      tax: 0,
      total: 890.00,
      paymentMethod: 'Carte Bancaire',
      paymentStatus: 'Payée',
      paymentDate: '18 Janvier 2024',
      notes: 'Service d\'intervention complété avec satisfaction client confirmée.',
    },
  }

  const invoice = invoiceData[invoiceId as keyof typeof invoiceData] || invoiceData['INV-2024-001']

  return (
    <>
      {/* Header */}
      <section className="py-8 bg-muted/50 border-b">
        <div className="container mx-auto px-4">
          <Link href="/account/invoices" className="flex items-center gap-2 text-primary hover:underline mb-4 w-fit">
            <ArrowLeft className="w-4 h-4" />
            Retour aux factures
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{invoice.id}</h1>
              <p className="text-muted-foreground">Facture du {invoice.date}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${invoice.status === 'Payée'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
                }`}>
                {invoice.status}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Invoice Card */}
          <Card className="p-8 md:p-12 mb-8">
            {/* Invoice Header */}
            <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b">
              {/* Company Info */}
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">{invoice.companyName}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{invoice.companyAddress}</p>
                  <p className="text-sm text-muted-foreground">{invoice.companyPhone}</p>
                  <p className="text-sm text-muted-foreground">{invoice.companyEmail}</p>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="text-right">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Numéro de facture</p>
                    <p className="font-semibold text-lg">{invoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date de facture</p>
                    <p className="font-semibold">{invoice.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date d'échéance</p>
                    <p className="font-semibold">{invoice.dueDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-8 pb-8 border-b">
              <h3 className="font-semibold mb-4">Facturé à:</h3>
              <div className="text-sm">
                <p className="font-medium">{invoice.customerName}</p>
                <p className="text-muted-foreground">{invoice.customerAddress}</p>
                <p className="text-muted-foreground">{invoice.customerEmail}</p>
                <p className="text-muted-foreground">{invoice.customerPhone}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8 pb-8 border-b">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left py-3 font-semibold">Description</th>
                    <th className="text-center py-3 font-semibold">Quantité</th>
                    <th className="text-right py-3 font-semibold">Prix unitaire</th>
                    <th className="text-right py-3 font-semibold">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-4">{item.name}</td>
                      <td className="text-center py-4">{item.quantity}</td>
                      <td className="text-right py-4">{item.unitPrice.toFixed(2)} DT</td>
                      <td className="text-right py-4 font-medium">{item.total.toFixed(2)} DT</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex justify-end mb-8">
              <div className="w-full max-w-xs">
                <div className="flex justify-between py-2">
                  <span>Sous-total:</span>
                  <span>{invoice.subtotal.toFixed(2)} DT</span>
                </div>
                {invoice.tax > 0 && (
                  <div className="flex justify-between py-2">
                    <span>TVA:</span>
                    <span>{invoice.tax.toFixed(2)} DT</span>
                  </div>
                )}
                <div className="flex justify-between py-3 border-t-2 font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">{invoice.total.toFixed(2)} DT</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-muted/50 p-4 rounded-lg mb-8">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-muted-foreground">Méthode de paiement</p>
                  <p className="font-semibold">{invoice.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date de paiement</p>
                  <p className="font-semibold">{invoice.paymentDate}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-8">
                <h4 className="font-semibold text-sm mb-2">Notes:</h4>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-xs text-muted-foreground border-t pt-6">
              <p>Merci pour votre confiance!</p>
              <p>Pour toute question, contactez-nous à {invoice.companyEmail}</p>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-center flex-wrap">
            <Button size="lg" className="gap-2">
              <Download className="w-5 h-5" />
              Télécharger PDF
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-transparent">
              <Printer className="w-5 h-5" />
              Imprimer
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-transparent">
              <Mail className="w-5 h-5" />
              Envoyer par email
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
