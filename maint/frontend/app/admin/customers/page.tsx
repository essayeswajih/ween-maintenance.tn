'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, Edit, Trash2, Mail, Phone } from 'lucide-react'

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Ahmed Hassan', email: 'ahmed@example.com', phone: '+216 27 553 981', joinDate: '15 Jan 2024', orders: 5 },
    { id: 2, name: 'Fatima Ali', email: 'fatima@example.com', phone: '+216 27 553 981', joinDate: '10 Jan 2024', orders: 3 },
    { id: 3, name: 'Mohamed Ben', email: 'mohamed@example.com', phone: '+216 27 553 981', joinDate: '05 Jan 2024', orders: 8 },
    { id: 4, name: 'Sara Khalil', email: 'sara@example.com', phone: '+216 27 553 981', joinDate: '01 Jan 2024', orders: 2 },
    { id: 5, name: 'Ali Mansour', email: 'ali@example.com', phone: '+216 27 553 981', joinDate: '28 Dec 2023', orders: 6 },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr?')) {
      setCustomers(customers.filter(c => c.id !== id))
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Gestion des Clients</h1>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Chercher un client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Customers Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">Client</th>
                <th className="text-left p-4 font-semibold">Email</th>
                <th className="text-left p-4 font-semibold">Téléphone</th>
                <th className="text-left p-4 font-semibold">Inscrit</th>
                <th className="text-left p-4 font-semibold">Commandes</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">{customer.name}</td>
                  <td className="p-4 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {customer.email}
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {customer.phone}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{customer.joinDate}</td>
                  <td className="p-4">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">
                      {customer.orders}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(customer.id)}
                    >
                      <Trash2 className="w-4 h-4" />
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
