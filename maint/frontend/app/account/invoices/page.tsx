'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Download, Eye, FileText, Search, Filter } from 'lucide-react'

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const invoices = [
    {
      id: 'INV-2024-001',
      date: '22 Janvier 2024',
      amount: 450.50,
      status: 'Payée',
      description: 'Commande de matériel de plomberie',
      orderId: '#12345',
    },
    {
      id: 'INV-2024-002',
      date: '18 Janvier 2024',
      amount: 890.00,
      status: 'Payée',
      description: 'Intervention plomberie + matériel',
      orderId: '#12340',
    },
    {
      id: 'INV-2024-003',
      date: '15 Janvier 2024',
      amount: 250.00,
      status: 'En attente',
      description: 'Matériel électrique',
      orderId: '#12335',
    },
    {
      id: 'INV-2023-048',
      date: '10 Janvier 2024',
      amount: 1200.00,
      status: 'Payée',
      description: 'Installation chauffage central',
      orderId: '#12330',
    },
    {
      id: 'INV-2023-047',
      date: '8 Janvier 2024',
      amount: 650.75,
      status: 'Payée',
      description: 'Intervention chaudière + pièces',
      orderId: '#12325',
    },
    {
      id: 'INV-2023-046',
      date: '5 Janvier 2024',
      amount: 180.50,
      status: 'En attente',
      description: 'Équipements de maintenance',
      orderId: '#12320',
    },
  ]

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0)

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
              <h1 className="text-3xl md:text-4xl font-bold">Mes factures</h1>
              <p className="text-muted-foreground">Téléchargez vos factures et documents</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Montant total</p>
              <p className="text-3xl font-bold text-primary">{totalAmount.toFixed(2)} DT</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par numéro ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Tous les statuts</option>
              <option value="Payée">Payées</option>
              <option value="En attente">En attente</option>
            </select>
          </div>
        </div>
      </section>

      {/* Invoices List */}
      <section className="container mx-auto px-4 pb-12">
        <div className="space-y-4">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Invoice Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{invoice.id}</h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          invoice.status === 'Payée'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{invoice.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">Commande: {invoice.orderId}</p>
                      <p className="text-xs text-muted-foreground">{invoice.date}</p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{invoice.amount.toFixed(2)} DT</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/account/invoices/${invoice.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Voir</span>
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Télécharger</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune facture trouvée</p>
            </Card>
          )}
        </div>

        {/* Summary Card */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5">
          <h3 className="font-bold mb-4">Résumé des factures</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total factures</p>
              <p className="text-2xl font-bold">{filteredInvoices.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payées</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredInvoices.filter(i => i.status === 'Payée').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">
                {filteredInvoices.filter(i => i.status === 'En attente').length}
              </p>
            </div>
          </div>
        </Card>
      </section>
    </>
  )
}
