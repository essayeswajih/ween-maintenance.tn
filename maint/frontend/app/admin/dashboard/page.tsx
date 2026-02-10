'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BarChart3, ShoppingBag, Users, FileText, TrendingUp, AlertCircle, DollarSign, Zap } from 'lucide-react'

export default function AdminDashboard() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const stats = [
    {
      icon: ShoppingBag,
      label: 'Commandes',
      value: '142',
      change: '+12%',
      positive: true,
      color: 'from-blue-500/20 to-blue-500/5',
    },
    {
      icon: Users,
      label: 'Clients',
      value: '856',
      change: '+5%',
      positive: true,
      color: 'from-green-500/20 to-green-500/5',
    },
    {
      icon: FileText,
      label: 'Devis en attente',
      value: '23',
      change: '-2%',
      positive: true,
      color: 'from-yellow-500/20 to-yellow-500/5',
    },
    {
      icon: DollarSign,
      label: 'Revenu (mois)',
      value: '45,230 DT',
      change: '+18%',
      positive: true,
      color: 'from-purple-500/20 to-purple-500/5',
    },
  ]

  const adminMenus = [
    {
      icon: ShoppingBag,
      title: 'Produits',
      description: 'Gérer le catalogue de produits',
      href: '/admin/products',
      count: 127,
    },
    {
      icon: Zap,
      title: 'Services',
      description: 'Gérer les services disponibles',
      href: '/admin/services',
      count: 8,
    },
    {
      icon: ShoppingBag,
      title: 'Commandes',
      description: 'Suivi et gestion des commandes',
      href: '/admin/orders',
      count: 142,
    },
    {
      icon: FileText,
      title: 'Devis',
      description: 'Gérer les demandes de devis',
      href: '/admin/quotes',
      count: 23,
    },
    {
      icon: Users,
      title: 'Clients',
      description: 'Gérer les profils clients',
      href: '/admin/customers',
      count: 856,
    },
    {
      icon: FileText,
      title: 'Factures',
      description: 'Gestion des factures',
      href: '/admin/invoices',
      count: 45,
    },
    {
      icon: FileText,
      title: 'Articles Blog',
      description: 'Gestion du contenu blog',
      href: '/admin/articles',
      count: 24,
    },
    {
      icon: AlertCircle,
      title: 'Paramètres',
      description: 'Configuration globale du système',
      href: '/admin/settings',
    },
  ]

  const recentOrders = [
    { id: '#12345', client: 'Ahmed Hassan', date: '22 Jan 2024', amount: '450 DT', status: 'Expédiée', statusColor: 'bg-blue-100 text-blue-800' },
    { id: '#12346', client: 'Fatima Ali', date: '21 Jan 2024', amount: '320 DT', status: 'En traitement', statusColor: 'bg-yellow-100 text-yellow-800' },
    { id: '#12347', client: 'Mohamed Ben', date: '20 Jan 2024', amount: '680 DT', status: 'Livrée', statusColor: 'bg-green-100 text-green-800' },
    { id: '#12348', client: 'Sara Khalil', date: '19 Jan 2024', amount: '255 DT', status: 'En traitement', statusColor: 'bg-yellow-100 text-yellow-800' },
  ]

  const monthlyData = [
    { month: 'Jan', revenue: 12000, orders: 35 },
    { month: 'Fév', revenue: 15000, orders: 42 },
    { month: 'Mar', revenue: 18000, orders: 58 },
    { month: 'Avr', revenue: 22000, orders: 65 },
    { month: 'Mai', revenue: 25000, orders: 72 },
    { month: 'Juin', revenue: 32000, orders: 89 },
  ]

  return (
    <>
      {/* Header */}
      <section className="p-6 border-b">
        <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-4xl font-bold mb-2">Tableau de bord</h1>
          <p className="text-muted-foreground">Bienvenue dans l'administration Ween-Maintenance.tn</p>
        </div>
      </section>

      {/* Stats */}
      <section className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className={`transition-all duration-700 ${isLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Card className={`p-6 bg-gradient-to-br ${stat.color} border-0`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                    <span className={`text-xs font-semibold ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Revenue Chart Placeholder */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Revenu Mensuel</h2>
          <div className="h-64 bg-muted/50 rounded-lg flex items-end justify-around p-6">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex flex-col items-center gap-2">
                <div
                  className="bg-gradient-to-t from-primary to-accent rounded w-12"
                  style={{ height: `${(data.revenue / 32000) * 150}px` }}
                />
                <span className="text-xs font-medium">{data.month}</span>
                <span className="text-xs text-muted-foreground">{data.revenue / 1000}K</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Admin Menu */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Gestion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminMenus.map((menu, index) => {
              const Icon = menu.icon
              return (
                <div
                  key={menu.href}
                  className={`transition-all duration-700 ${isLoaded
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                    }`}
                  style={{ transitionDelay: `${(index + 4) * 50}ms` }}
                >
                  <Link href={menu.href}>
                    <Card className="h-full p-6 hover:shadow-lg hover:border-primary transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <Icon className="w-8 h-8 text-primary" />
                        {menu.count !== undefined && (
                          <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold">
                            {menu.count}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{menu.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{menu.description}</p>
                      <Button variant="ghost" size="sm" className="gap-2">
                        Accéder →
                      </Button>
                    </Card>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Commandes récentes</h2>
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                Voir toutes
              </Button>
            </Link>
          </div>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Commande</th>
                    <th className="text-left p-4 font-semibold">Client</th>
                    <th className="text-left p-4 font-semibold">Date</th>
                    <th className="text-left p-4 font-semibold">Montant</th>
                    <th className="text-left p-4 font-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium">{order.id}</td>
                      <td className="p-4">{order.client}</td>
                      <td className="p-4 text-muted-foreground">{order.date}</td>
                      <td className="p-4 font-semibold">{order.amount}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>
    </>
  )
}
