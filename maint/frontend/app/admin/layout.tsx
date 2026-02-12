'use client'

import React from "react"

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, BarChart3, Package, Wrench, ShoppingBag, FileText, Users, Settings, LogOut, Image, Tags, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { logout, user } = useAuth()
  const router = useRouter()

  const menuItems = [
    { icon: BarChart3, label: 'Tableau de bord', href: '/admin/dashboard' },
    { icon: Package, label: 'Produits', href: '/admin/products' },
    { icon: Tags, label: 'Catégories', href: '/admin/categories' },
    { icon: Layers, label: 'Sous-catégories', href: '/admin/subcategories' },
    { icon: Wrench, label: 'Services', href: '/admin/services' },
    { icon: ShoppingBag, label: 'Commandes', href: '/admin/orders' },
    { icon: FileText, label: 'Devis', href: '/admin/quotes' },
    { icon: FileText, label: 'Factures', href: '/admin/invoices' },
    { icon: Users, label: 'Clients', href: '/admin/customers' },
    { icon: FileText, label: 'Articles Blog', href: '/admin/articles' },
    { icon: Users, label: 'Fournisseurs', href: '/admin/fournisseurs' },
    { icon: Users, label: 'Freelancers', href: '/admin/freelancers' },
    { icon: Image, label: 'Media', href: '/admin/media' },
    { icon: Settings, label: 'Paramètres', href: '/admin/settings' },
  ]

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'
          } bg-muted border-r transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 border-b flex items-center justify-center px-4">
          <Link href="/admin/dashboard" className="font-bold text-lg">
            {sidebarOpen ? 'ADMIN' : 'A'}
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors text-left">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="border-t p-4 space-y-2">
          {sidebarOpen && (
            <div className="px-2 py-2 rounded bg-primary/10">
              <p className="text-xs font-semibold text-primary">Admin</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent gap-2 justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && 'Déconnecter'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-background flex items-center px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <h1 className="font-semibold">Administration</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  )
}
