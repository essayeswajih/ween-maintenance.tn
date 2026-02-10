'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, Eye, Download } from 'lucide-react'

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState([
    { id: 'INV001', customer: 'Ahmed Hassan', date: '22 Jan 2024', amount: 450, status: 'Paid', dueDate: '01 Feb 2024' },
    { id: 'INV002', customer: 'Fatima Ali', date: '21 Jan 2024', amount: 320, status: 'Pending', dueDate: '31 Jan 2024' },
    { id: 'INV003', customer: 'Mohamed Ben', date: '20 Jan 2024', amount: 680, status: 'Paid', dueDate: '30 Jan 2024' },
    { id: 'INV004', customer: 'Sara Khalil', date: '19 Jan 2024', amount: 255, status: 'Pending', dueDate: '29 Jan 2024' },
    { id: 'INV005', customer: 'Ali Mansour', date: '18 Jan 2024', amount: 525, status: 'Paid', dueDate: '28 Jan 2024' },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('Tous')

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.id.includes(searchQuery) || inv.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'Tous' || inv.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    return status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Gestion des Factures</h1>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Chercher une facture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>Tous</option>
            <option>Paid</option>
            <option>Pending</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">Facture</th>
                <th className="text-left p-4 font-semibold">Client</th>
                <th className="text-left p-4 font-semibold">Date</th>
                <th className="text-left p-4 font-semibold">Échéance</th>
                <th className="text-left p-4 font-semibold">Montant</th>
                <th className="text-left p-4 font-semibold">Statut</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">{invoice.id}</td>
                  <td className="p-4">{invoice.customer}</td>
                  <td className="p-4 text-sm text-muted-foreground">{invoice.date}</td>
                  <td className="p-4 text-sm text-muted-foreground">{invoice.dueDate}</td>
                  <td className="p-4 font-semibold">{invoice.amount} DT</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                      {invoice.status === 'Paid' ? 'Payée' : 'En attente'}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <Link href={`/admin/invoices/${invoice.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
